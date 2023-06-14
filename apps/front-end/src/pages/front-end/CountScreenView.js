import {
  t,
  Layout,
  benificiaryRegistoryService,
  FrontEndTypo,
} from "@shiksha/common-lib";
import { HStack, VStack } from "native-base";
import React from "react";

export default function TableView({ footerLinks }) {
  React.useEffect(async () => {
    const selectStatus = await benificiaryRegistoryService.getStatusList();
    let statuswiseCount = await benificiaryRegistoryService.getStatusWiseCount();
    for (let i = 0; i < statuswiseCount?.data?.length; i++) {
      if (statuswiseCount.data[i].status === selectStatus[i].value) {
        const dataObject = {};
        dataObject.status = statuswiseCount.data[i].status
        dataObject.title = selectStatus[i].title
        dataObject.count = statuswiseCount.data[i].count
        setStatusData(prevStatusData => [...prevStatusData, dataObject]);
      }
    }
  }, []);
  const [statusData, setStatusData] = React.useState([])
  return (
    <Layout
      _appBar={{
        onlyIconsShow: ["backBtn", "userInfo"],
        _box: { bg: "white", shadow: "appBarShadow" },
        _backBtn: { borderWidth: 1, p: 0, borderColor: "btnGray.100" },
      }}
      _footer={{ menues: footerLinks }}
    >
      <VStack space="4" p="5" alignContent="center" bg="bgGreyColor.200">
        <HStack justifyContent="space-between" px="2">
          <FrontEndTypo.H2 color="textMaroonColor.400" bold>
            {t("STATUS")}
          </FrontEndTypo.H2>
          <FrontEndTypo.H2 color="textMaroonColor.400" bold>
            {t("COUNT")}
          </FrontEndTypo.H2>
        </HStack>
        {statusData?.map((item) => (
          <HStack
            bg="white"
            px="4"
            py="5"
            shadow="FooterShadow"
            borderRadius="4px"
            space="2"
            justifyContent="space-between"
          >
            <FrontEndTypo.H3 bold color="textGreyColor.800" >{`${t(
              item.title
            )}`}</FrontEndTypo.H3>
            <FrontEndTypo.H2>{item.count}</FrontEndTypo.H2>
          </HStack>
        ))}
      </VStack>
    </Layout>
  );
}
