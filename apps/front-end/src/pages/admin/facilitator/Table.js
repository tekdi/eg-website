import {
  IconByName,
  facilitatorRegistryService,
  ImageView,
  AdminTypo,
  debounce,
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
import { useTranslation } from "react-i18next";
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

// Table component
function Table({
  filter,
  setFilter,
  facilitator,
  facilitaorStatus,
  paginationTotalRows,
  data,
  loading,
}) {
  const { t } = useTranslation();
  const columns = (e) => [
    {
      name: t("NAME"),
      selector: (row) => (
        <HStack alignItems={"center"} space="2">
          {row?.profile_photo_1?.name ? (
            <ImageView
              source={{
                uri: row?.profile_photo_1?.name,
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
  const [modal, setModal] = React.useState(false);

  const navigate = useNavigate();

  const exportPrerakCSV = async () => {
    const result = await facilitatorRegistryService.exportFacilitatorsCsv();
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
            debounce(
              setFilter({ ...filter, search: e.nativeEvent.text, page: 1 }),
              3000
            );
          }}
        />
        <HStack space={2}>
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
                      text={`${
                        process.env.REACT_APP_BASE_URL
                      }/facilitator-self-onboarding/${
                        facilitator?.program_users[0]?.organisation_id ?? ""
                      }`}
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
              setFilter({ ...filter, status: "ALL", page: 1 });
            }}
          >
            {t("BENEFICIARY_ALL")}
            {filter?.status == "ALL" && `(${paginationTotalRows})`}
          </Text>
          {facilitaorStatus?.map((item) => {
            return (
              <Text
                color={filter?.status == t(item?.value) ? "blueText.400" : ""}
                bold={filter?.status == t(item?.value) ? true : false}
                cursor={"pointer"}
                mx={3}
                onPress={() => {
                  setFilter({ ...filter, status: item?.value, page: 1 });
                }}
              >
                {t(item?.title)}
                {filter?.status == t(item?.value) && `(${paginationTotalRows})`}
              </Text>
            );
          })}
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
          setFilter({ ...filter, limit: e });
        }}
        onChangePage={(e) => {
          setFilter({ ...filter, page: e });
        }}
      />
    </VStack>
  );
}

export default Table;
