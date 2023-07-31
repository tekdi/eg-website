import {
  IconByName,
  benificiaryRegistoryService,
  t,
  ImageView,
  AdminTypo,
  enumRegistryService,
  enrollmentDateOfBirth,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/BeneficiaryStatus";
import Clipboard from "component/Clipboard";
import moment from "moment";
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
          {row?.first_name + " "} {row?.last_name ? row?.last_name : ""}
        </AdminTypo.H5>
      </HStack>
    ),
    sortable: true,
    attr: "name",
  },
  {
    name: t("PRERAK"),

    selector: (row) =>
      row?.program_beneficiaries?.facilitator_user?.first_name
        ? row?.program_beneficiaries?.facilitator_user?.first_name
        : "-",
  },
  {
    name: t("AGE"),

    selector: (row) =>
      row?.program_beneficiaries?.enrollment_dob
        ? moment().diff(row?.program_beneficiaries?.enrollment_dob, "years")
        : moment().diff(row?.dob, "years"),
  },

  {
    name: t("DISTRICT"),

    selector: (row) => (row?.district ? row?.district : "-"),
  },
  {
    name: t("BLOCK"),

    selector: (row) => (row?.block ? row?.block : "-"),
  },

  {
    name: t("STATUS"),
    selector: (row, index) => (
      <ChipStatus key={index} status={row?.program_beneficiaries?.status} />
    ),
    sortable: true,
    attr: "email",
  },
];
// Table component
function Table({ filter, setFilter, paginationTotalRows, data, loading }) {
  const [beneficiaryStatus, setBeneficiaryStatus] = React.useState();
  React.useEffect(async () => {
    const result = await enumRegistryService.listOfEnum();
    setBeneficiaryStatus(result?.data?.BENEFICIARY_STATUS);
  }, []);

  const exportBeneficiaryCSV = async () => {
    const result = await benificiaryRegistoryService.exportBeneficiariesCsv(
      filter
    );
  };

  const exportSubjectCSV = async () => {
    const result =
      await benificiaryRegistoryService.exportBeneficiariesSubjectsCsv(filter);
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
          <AdminTypo.H1 px="5">{t("All_AG_LEARNERS")}</AdminTypo.H1>
          <Image
            source={{
              uri: "/box.svg",
            }}
            alt=""
            size={"28px"}
            resizeMode="contain"
          />
        </HStack>
        {/* <Input
          InputLeftElement={
            <IconByName color="coolGray.500" name="SearchLineIcon" />
          }
          placeholder="search"
          variant="outline"
          onChange={(e) => {
            searchName(e);
          }}
        /> */}
        <HStack space={2}>
          <AdminTypo.Secondarybutton
            onPress={() => {
              exportBeneficiaryCSV();
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
            onPress={() => {
              exportSubjectCSV();
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
            {t("EXPORT_SUBJECT_CSV")}
          </AdminTypo.Secondarybutton>
        </HStack>
      </HStack>
      <ScrollView horizontal={true} mb="2">
        <HStack pb="2">
          <Text
            color={!filter?.status ? "blueText.400" : ""}
            bold={!filter?.status ? true : false}
            cursor={"pointer"}
            mx={3}
            onPress={() => {
              const { status, ...newFilter } = filter;
              setFilter(newFilter);
            }}
          >
            {t("BENEFICIARY_ALL")}
            {!filter?.status && `(${paginationTotalRows})`}
          </Text>
          {beneficiaryStatus?.map((item) => {
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
    </VStack>
  );
}

export default Table;
