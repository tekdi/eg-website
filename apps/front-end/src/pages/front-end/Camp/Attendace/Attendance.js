import {
  capture,
  telemetryFactory,
  Layout,
  calendar,
  overrideColorTheme,
  Loading,
  campService,
  FrontEndTypo,
} from "@shiksha/common-lib";
import { useTranslation } from "react-i18next";
// import manifest1 from "../manifest.json";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, FlatList, HStack, Stack } from "native-base";
import CalendarBar from "./CalendarBar/CalendarBar";
import AttendanceComponent, {
  GetAttendance,
  MultipalAttendance,
} from "./CalendarBar/AttendanceComponent";
import moment from "moment";

const colors = overrideColorTheme();
const PRESENT = "present";
const ABSENT = "absent";

export default function Attendance({ footerLinks, appName, setAlert }) {
  const { t } = useTranslation();
  const [weekPage, setWeekPage] = useState(0);
  const [students, setStudents] = useState([]);
  const [searchStudents, setSearchStudents] = useState();
  const [classObject, setClassObject] = useState({});
  let { id } = useParams();
  const [loading, setLoading] = useState("true");
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState();
  const [isEditDisabled, setIsEditDisabled] = useState(true);
  const [attendanceStartTime, setAttendanceStartTime] = useState();
  const [unmarkStudents, setUnmarkStudents] = useState([]);
  const [manifest, setManifest] = React.useState();
  const [lastAttedance, setLastAttedance] = React.useState("");

  useEffect(() => {
    if (attendance) {
      let studentIds = attendance
        ?.filter((e) => e.attendance !== "")
        ?.map((e) => e?.user?.id);
      setUnmarkStudents(students.filter((e) => !studentIds.includes(e.id)));
      let dates = attendance.map((d) => moment(d.updatedAt));
      let date = moment.max(dates);
      setLastAttedance(dates.length ? moment(date).format("hh:mma") : "N/A");
    }
  }, [attendance, students]);

  // useEffect(() => {
  //   const filterStudent = students.filter((e) =>
  //     e?.fullName?.toLowerCase().match(search?.toLowerCase())
  //   );
  //   setSearchStudents(filterStudent);
  // }, [search, students]);

  useEffect(async () => {
    let ignore = false;
    async function getData() {
      const result = await campService.getCampDetails({ id });
      const resultAttendance = await campService.CampAttendance({ id });
      if (resultAttendance?.data?.length > 0) {
        setAttendance(resultAttendance?.data);
      }
      let studentData = result?.data?.group_users;
      setStudents(studentData);
      setSearchStudents(studentData);
      if (!ignore) {
        setClassObject([]);
        // setClassObject(await classRegistryService.getOne({ id: classId }));
      }
    }
    await getData();
    setLoading(false);
    return () => {
      ignore = true;
    };
  }, [id]);

  useEffect(() => {
    let ignore = false;
    async function getData() {
      if (!ignore) await getAttendance();
    }
    getData();
    return () => {
      ignore = true;
    };
  }, [weekPage, id]);

  const getAttendance = async (e) => {
    let weekdays = calendar(weekPage, "week");
    let params = {
      id,
      start_date: weekdays?.[0]?.format("Y-MM-DD"),
      end_date: weekdays?.[weekdays.length - 1]?.format("Y-MM-DD"),
    };
    const attendanceData = await GetAttendance(params);
    setAttendance(attendanceData);
  };

  const newSetIsEditDisabled = (isEditDisabled) => {
    setIsEditDisabled(isEditDisabled);
    if (!isEditDisabled) {
      const telemetryData = telemetryFactory.start({
        appName,
        type: "Attendance-Start",
        groupID: id,
      });
      capture("START", telemetryData);
      setAttendanceStartTime(moment());
    } else {
      const telemetryData = telemetryFactory.end({
        appName,
        type: "Attendance-End",
        groupID: id,
        duration: attendanceStartTime
          ? moment().diff(attendanceStartTime, "seconds")
          : 0,
        percentage:
          ((students?.length - unmarkStudents.length) / students?.length) * 100,
      });
      capture("END", telemetryData);
      setAttendanceStartTime();
    }
  };

  if (!classObject && !classObject?.name) {
    return <h1>404</h1>;
  }

  if (loading === "true" || loading) {
    return <Loading />;
  }

  return (
    <Layout
      _appBar={{
        onlyIconsShow: ["backBtn"],
        isEnableSearchBtn: "true",
        setSearch: setSearch,
        _box: { bg: "white", shadow: "appBarShadow" },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
      _footer={{ menues: footerLinks }}
      analyticsPageTitle={"CAMP_FACILITATOR_ATTENDANCE"}
      pageTitle={t("CAMP")}
      stepTitle={t("ATTENDANCE")}
    >
      <Stack space={1}>
        {/* <FrontEndTypo.H4 textAlign="center">
          {t("TOTAL") + " " + students.length + " " + t("STUDENTS")}
        </FrontEndTypo.H4> */}
        <Box bg={colors.white} px="4" py="30">
          <HStack space="4" justifyContent="space-between" alignItems="center">
            <CalendarBar
              view="week"
              setPage={setWeekPage}
              page={weekPage}
              previousDisabled={false}
              nextDisabled={weekPage >= 0}
              leftErrorText={
                !isEditDisabled
                  ? {
                      title:
                        "Please click on save before moving to the previous page.",
                      status: "error",
                      placement: "top",
                    }
                  : false
              }
              rightErrorText={
                !isEditDisabled
                  ? {
                      title:
                        "Please click on save before moving to the next page.",
                      status: "error",
                      placement: "top",
                    }
                  : false
              }
            />

            {/* <Button
              variant="ghost"
              colorScheme="button"
              endIcon={
                <IconByName
                  name={isEditDisabled ? "PencilLineIcon" : "CheckLineIcon"}
                  isDisabled
                  _icon={{ width: "18", height: "18" }}
                  w="18px"
                  h="18px"
                />
              }
              _text={{
                fontSize: "14px",
                fontWeight: "500",
                textTransform: "capitalize",
              }}
              onPress={(e) => {
                newSetIsEditDisabled(!isEditDisabled);
              }}
            >
              {isEditDisabled ? t("EDIT") : t("CANCEL")}
            </Button> */}
          </HStack>
        </Box>
      </Stack>
      <Box bg={colors.white} py="10px" px="5">
        <FlatList
          data={searchStudents}
          renderItem={({ item, index }) => (
            <AttendanceComponent
              type={"weeks"}
              setAlert={setAlert}
              setLastAttedance={setLastAttedance}
              manifest={manifest}
              hidePopUpButton={false}
              page={weekPage}
              student={item}
              sms={[]}
              withDate={1}
              attendanceProp={attendance}
              getAttendance={getAttendance}
              isEditDisabled={isEditDisabled}
              appName
            />
          )}
          keyExtractor={(item, index) => (item?.id ? item?.id : index)}
        />
      </Box>
      <MultipalAttendance
        isWithEditButton={false}
        {...{
          id,
          manifest,
          students,
          attendance,
          getAttendance,
          setLoading,
          classId: id,
          classObject,
          isEditDisabled,
          setIsEditDisabled: newSetIsEditDisabled,
          lastAttedance,
          appName,
        }}
      />
    </Layout>
  );
}
