import {
  IconByName,
  facilitatorRegistryService,
  t,
  ImageView,
  AdminTypo,
  enumRegistryService,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/Chip";
import Clipboard from "component/Clipboard";
import {
  HStack,
  VStack,
  Modal,
  Image,
  Text,
  ScrollView,
  Input,
} from "native-base";

import React from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
const customStyles = {
  rows: {
    style: {
      minHeight: "72px", // override the row height
    },
    style: {
      minHeight: "72px", // override the row height
    },
  },
  headCells: {
    style: {
      background: "#E0E0E0",
      color: "#616161",
      size: "16px",
    },
    style: {
      background: "#E0E0E0",
      color: "#616161",
      size: "16px",
    },
  },
  cells: {
    style: {
      color: "#616161",
      size: "19px",
    },
    style: {
      color: "#616161",
      size: "19px",
    },
  },
};
const columns = (e) => [
  {
    name: t("NAME"),
    selector: (row) => (
      <HStack alignItems={"center"} space="2">
        {row?.documents?.[2]?.name ? (
          <ImageView
            source={{
              uri: row?.documents?.[2]?.name,
            }}
            // alt="Alternate Text"
            width={"35px"}
            height={"35px"}
          />
        ) : (
          <IconByName
            isDisabled
            name="AccountCircleLineIcon"
            color="gray.300"
            _icon={{ size: "35" }}
          />
        )}
        <AdminTypo.H5 bold>
          {row?.first_name + " " + row.last_name}
        </AdminTypo.H5>
      </HStack>
    ),
    sortable: true,
    attr: "name",
  },
  {
    name: t("DISTRICT"),

    selector: (row) => (row?.district ? row?.district : "-"),
  },
  {
    name: t("MOBILE_NUMBER"),
    selector: (row) => row?.mobile,
    sortable: true,
    attr: "email",
  },
  {
    name: t("STATUS"),
    selector: (row, index) => (
      <ChipStatus key={index} status={row?.program_faciltators?.status} />
    ),
    sortable: true,
    attr: "email",
  },
  {
    name: t("GENDER"),
    selector: (row) => row?.gender,
    sortable: true,
    attr: "city",
  },
];

const filters = (data, filter) => {
  return data.filter((item) => {
    for (let key in filter) {
      if (
        item[key] === undefined ||
        !filter[key].includes(
          `${
            item[key] && typeof item[key] === "string"
              ? item[key].trim()
              : item[key]
          }`
        )
      ) {
        return false;
      }
    }

    return true;
  });
};

// Table component
function Table({
  facilitator,
  setadminPage,
  setadminLimit,
  setadminStatus,
  adminStatus,
  adminSearchValue,
  setadminSearchValue,
  admindata,
  formData,
  totalCount,
}) {
  const [data, setData] = React.useState([]);
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState();
  const [paginationTotalRows, setPaginationTotalRows] =
    React.useState(totalCount);
  // const [filterObj, setFilterObj] = React.useState();
  const [modal, setModal] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [facilitaorStatus, setfacilitaorStatus] = React.useState();
  const [status, setstatus] = React.useState("ALL");

  const navigate = useNavigate();

  React.useEffect(async () => {
    setLoading(true);
    setData(admindata);
    setLoading(false);
    setPaginationTotalRows(totalCount);
  }, [admindata]);

  React.useEffect(async () => {
    setPaginationTotalRows(totalCount);
  }, [totalCount]);

  React.useEffect(async () => {
    const result = await enumRegistryService.listOfEnum();
    setfacilitaorStatus(result?.data?.FACILITATOR_STATUS);
  }, []);

  React.useEffect(async () => {
    setLoading(true);

    let _formData = formData;
    let adminpage = page;
    let adminlimit = limit;
    let searchValue = adminSearchValue;

    const result = await facilitatorRegistryService.filter(
      _formData,
      adminpage,
      adminlimit,
      status,
      searchValue
    );
    setData(result.data?.data);
    setPaginationTotalRows(result?.data?.totalCount);
    setLoading(false);
  }, [page, limit, formData]);

  const exportPrerakCSV = async () => {
    const result = await facilitatorRegistryService.exportFacilitatorsCsv();
  };

  const filterByStatus = async (value) => {
    setLoading(true);
    setstatus(value);
    setadminStatus(value);
    let _formData = formData;
    let adminpage = page;
    let adminlimit = limit;
    let adminStatus = value;
    let searchValue = adminSearchValue;

    const result = await facilitatorRegistryService.filter(
      _formData,
      adminpage,
      adminlimit,
      adminStatus,
      searchValue
    );
    setData(result.data?.data);
    setPaginationTotalRows(result?.data?.totalCount);
    // setLimit(result?.limit);
    setLoading(false);
  };

  const searchName = async (e) => {
    let searchValue = e?.nativeEvent?.text;
    setadminSearchValue(searchValue);
    let _formData = formData;
    let adminpage = page;
    let adminlimit = limit;
    let status = adminStatus;
    const result = await facilitatorRegistryService.filter(
      _formData,
      adminpage,
      adminlimit,
      status,
      searchValue
    );
    setData(result.data?.data);
    setPaginationTotalRows(result?.data?.totalCount);
    // setLimit(result?.limit);
    setLoading(false);
  };

  return (
    <VStack>
      <HStack my="1" mb="3" justifyContent="space-between">
        <HStack justifyContent="space-between" alignItems="center">
          <Image
            source={{
              uri: "/profile.svg",
            }}
            alt=""
            size={"xs"}
            resizeMode="contain"
          />
          <AdminTypo.H1 px="5">{t("ALL_PRERAKS")}</AdminTypo.H1>
          <Image
            source={{
              uri: "/box.svg",
            }}
            alt=""
            size={"28px"}
            resizeMode="contain"
          />
        </HStack>
        <Input
          InputLeftElement={
            <IconByName color="coolGray.500" name="SearchLineIcon" />
          }
          placeholder="search"
          variant="outline"
          onChange={(e) => {
            searchName(e);
          }}
        />
        <HStack space={2}>
          {/* <Button
            variant={"primary"}
            onPress={(e) => navigate("/admin/facilitator-onbording")}
          >
            {t("REGISTER_PRERAK")}
          </Button> */}
          <AdminTypo.Secondarybutton
            onPress={() => {
              exportPrerakCSV();
            }}
            rightIcon={
              <IconByName
                color="#084B82"
                _icon={{}}
                size="15px"
                name="ShareLineIcon"
              />
            }
          >
            {t("EXPORT")}
          </AdminTypo.Secondarybutton>
          <AdminTypo.Secondarybutton
            onPress={() => setModal(true)}
            rightIcon={
              <IconByName
                color="#084B82"
                _icon={{}}
                size="15px"
                name="ShareLineIcon"
              />
            }
          >
            {t("SEND_AN_INVITE")}
          </AdminTypo.Secondarybutton>

          <Modal
            isOpen={modal}
            onClose={() => setModal(false)}
            safeAreaTop={true}
            size="xl"
          >
            <Modal.Content>
              <Modal.CloseButton />
              <Modal.Header p="5" borderBottomWidth="0">
                <AdminTypo.H1 textAlign="center">
                  {" "}
                  {t("SEND_AN_INVITE")}
                </AdminTypo.H1>
              </Modal.Header>
              <Modal.Body p="5" pb="10">
                <VStack space="5">
                  <HStack
                    space="5"
                    borderBottomWidth={1}
                    borderBottomColor="gray.300"
                    pb="5"
                  >
                    <AdminTypo.H4> {t("INVITATION_LINK")}</AdminTypo.H4>
                    <Clipboard
                      text={`${process.env.REACT_APP_BASE_URL}/facilitator-self-onboarding/${facilitator?.program_users[0]?.organisation_id}`}
                    >
                      <HStack space="3">
                        <IconByName
                          name="FileCopyLineIcon"
                          isDisabled
                          rounded="full"
                          color="blue.300"
                        />
                        <AdminTypo.H3 color="blue.300">
                          {" "}
                          {t("CLICK_HERE_TO_COPY_THE_LINK")}
                        </AdminTypo.H3>
                      </HStack>
                    </Clipboard>
                  </HStack>
                  {/* <HStack space="5" pt="5">
                    <Input
                      isDisabled
                      flex={0.7}
                      placeholder={t("EMAIL_ID_OR_PHONE_NUMBER")}
                    />
                    <AdminTypo.PrimaryButton isDisabled flex={0.3}>
                      {t("SEND")}
                    </AdminTypo.PrimaryButton>
                  </HStack> */}
                </VStack>
              </Modal.Body>
            </Modal.Content>
          </Modal>
        </HStack>
      </HStack>
      <ScrollView horizontal={true} mb="2">
        <HStack pb="2">
          <Text
            cursor={"pointer"}
            mx={3}
            onPress={() => {
              filterByStatus("ALL");
            }}
          >
            {t("BENEFICIARY_ALL")}
            {status == "ALL" && `(${paginationTotalRows})`}
          </Text>
          {facilitaorStatus?.map((item) => {
            return (
              <Text
                color={status == t(item?.value) ? "blueText.400" : ""}
                bold={status == t(item?.value) ? true : false}
                cursor={"pointer"}
                mx={3}
                onPress={() => {
                  filterByStatus(item?.value);
                }}
              >
                {t(item?.title)}
                {status == t(item?.value) && `(${paginationTotalRows})`}
              </Text>
            );
          })}
          {/* <Text mx={5}>{t("Applied")}</Text>
        <Text mx={5}>{t("Screened")}</Text>
        <Text mx={5}>{t("ALL")}</Text> */}
        </HStack>
      </ScrollView>
      <DataTable
        customStyles={customStyles}
        columns={[
          ...columns(),
          {
            name: t("ACTION"),
            selector: (row) => (
              <AdminTypo.Secondarybutton
                my="3"
                onPress={() => {
                  navigate(`/admin/view/${row?.id}`);
                }}
              >
                {t("VIEW")}
              </AdminTypo.Secondarybutton>
            ),
          },
        ]}
        data={data}
        persistTableHead
        progressPending={loading}
        pagination
        paginationRowsPerPageOptions={[10, 15, 25, 50, 100]}
        paginationServer
        paginationTotalRows={paginationTotalRows}
        onChangeRowsPerPage={(e) => {
          setLimit(e);
          setadminLimit(e);
        }}
        onChangePage={(e) => {
          setPage(e);
          setadminPage(e);
        }}
      />
    </VStack>
  );
}

export default Table;
