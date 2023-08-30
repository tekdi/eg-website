import React from "react";
import {
  IconByName,
  AdminLayout as Layout,
  AdminTypo,
  tableCustomStyles,
  BodyMedium,
  getOptions,
  benificiaryRegistoryService,
  facilitatorRegistryService,
  enumRegistryService,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { HStack, VStack, Modal, Alert, Text } from "native-base";
import moment from "moment";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { ChipStatus } from "component/BeneficiaryStatus";
import schema1 from "./Schema";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { FieldTemplate, select } from "../../../component/BaseInput.js";

const Name = (row) => {
  return (
    <VStack alignItems={"center"} space="2">
      <Text color={"textGreyColor.100"} fontSize={"13px"}>
        {row?.first_name}
        {row?.last_name ? " " + row?.last_name : ""}
      </Text>
      <Text color={"textGreyColor.100"} fontSize={"13px"}>
        ({row?.mobile})
      </Text>
    </VStack>
  );
};

const PrerakName = (row) => {
  return (
    <VStack alignItems={"center"} space="2">
      <Text color={"textGreyColor.100"} fontSize={"13px"}>
        {row?.program_beneficiaries?.facilitator_user?.first_name + " "}
        {row?.program_beneficiaries?.facilitator_user?.last_name
          ? row?.program_beneficiaries?.facilitator_user?.last_name
          : ""}
      </Text>
      <Text color={"textGreyColor.100"} fontSize={"13px"}>
        ({row?.program_beneficiaries?.facilitator_user?.mobile})
      </Text>
    </VStack>
  );
};

const status = (row, index) => {
  return (
    <ChipStatus
      key={index}
      is_duplicate={row?.is_duplicate}
      is_deactivated={row?.is_deactivated}
      status={row?.program_beneficiaries?.status}
    />
  );
};

const action = (row, handleCheckboxChange, selectedRows) => {
  return (
    <input
      type="checkbox"
      checked={selectedRows.includes(row.id)}
      onChange={(e) => handleCheckboxChange(e, row)}
    />
  );
};

export default function ReassignBeneficiaries({ footerLinks }) {
  const { t } = useTranslation();
  const { aadhaarNo } = useParams();
  const [schema, setSchema] = React.useState({});
  const [formData, setFormData] = React.useState({});
  const formRef = React.useRef();
  const [errors, setErrors] = React.useState({});
  const [lang] = React.useState(localStorage.getItem("lang"));

  const [selectedRows, setSelectedRows] = React.useState([]);
  const [selectedRowsData, setSelectedRowsData] = React.useState([]);
  const [viewData, setviewData] = React.useState([]);
  const [selectData, setselectData] = React.useState();
  const [data, setData] = React.useState();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalConfirmVisible, setModalConfirmVisible] = React.useState(false);
  const [errormsg, seterrormsg] = React.useState(false);
  const [paginationTotalRows, setPaginationTotalRows] = React.useState(0);
  const [filter, setFilter] = React.useState({
    limit: 10,
    page: 1,
    aadhar_no: aadhaarNo,
  });
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  // Type Of Student

  React.useEffect(async () => {
    const result = await facilitatorRegistryService.filter();
    setselectData(result?.data?.data);
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      setSchema(properties[newSteps[0]]);
    }
  }, []);

  React.useEffect(async () => {
    const ListOfEnum = await enumRegistryService.listOfEnum();
    console.log(ListOfEnum, "ListOfEnum");
    let newSchema = schema;
    if (schema["properties"]["PRERAK_LIST"]) {
      newSchema = getOptions(newSchema, {
        key: "PRERAK_LIST",
        arr: ListOfEnum?.data?.LEARNING_MOTIVATION,
        title: "title",
        value: "value",
      });
    }
    setSchema(newSchema);
  }, [modalVisible]);

  const onChange = async (e, id) => {
    const data = e.formData;
    setErrors();
    const newData = { ...formData, ...data };
    setFormData(newData);
    if (id === "root_mobile") {
      if (data?.mobile?.toString()?.length === 10) {
        const result = await userExist({ mobile: data?.mobile });
        if (result.isUserExist) {
          const newErrors = {
            mobile: {
              __errors: [t("MOBILE_NUMBER_ALREADY_EXISTS")],
            },
          };
          setErrors(newErrors);
        }
      }
    }
  };

  const handleCheckboxChange = (event, row) => {
    const selectedRowIds = [...selectedRows];
    const updatedSelectedRowsData = [...selectedRowsData];
    if (event.target.checked) {
      selectedRowIds.push(row.id);
      updatedSelectedRowsData.push(row);
    } else {
      const index = selectedRowIds.indexOf(row.id);
      if (index !== -1) {
        selectedRowIds.splice(index, 1);
      }
      updatedSelectedRowsData.splice(index, 1);
    }
    setSelectedRows(selectedRowIds);
    setSelectedRowsData(updatedSelectedRowsData);
  };

  // console.log("selectedData", selectedRowsData);

  const columns = (e) => [
    {
      name: t("ACTION"),
      selector: (row) => action(row, handleCheckboxChange, selectedRows),
    },
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
          ? `${row?.district}, ${row?.block}, ${row?.village}, ${row?.grampanchayat}`
          : "-",
      wrap: true,
    },
    {
      name: t("PRERAK_INFO"),
      selector: (row) => PrerakName(row),
      sortable: true,
      attr: "name",
      wrap: true,
    },
    {
      name: t("REASON_OF_DUPLICATION"),
      selector: (row) =>
        row?.duplicate_reason === "FIRST_TIME_REGISTRATION"
          ? t("FIRST_TIME_REGISTRATION")
          : row?.duplicate_reason,
      sortable: true,
      attr: "email",
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

  React.useEffect(async () => {
    const result =
      await benificiaryRegistoryService?.getDuplicateBeneficiariesListByAadhaar(
        filter
      );
    setPaginationTotalRows(result?.count || 0);
    setData(result?.result);
    setLoading(false);
  }, [filter]);

  const assignToPrerak = async (id) => {
    const activeId = { activeId: id };
    const result = await benificiaryRegistoryService?.deactivateDuplicates(
      activeId
    );
    if (!result?.success) {
      seterrormsg(true);
    }
    setModalVisible(false);
    setModalConfirmVisible(true);
  };

  console.log("form", formData);

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
              onPress={(e) => navigate(-1)}
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
                setModalVisible(true);
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
          <DataTable
            customStyles={tableCustomStyles}
            columns={[...columns()]}
            data={data}
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
          <Modal
            isOpen={modalVisible}
            onClose={() => setModalVisible(false)}
            avoidKeyboard
            size="xl"
          >
            <Modal.Content>
              <Modal.CloseButton />
              <Modal.Header textAlign={"left"}>
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
              </Modal.Header>
              <Modal.Body>
                <HStack justifyContent="space-between"></HStack>
                <Form
                  key={lang}
                  ref={formRef}
                  widgets={{ select }}
                  extraErrors={errors}
                  showErrorList={false}
                  noHtml5Validate={true}
                  templates={{
                    FieldTemplate,
                  }}
                  {...{
                    validator,
                    schema: schema || {},
                    formData,
                    onChange,
                  }}
                >
                  <HStack alignItems={"center"}>
                    <Text
                      color="textMaroonColor.400"
                      fontSize="16px"
                      fontWeight="600"
                      mt={5}
                    >
                      {`${t("LEARNERS_NAME")}:`}
                    </Text>
                    {selectedRowsData?.map((item) => {
                      return (
                        <Text mt={5} key={item?.id}>
                          {item?.first_name} {item?.last_name}({item?.id}),
                        </Text>
                      );
                    })}
                  </HStack>
                </Form>

                <Alert status="warning" alignItems={"start"} mb="3" mt="4">
                  <HStack alignItems="center" space="2" color>
                    <Alert.Icon />
                    <BodyMedium>{t("DEACTIVATE_MSG")}</BodyMedium>
                  </HStack>
                </Alert>
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
                    onPress={() => {
                      assignToPrerak(viewData?.id);
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
                        navigate("/admin/learners/duplicates");
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
