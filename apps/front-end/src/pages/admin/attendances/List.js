import {
  IconByName,
  ImageView,
  AdminTypo,
  tableCustomStyles,
  AdminLayout as Layout,
  attendanceService,
} from "@shiksha/common-lib";
import moment from "moment";
import { HStack, Image, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Chip from "component/Chip";

const PRESENT = "present";

const RenderAttendee = ({ row, t }) => (
  <Chip
    py="1px"
    label={
      <AdminTypo.H6 bold>
        {row?.fa_is_processed === null
          ? t("NO")
          : row?.fa_is_processed === true
          ? t("YES") + " " + row?.fa_similarity_percentage?.toFixed(2) + "%"
          : t("NO")}
      </AdminTypo.H6>
    }
    rounded="lg"
  />
);
const columns = (t) => [
  {
    name: t("PERSON_ID"),
    selector: (row) => row?.user_id,
    wrap: true,
    width: "95px",
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
      row?.user?.profile_photo_1?.length ? (
        <ImageView
          source={{ document_id: row?.user?.profile_photo_1?.[0]?.id }}
        />
      ) : (
        "-"
      ),
    wrap: true,
  },
  {
    name: t("ATTENDANCE_PHOTO"),
    selector: (row) =>
      row?.photo_1 && row?.status === PRESENT ? (
        isNaN(parseInt(row?.photo_1)) ? (
          <ImageView source={{ uri: row?.photo_1 }} />
        ) : (
          <ImageView source={{ document_id: row?.photo_1 }} />
        )
      ) : (
        "-"
      ),
    wrap: true,
  },
  {
    name: t("ATTENDANCE_LAT_LONG"),
    selector: (row) => [row?.lat, row?.long].filter((e) => e).join(", "),
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
    selector: (row) => <RenderAttendee row={row || {}} t={t} />,
    wrap: true,
  },
];

// Table component
function Table() {
  const [attendances, setAttendances] = useState([]);
  const [filter, setFilter] = useState({ page: 1, limit: 10 });
  const [paginationTotalRows, setPaginationTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(async () => {
    setLoading(false);
  }, []);

  useEffect(async () => {
    let ignore = false;
    async function getData() {
      const resultAttendance = await attendanceService.list(filter);
      if (resultAttendance?.data?.data?.length > 0) {
        setAttendances(resultAttendance?.data?.data);
        setPaginationTotalRows(
          resultAttendance?.data?.totalCount
            ? resultAttendance?.data?.totalCount
            : 0
        );
      }
    }
    await getData();
    setLoading(false);
    return () => {
      ignore = true;
    };
  }, [filter]);

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
        paginationRowsPerPageOptions={[10, 15, 25, 50, 100]}
        paginationPerPage={filter?.limit ? filter?.limit : 10}
        paginationServer
        paginationTotalRows={paginationTotalRows}
        paginationDefaultPage={filter?.page}
        onChangeRowsPerPage={(e) => {
          setFilter({ ...filter, limit: e, page: 1 });
        }}
        onChangePage={(e) => {
          setFilter({ ...filter, page: e });
        }}
        // onRowClicked={handleRowClick}
      />
    </Layout>
  );
}

export default Table;
