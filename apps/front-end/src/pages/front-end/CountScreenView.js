import {
  t,
  Layout,
  benificiaryRegistoryService,
  FrontEndTypo,
} from "@shiksha/common-lib";
import { HStack, VStack } from "native-base";
import React from "react";

export default function TableView({ footerLinks }) {
  React.useEffect(() => {
    const getData = async () => {
      let data = await benificiaryRegistoryService.getStatusWiseCount();
      setStatuswiseCount(data);
    };

    getData();
  }, []);
  const [statuswiseCount, setStatuswiseCount] = React.useState({});

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
        {statuswiseCount?.data?.map((item) => (
          <HStack
            bg="white"
            px="4"
            py="5"
            shadow="FooterShadow"
            borderRadius="4px"
            space="2"
            justifyContent="space-between"
          >
            <FrontEndTypo.H3 bold color="textGreyColor.800">{`${t(
              item.status
            )}`}</FrontEndTypo.H3>
            <FrontEndTypo.H2>{item.count}</FrontEndTypo.H2>
          </HStack>
        ))}
      </VStack>
    </Layout>
  );
}
