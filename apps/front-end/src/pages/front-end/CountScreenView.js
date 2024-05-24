import {
  t,
  Layout,
  arrList,
  benificiaryRegistoryService,
  FrontEndTypo,
} from "@shiksha/common-lib";
import { HStack, Text, VStack, View } from "native-base";
import React, { useEffect, useState } from "react";
import { getIpUserInfo, setIpUserInfo } from "v2/utils/SyncHelper/SyncHelper";

export default function TableView({ footerLinks, userTokenInfo }) {
  const [statusData, setStatusData] = React.useState([]);
  // PROFILE DATA IMPORTS
  const [facilitator, setFacilitator] = useState({ notLoaded: true });
  const fa_id = localStorage.getItem("id");
  const [loading, setLoading] = useState(true);
  const [countLoad, setCountLoad] = useState(0);
  const [progress, setProgress] = useState(0);
  const [cohortData, setCohortData] = useState(null);
  const [programData, setProgramData] = useState(null);
  const [isUserRegisterExist, setIsUserRegisterExist] = useState(false);
  const [selectedCohortData, setSelectedCohortData] = useState(null);
  const [selectedProgramData, setSelectedProgramData] = useState(null);
  const [selectCohortForm, setSelectCohortForm] = useState(false);
  const [academicYear, setAcademicYear] = useState(null);
  const [academicData, setAcademicData] = useState([]);
  const [isTodayAttendace, setIsTodayAttendace] = useState();
  const [isOnline, setIsOnline] = useState(
    window ? window.navigator.onLine : false
  );

  React.useEffect(async () => {
    const selectStatus = await benificiaryRegistoryService.getStatusList();

    let statuswiseCount =
      await benificiaryRegistoryService.getStatusWiseCount();
    for (let i = 0; i < statuswiseCount?.data?.length; i++) {
      for (let j = 0; j < selectStatus?.length; j++) {
        if (statuswiseCount.data[i].status === selectStatus[j].value) {
          const dataObject = {};
          dataObject.status = statuswiseCount.data[i].status;
          dataObject.title = selectStatus[j].title;
          dataObject.count = statuswiseCount.data[i].count;
          setStatusData((prevStatusData) => [...prevStatusData, dataObject]);
        }
      }
    }
  }, []);
  return (
    <Layout
      _appBar={{
        onlyIconsShow: ["backBtn", "userInfo", "langBtn"],
        _box: { bg: "white", shadow: "appBarShadow" },
        profile_url: facilitator?.profile_photo_1?.name,
        name: [facilitator?.first_name, facilitator?.last_name].join(" "),
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={facilitator}
      _footer={{ menues: footerLinks }}
    >
      <VStack space="4" p="5" alignContent="center" bg="white">
        <HStack justifyContent="space-between" px="2" pt={1}>
          <Text
            fontSize="20px"
            lineHeight="24px"
            fontWeight="600"
            color="textGreyColor.900"
          >
            {t("LEARNER_STATUS_COUNT")}
          </Text>
        </HStack>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {statusData?.map((item, index) => (
            <View
              key={index}
              style={{
                backgroundColor: "#F4F4F4",
                padding: 15,
                borderRadius: "5px",
                justifyContent: "end",
                margin: 6,
                width: "calc(50% - 16px)",
              }}
            >
              <Text
                color={"floatingLabelColor.500"}
                fontSize={"48px"}
                lineHeight={"72px"}
                fontWeight={"500"}
              >
                {item.count}
              </Text>
              <FrontEndTypo.H3
                fontWeight={"400"}
                lineHeight={"21px"}
                color={"grayTitleCard"}
              >{`${t(item.title)}`}</FrontEndTypo.H3>
            </View>
          ))}
        </View>
      </VStack>
    </Layout>
  );
}
