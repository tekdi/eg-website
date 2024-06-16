import {
  facilitatorRegistryService,
  t,
  IconByName,
  PCusers_layout as Layout,
  benificiaryRegistoryService,
  FrontEndTypo,
  SelectStyle,
  Loading,
  CardComponent,
} from "@shiksha/common-lib";
import { HStack, VStack, Box, Select, Pressable } from "native-base";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Chip, { ChipStatus } from "component/BeneficiaryStatus";
import InfiniteScroll from "react-infinite-scroll-component";
import Clipboard from "component/Clipboard";

export default function CampList() {
  const [facilitator, setFacilitator] = useState({});
  const navigate = useNavigate();
  const [filter, setFilter] = useState({ limit: 6 });
  const [data, setData] = useState([]);
  const [selectStatus, setSelectStatus] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [bodyHeight, setBodyHeight] = useState(0);
  const [loadingHeight, setLoadingHeight] = useState(0);
  const ref = useRef(null);
  const fa_id = localStorage.getItem("id");
  const prerak_status = localStorage.getItem("status");

  return (
    <Layout
      getBodyHeight={(e) => setBodyHeight(e)}
      _appBar={{
        onlyIconsShow: ["userInfo", "loginBtn", "langBtn"],
        isEnableSearchBtn: "true",
        setSearch: (value) => {
          setFilter({ ...filter, search: value, page: 1 });
        },
        _box: { bg: "white", shadow: "appBarShadow" },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
      analyticsPageTitle={"CAMP_LIST"}
      pageTitle={t("CAMP_LIST")}
    >
      <VStack space={4} p={4}>
        <Box space={4} py={4}>
          <FrontEndTypo.H2 pb={"20px"}>`Prerak Name`</FrontEndTypo.H2>
          <Pressable
            onPress={() => {
              navigate("/pcuser/camps/12234");
            }}
            bg="boxBackgroundColour.100"
            shadow="AlertShadow"
            borderRadius="10px"
            py={3}
            px={5}
          >
            <HStack alignItems={"center"} justifyContent={"space-between"}>
              <VStack flex={"0.9"}>
                <FrontEndTypo.H3 color="textMaroonColor.400">
                  {t("CAMP")} (12334)
                </FrontEndTypo.H3>
              </VStack>
              <HStack alignItems={"center"}>
                <IconByName
                  isDisabled
                  name={
                    ["camp_ip_verified"].includes()
                      ? "CheckLineIcon"
                      : "ErrorWarningLineIcon"
                  }
                  color={
                    ["camp_ip_verified"].includes()
                      ? "textGreen.700"
                      : "textMaroonColor.400"
                  }
                  _icon={{ size: "20px" }}
                />
              </HStack>
            </HStack>
          </Pressable>
        </Box>
      </VStack>
    </Layout>
  );
}
