import React, { useCallback, useEffect, useState } from "react";
import {
  IconByName,
  AdminLayout as Layout,
  AdminTypo,
  tableCustomStyles,
  BodyMedium,
  benificiaryRegistoryService,
  facilitatorRegistryService,
  geolocationRegistryService,
  setQueryParameters,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import {
  HStack,
  VStack,
  Modal,
  Alert,
  Text,
  Button,
  Input,
  Box,
} from "native-base";
import moment from "moment";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import Chip, { ChipStatus } from "component/BeneficiaryStatus";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { MultiCheck, RadioBtn } from "../../../component/BaseInput.js";
import { debounce } from "lodash";

function CustomFieldTemplate({ id, schema, label, required, children }) {
  const { t } = useTranslation();
  return (
    <VStack borderTopWidth="1" borderTopColor="dividerColor">
      {(!schema?.format || schema?.format !== "hidden") &&
        (label || schema?.label) && (
          <Box>
            {(id !== "root" || schema?.label) && (
              <HStack justifyContent="space-between" width="100%">
                <label
                  style={{
                    fontWeight: "bold",
                    color: "textGreyColor.400",
                    paddingBottom: "12px",
                  }}
                >
                  {t(label)}
                  {required ? "*" : null}
                </label>
                {/* <IconByName name="SearchLineIcon" _icon={{ size: "15px" }} /> */}
              </HStack>
            )}
          </Box>
        )}
      <HStack>{children}</HStack>
    </VStack>
  );
}

const Name = (row) => {
  return (
    <VStack alignItems={"center"} space="2">
      {row?.program_beneficiaries?.status === "enrolled_ip_verified" ? (
        <AdminTypo.H7 bold color={"textGreyColor.100"} fontSize={"13px"}>
          {row?.program_beneficiaries?.enrollment_first_name}
          {row?.program_beneficiaries?.enrollment_last_name
            ? " " + row?.program_beneficiaries?.enrollment_last_name
            : ""}
        </AdminTypo.H7>
      ) : (
        <AdminTypo.H7 bold color={"textGreyColor.100"} fontSize={"13px"}>
          {row?.first_name}
          {row?.last_name ? " " + row?.last_name : ""}
        </AdminTypo.H7>
      )}
      <AdminTypo.H7 bold color={"textGreyColor.100"} fontSize={"13px"}>
        ({row?.mobile})
      </AdminTypo.H7>
    </VStack>
  );
};

const status = (row, index) => {
  return row?.program_beneficiaries?.status ? (
    <ChipStatus
      key={index}
      is_duplicate={row?.is_duplicate}
      is_deactivated={row?.is_deactivated}
      status={row?.program_beneficiaries?.status}
    />
  ) : (
    "-"
  );
};

export default function ReassignBeneficiaries({ footerLinks }) {
  const { t } = useTranslation();
  const { prerakId } = useParams();

  const [filterfunction, setFilterfunction] = useState({
    limit: 10,
    page: 1,
  });
  const [clearvalue, setclearvalue] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);
  const [data, setData] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [errormsg, seterrormsg] = useState(false);
  const [paginationTotalRows, setPaginationTotalRows] = useState(0);
  const [filter, setFilter] = useState({});
  const [loading, setLoading] = useState(true);
  const [prerak, setPrerak] = useState({});
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [getDistrictsAll, setgetDistrictsAll] = useState();
  const [facilitatorFilter, setFacilitatorFilter] = useState();
  const [facilitator, setFacilitator] = useState([]);
  const [isMore, setIsMore] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const facilitatorDetails = async () => {
      const result = await facilitatorRegistryService.filter(facilitatorFilter);
      const newData = result?.data?.data?.map((e) => ({
        value: e?.id,
        label: `${e?.first_name} ${e?.last_name ? e?.last_name : ""}`,
      }));
      setIsMore(
        parseInt(`${result?.data?.currentPage}`) <
          parseInt(`${result?.data?.totalPages}`)
      );
      setFacilitator(newData);
    };
    facilitatorDetails();
  }, [facilitatorFilter]);

  useEffect(async () => {
    let name = "RAJASTHAN";
    const getDistricts = await geolocationRegistryService.getDistricts({
      name,
    });
    setgetDistrictsAll(getDistricts?.districts);
  }, []);

  const handleSelectRow = (state) => {
    seterrormsg(false);
    const arr = state?.selectedRows;
    let newObj = {};
    arr.forEach((e) => {
      newObj = { ...newObj, [e.id]: e };
    });
    setSelectedRows(arr);
  };

  useEffect(async () => {
    const result = await facilitatorRegistryService.getOne({ id: prerakId });
    setPrerak(result);
  }, []);

  const openModal = () => {
    if (selectedRows.length !== 0) {
      setModalVisible(true);
    } else {
      seterrormsg(true);
    }
  };

  const columns = (e) => [
    {
      name: t("LEARNERS_ID"),
      selector: (row) => row?.id,
    },
    {
      name: t("LEARNERS_INFO"),
      selector: (row) => Name(row),
      sortable: true,
      attr: "name",
      wrap: true,
    },
    {
      name: t("DATE_OF_ENTRY_IN_PMS"),
      selector: (row) => moment(row?.created_at).format("DD/MM/YYYY"),
      sortable: true,
      attr: "name",
    },
    {
      name: t("ADDRESS"),
      selector: (row) =>
        row?.district
          ? `${row?.district}, ${row?.block}${
              row?.address && `, ${row?.address}`
            }`
          : "-",
      wrap: true,
    },
    {
      name: t("STATUS"),
      selector: (row, index) => status(row, index),
      sortable: true,
      attr: "email",
      wrap: true,
    },
  ];

  useEffect(async () => {
    const result = await facilitatorRegistryService.getPrerakLearnerList(
      prerakId,
      filter
    );
    setPaginationTotalRows(result?.totalCount || 0);
    setData(result?.data);
    setLoading(false);
  }, [filter]);

  const assignToPrerak = async () => {
    setIsButtonLoading(true);
    const beneficiary_Ids = selectedRows.map((item) => {
      return item?.id;
    });
    const obj = {
      beneficiaryIds: beneficiary_Ids,
      facilitatorId: filterfunction?.facilitator,
    };
    const result = await benificiaryRegistoryService?.ReassignBeneficiaries(
      obj
    );

    if (!result?.success) {
      setIsButtonLoading(false);
      seterrormsg(true);
    }
    setModalVisible(false);
    setModalConfirmVisible(true);
  };

  const handleSearch = (e) => {
    setFacilitatorFilter({
      ...facilitatorFilter,
      search: e.nativeEvent.text,
      page: 1,
    });
  };

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), []);

  return (
    <Layout _sidebar={footerLinks}>
      <HStack>
        <VStack flex={1} space={"5"} p="3" mb="5">
          <HStack alignItems={"center"} space="1" pt="3">
            <IconByName
              name="Home4LineIcon"
              alt="Prerak Orientation"
              size="30px"
              resizeMode="contain"
            />

            <AdminTypo.H1 color="Activatedcolor.400">
              {t("REASSIGN_LEARNERS")}
            </AdminTypo.H1>
            <IconByName
              size="sm"
              name="ArrowRightSLineIcon"
              onPress={(e) => navigate("/admin/learners/reassignList")}
            />
            <AdminTypo.H1
              color="textGreyColor.800"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {t("LEARNERS_LIST")}
            </AdminTypo.H1>

            <AdminTypo.PrimaryButton
              onPress={() => {
                openModal();
              }}
              marginLeft="30px"
              rightIcon={
                <IconByName
                  color="textGreyColor.100"
                  size="10px"
                  name="ShareLineIcon"
                />
              }
            >
              {t("ASSIGN_TO_PRERAK")}
            </AdminTypo.PrimaryButton>
          </HStack>
          {errormsg && (
            <AdminTypo.H4 color="textMaroonColor.400">
              {t("PLEASE_SELECT_A_LEARNER")}
            </AdminTypo.H4>
          )}
          <DataTable
            customStyles={tableCustomStyles}
            columns={[...columns()]}
            data={data}
            selectableRows
            onSelectedRowsChange={handleSelectRow}
            persistTableHead
            progressPending={loading}
            pagination
            paginationRowsPerPageOptions={[10, 15, 25, 50, 100]}
            paginationServer
            paginationTotalRows={paginationTotalRows}
            onChangeRowsPerPage={(e) => {
              setFilter({ ...filter, limit: e });
            }}
            onChangePage={(e) => {
              setFilter({ ...filter, page: e });
            }}
          />
          <Modal isOpen={modalVisible} avoidKeyboard size="xl">
            <Modal.Content>
              <Modal.Header textAlign={"left"}>
                <HStack alignItems={"center"} justifyContent={"space-between"}>
                  <HStack alignItems={"center"}>
                    <IconByName
                      isDisabled
                      name="Chat4LineIcon"
                      color="textGreyColor.100"
                      size="xs"
                    />
                    <AdminTypo.H1
                      marginLeft="10px"
                      color="textGreyColor.500"
                    >{`${t("ASSIGN_TO_PRERAK")}`}</AdminTypo.H1>
                  </HStack>
                  <Button
                    variant="link"
                    marginRight={10}
                    onPress={() => setclearvalue(true)}
                  >
                    <AdminTypo.H6 color="blueText.400" underline bold>
                      {t("CLEAR_FILTER")}
                    </AdminTypo.H6>
                  </Button>
                </HStack>
              </Modal.Header>
              <Modal.Body>
                <HStack alignItems={"center"}>
                  <Text
                    color="textMaroonColor.400"
                    fontSize="16px"
                    fontWeight="600"
                  >
                    {`${t("CURRENT_PRERAK")}: `}
                  </Text>

                  <Text color="black" fontSize="16px" fontWeight="600">
                    {prerak?.first_name} {prerak?.last_name}
                    {prerak?.district
                      ? `(${prerak?.district}, ${prerak?.block})`
                      : ""}
                  </Text>
                </HStack>

                <HStack alignItems={"flex-start"}>
                  <Text
                    color="textMaroonColor.400"
                    fontSize="16px"
                    fontWeight="600"
                    mt={5}
                  >
                    {`${t("LEARNERS_NAME")}:`}
                  </Text>
                  <HStack flex={"Auto"} flexWrap={"wrap"}>
                    {selectedRows?.map((item) => {
                      return (
                        <Chip key={item?.id} mt={5}>
                          {item?.first_name} {item?.last_name}
                          {item?.district
                            ? `(${item?.district}, ${item?.block})`
                            : ""}
                        </Chip>
                      );
                    })}
                  </HStack>
                </HStack>
                <Filter
                  {...{
                    filterfunction,
                    setFilterfunction,
                    clearvalue,
                    setclearvalue,
                    getDistrictsAll,
                    setFacilitatorFilter,
                    facilitatorFilter,
                    isMore,
                    facilitator,
                    debouncedHandleSearch,
                  }}
                />
                <HStack justifyContent="space-between"></HStack>
              </Modal.Body>
              <Modal.Footer>
                <HStack justifyContent="space-between" width="100%">
                  <AdminTypo.Secondarybutton
                    onPress={() => {
                      setModalVisible(false);
                    }}
                  >
                    {t("CANCEL")}
                  </AdminTypo.Secondarybutton>
                  <AdminTypo.PrimaryButton
                    isLoading={isButtonLoading}
                    onPress={() => {
                      assignToPrerak();
                    }}
                  >
                    {t("CONFIRM")}
                  </AdminTypo.PrimaryButton>
                </HStack>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
          <Modal
            isOpen={modalConfirmVisible}
            onClose={() => setModalConfirmVisible(false)}
            avoidKeyboard
            size="xl"
          >
            <Modal.Content>
              <Modal.CloseButton />
              <Modal.Body>
                {errormsg ? (
                  <Alert status="danger" alignItems={"start"} mb="3" mt="4">
                    <HStack alignItems="center" space="2" color>
                      <Alert.Icon />
                      <BodyMedium>{t("FAILED_TO_ASSIGN")}</BodyMedium>
                    </HStack>
                  </Alert>
                ) : (
                  <Alert status="success" alignItems={"start"} mb="3" mt="4">
                    <HStack alignItems="center" space="2" color>
                      <Alert.Icon />
                      <BodyMedium>{t("ASSIGN_SUCCESS")}</BodyMedium>
                    </HStack>
                  </Alert>
                )}
              </Modal.Body>
              <Modal.Footer>
                <HStack justifyContent="center" width="100%">
                  {errormsg ? (
                    <AdminTypo.Secondarybutton
                      onPress={() => {
                        setModalConfirmVisible(false);
                      }}
                    >
                      {t("RETRY")}
                    </AdminTypo.Secondarybutton>
                  ) : (
                    <AdminTypo.Secondarybutton
                      onPress={() => {
                        setModalConfirmVisible(false);
                        navigate("/admin/learners/reassignList");
                      }}
                    >
                      {t("OK")}
                    </AdminTypo.Secondarybutton>
                  )}
                </HStack>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </VStack>
      </HStack>
    </Layout>
  );
}

export const Filter = ({
  filterfunction,
  setFilterfunction,
  clearvalue,
  setclearvalue,
  getDistrictsAll,
  setFacilitatorFilter,
  facilitatorFilter,
  isMore,
  facilitator,
  debouncedHandleSearch,
}) => {
  const { t } = useTranslation();
  const [getBlocksAll, setGetBlocksAll] = useState();

  // facilitator pagination

  const setFilterObject = (data) => {
    if (data?.district) {
      const { district } = data;
      const { block } = data;
      if (district.length > 0) {
        setFacilitatorFilter({ ...facilitatorFilter, district, block });
      }
    }
    setFilterfunction(data);
    setQueryParameters(data);
  };

  const schema = {
    type: "object",
    properties: {
      district: {
        type: "array",
        title: "DISTRICT",
        grid: 1,
        _hstack: {
          maxH: 130,
          overflowY: "scroll",
        },
        items: {
          type: "string",
          enumNames: getDistrictsAll?.map((item, i) => item?.district_name),
          enum: getDistrictsAll?.map((item, i) => item?.district_name),
        },
        uniqueItems: true,
      },
      block: {
        type: "array",
        title: "BLOCKS",
        grid: 1,
        _hstack: {
          maxH: 130,
          overflowY: "scroll",
        },
        items: {
          type: "string",
          enumNames: getBlocksAll?.map((item, i) => item?.block_name),
          enum: getBlocksAll?.map((item, i) => item?.block_name),
        },
        uniqueItems: true,
      },
    },
  };

  const uiSchema = {
    district: {
      "ui:widget": MultiCheck,
      "ui:options": {},
    },
    block: {
      "ui:widget": MultiCheck,
      "ui:options": {},
    },
  };

  useEffect(async () => {
    let blockData = [];
    if (filterfunction?.district?.length > 0) {
      blockData = await geolocationRegistryService.getMultipleBlocks({
        districts: filterfunction?.district,
      });
    }
    if (Array.isArray(blockData)) {
      setGetBlocksAll(blockData);
    }
  }, [filterfunction?.district]);

  const onChange = async (data) => {
    const { district, block } = data?.formData || {};
    setFilterObject({
      ...filterfunction,
      ...(district ? { district } : {}),
      ...(block ? { block } : {}),
    });
  };

  useEffect(() => {
    if (clearvalue) {
      setFacilitatorFilter({});
      setFilterfunction({});
      setFilterObject({});
      setclearvalue(false);
    }
  }, [clearvalue]);

  return (
    <VStack space={8} py="5">
      <HStack space={3}>
        <Form
          schema={schema}
          uiSchema={uiSchema}
          onChange={onChange}
          validator={validator}
          formData={filterfunction}
          templates={{
            FieldTemplate: CustomFieldTemplate,
          }}
        >
          <Button display={"none"} type="submit"></Button>
        </Form>
        <VStack
          borderLeftColor={"dividerColor"}
          borderLeftWidth={"2px"}
          pl={2}
          flex={1}
          space={4}
        >
          <Text bold>{t("PRERAK_LIST")}</Text>
          <Input
            w="100%"
            height="32px"
            placeholder="search"
            variant="outline"
            onChange={debouncedHandleSearch}
          />
          <RadioBtn
            directionColumn={"column"}
            value={
              filterfunction?.facilitator ? filterfunction?.facilitator : []
            }
            onChange={(e) => {
              setFilterfunction({ ...filterfunction, facilitator: e });
            }}
            schema={{
              grid: 1,
              _hstack: {
                maxH: 130,
                overflowY: "scroll",
              },
            }}
            options={{
              enumOptions: facilitator,
            }}
          />
          {isMore && (
            <AdminTypo.H5
              onPress={(e) =>
                setFacilitatorFilter({
                  ...facilitatorFilter,
                  page:
                    (facilitatorFilter?.page
                      ? parseInt(facilitatorFilter?.page)
                      : 1) + 1,
                })
              }
              pr="2"
              color="textMaroonColor.600"
            >
              + {t("MORE")}
            </AdminTypo.H5>
          )}
        </VStack>
      </HStack>
    </VStack>
  );
};
