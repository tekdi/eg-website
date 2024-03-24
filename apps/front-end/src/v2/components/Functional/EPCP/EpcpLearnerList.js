import React, { useEffect, useState } from "react";
import { FrontEndTypo, Layout, ObservationService } from "@shiksha/common-lib";
import { useTranslation } from "react-i18next";
import { Alert, Avatar, HStack, Pressable, VStack } from "native-base";
import { useNavigate } from "react-router-dom";

const EpcpLearnerList = ({ footerLinks }) => {
  const [loading, setLoading] = useState(true);
  const [leanerList, setLeanerList] = useState([]);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const onPressBackButton = async () => {
    navigate("/camps");
  };

  useEffect(() => {
    const fetchData = async () => {
      const list = await ObservationService.getCampLearnerList();
      const report = await ObservationService.getReport();
      const finalData = FilterStatusAndLearner(list, report);
      setLeanerList(finalData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const FilterStatusAndLearner = (list, report) => {
    const payload = Object.keys(list?.data).length === 0 ? [] : list?.data;
    const field = report?.data;
    const updatedPayload = payload?.map((payloadItem) => {
      const correspondingField = field.find(
        (fieldItem) =>
          parseInt(fieldItem?.context_id) ===
          payloadItem.group?.group_users?.[0]?.user?.user_id
      );

      if (correspondingField) {
        return {
          ...payloadItem,
          status: correspondingField?.status,
        };
      } else {
        return payloadItem;
      }
    });
    return updatedPayload;
  };

  return (
    <Layout
      loading={loading}
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn", "langBtn"],
      }}
      _footer={{ menues: footerLinks }}
    >
      {leanerList.length === 0 ? (
        <Alert mt={4} status="warning">
          <HStack space={2}>
            <Alert.Icon />
            <FrontEndTypo.H3>{t("EPCP_WARNING")}</FrontEndTypo.H3>
          </HStack>
        </Alert>
      ) : (
        <VStack space={4} padding={4}>
          <HStack margin={"auto"} mt={3} space={4}>
            <HStack space={2} alignItems={"center"}>
              <Avatar bg="textRed.300" size={["15px", "30px"]} />
              <FrontEndTypo.H3>{t("NOT_STARTED")}</FrontEndTypo.H3>
            </HStack>
            <HStack space={2} alignItems={"center"}>
              <Avatar bg="amber.300" size={["15px", "30px"]} />
              <FrontEndTypo.H3>{t("IN_PROGRESS")}</FrontEndTypo.H3>
            </HStack>
            <HStack space={2} alignItems={"center"}>
              <Avatar bg="green.300" size={["15px", "30px"]} />
              <FrontEndTypo.H3>{t("COMPLETED")}</FrontEndTypo.H3>
            </HStack>
          </HStack>
          <VStack>
            {leanerList?.map((item) => {
              return (
                <Pressable
                  key={item?.group?.group_id}
                  borderBottomWidth={1}
                  borderColor={"gray.300"}
                  p={4}
                  onPress={() => {
                    navigate(
                      `/camps/EpcpLearnerList/${item?.group?.group_users?.[0]?.user?.user_id}`
                    );
                  }}
                >
                  <HStack
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <HStack space={4}>
                      <FrontEndTypo.H3>
                        {item?.group?.group_users?.[0]?.user?.user_id}
                      </FrontEndTypo.H3>
                      <FrontEndTypo.H3>
                        {item?.group?.group_users?.[0]?.user?.first_name}
                      </FrontEndTypo.H3>
                      {item?.group?.group_users?.[0]?.user?.last_name ? (
                        <>
                          <FrontEndTypo.H3>
                            {item?.group?.group_users?.[0]?.user?.middle_name ||
                              ""}
                          </FrontEndTypo.H3>
                          <FrontEndTypo.H3>
                            {item?.group?.group_users?.[0]?.user?.last_name}
                          </FrontEndTypo.H3>
                        </>
                      ) : (
                        ""
                      )}
                    </HStack>
                    <Avatar
                      bg={
                        item?.status == "completed"
                          ? "green.300"
                          : item?.status == "in_progress"
                          ? "amber.300"
                          : "textRed.300"
                      }
                      size={["15px", "30px"]}
                    />
                  </HStack>
                </Pressable>
              );
            })}
          </VStack>
        </VStack>
      )}
    </Layout>
  );
};

export default EpcpLearnerList;
