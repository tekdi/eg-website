import {
  IconByName,
  ImageView,
  AdminTypo,
  tableCustomStyles,
  AdminLayout as Layout,
  campService,
  calendar,
} from "@shiksha/common-lib";
import moment from "moment";
import { HStack, Image, VStack } from "native-base";
import React from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Chip from "component/Chip";

const PRESENT = "present";
const ABSENT = "absent";

const columns = (t, navigate) => [
  {
    name: t("PERSON_ID"),
    selector: (row) => row?.id,
    wrap: true,
    width: "95px",
    wrap: true,
  },
  {
    name: t("PERSON_NAME"),
    selector: (row) => (
      <HStack alignItems={"center"} space={2}>
        <AdminTypo.H6 bold>
          {[row?.user?.first_name, row?.user?.middle_name, row?.user?.last_name]
            ?.filter((e) => e)
            .join(" ")}
        </AdminTypo.H6>
      </HStack>
    ),
    attr: "name",
    wrap: true,
    width: "250px",
  },
  {
    name: t("DATE_TIME"),
    selector: (row) =>
      row?.date_time ? moment(row?.date_time).format("Do MMM Y h:mma") : "-",
    wrap: true,
  },
  {
    name: t("PERSON_PHOTO"),
    selector: (row) =>
      row?.user?.profile_photo_1 ? (
        <ImageView urlObject={row?.user?.profile_photo_1} />
      ) : (
        "-"
      ),
    wrap: true,
  },
  {
    name: t("ATTENDANCE_PHOTO"),
    selector: (row) =>
      row?.attendance_photo_1 ? (
        <ImageView urlObject={row?.attendance_photo_1} />
      ) : (
        "-"
      ),
    wrap: true,
  },
  {
    name: t("ATTENDANCE_LAT_LONG"),
    selector: (row) => [row?.lat, row?.long].join(", "),
    wrap: true,
  },
  {
    name: t("PRESENT_ABSENT"),
    selector: (row) =>
      row?.status ? (
        <Chip
          py="2"
          px="4"
          bg={row?.status === PRESENT ? "green.200" : "red.200"}
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Chip>
      ) : (
        "-"
      ),
    wrap: true,
  },
  {
    name: t("CONFIDENCE_LEVEL"),
    selector: (row) => row?.fa_similarity_percentage || "-",
    wrap: true,
  },
];

// Table component
function Table() {
  const [attendances, setAttendances] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const id = 69;
  const { t } = useTranslation();
  const navigate = useNavigate();

  React.useEffect(async () => {
    setLoading(false);
  }, []);

  React.useEffect(async () => {
    let ignore = false;
    async function getData() {
      let startDate = moment().add(0, "months").startOf("month");
      let endDate = moment().endOf("month");
      let params = {
        id,
        start_date: startDate?.format("YYYY-MM-DD"),
        end_date: endDate?.format("YYYY-MM-DD"),
      };
      const resultAttendance = await campService.CampAttendance(params);
      if (resultAttendance?.data?.length > 0) {
        setAttendances(resultAttendance?.data);
      }
    }
    await getData();
    setLoading(false);
    return () => {
      ignore = true;
    };
  }, [id]);

  return (
    <Layout>
      <VStack space={"5"} p="6">
        <HStack alignItems="center">
          <IconByName name="GroupLineIcon" _icon={{ size: "35" }} />
          <AdminTypo.H1 px="5">{t("ATTENDANCE")}</AdminTypo.H1>
          <Image
            source={{
              uri: "/box.svg",
            }}
            alt=""
            size={"28px"}
            resizeMode="contain"
          />
        </HStack>
      </VStack>
      <DataTable
        customStyles={tableCustomStyles}
        columns={[...columns(t, navigate)]}
        data={attendances}
        persistTableHead
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={10}
        // onChangeRowsPerPage={(e) => {
        //   setFilter({ ...filter, limit: e, page: 1 });
        // }}
        // onChangePage={(e) => {
        //   setFilter({ ...filter, page: e });
        // }}
        // onRowClicked={handleRowClick}
      />
    </Layout>
  );
}

export default Table;
