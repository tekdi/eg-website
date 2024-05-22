import {
  t,
  Layout,
  benificiaryRegistoryService,
  FrontEndTypo,
  Heading1,
  Heading,
} from "@shiksha/common-lib";
import { HStack, Text, VStack, View } from "native-base";
import React from "react";

export default function TableView({ footerLinks }) {
  const [statusData, setStatusData] = React.useState([]);

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
      }}
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
