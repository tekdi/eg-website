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
      const userIds = list?.data.flatMap((group) =>
        group.group.group_users.map((user) => user.user.user_id)
      );
      const report = await ObservationService.getReport(userIds);
      const finalData = FilterStatusAndLearner(list, report);
      setLeanerList(finalData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const FilterStatusAndLearner = (list, report) => {
    const payload = Object.keys(list?.data).length === 0 ? [] : list?.data;
    const field = report?.data;
    const updatedPayload = payload.map((payloadItem) => {
      const updatedGroupUsers = payloadItem.group.group_users.map(
        (groupUser) => {
          const correspondingField = field.find(
            (fieldItem) => fieldItem.context_id == groupUser.user.user_id
          );
          if (correspondingField) {
            return {
              ...groupUser,
              status: correspondingField.status,
            };
          } else {
            return groupUser;
          }
        }
      );

      return {
        ...payloadItem,
        group: {
          ...payloadItem.group,
          group_users: updatedGroupUsers,
        },
      };
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
              return item?.group?.group_users?.map((data) => {
                return (
                  <Pressable
                    key={data?.user?.user_id}
                    borderBottomWidth={1}
                    borderColor={"gray.300"}
                    p={4}
                    onPress={() => {
                      navigate(`/camps/EpcpLearnerList/${data?.user?.user_id}`);
                    }}
                  >
                    <HStack
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <HStack space={4}>
                        <FrontEndTypo.H3>{data?.user?.user_id}</FrontEndTypo.H3>
                        <FrontEndTypo.H3>
                          {data?.user?.first_name}
                        </FrontEndTypo.H3>
                        <FrontEndTypo.H3>
                          {data?.user?.middle_name || ""}
                        </FrontEndTypo.H3>
                        <FrontEndTypo.H3>
                          {data?.user?.last_name || ""}
                        </FrontEndTypo.H3>
                      </HStack>
                      {console.log(data)}
                      <Avatar
                        bg={
                          data?.status == "completed"
                            ? "green.300"
                            : data?.status == "in_complete"
                            ? "amber.300"
                            : "textRed.300"
                        }
                        size={["15px", "30px"]}
                      />
                    </HStack>
                  </Pressable>
                );
              });
            })}
          </VStack>
        </VStack>
      )}
    </Layout>
  );
};

export default EpcpLearnerList;
