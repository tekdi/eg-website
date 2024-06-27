import React, { useEffect, useState } from "react";
import {
  AdminTypo,
  AdminLayout,
  CardComponent,
  IconByName,
  organisationService,
  Breadcrumb,
  cohortService,
} from "@shiksha/common-lib";
import {
  HStack,
  VStack,
  Box,
  Select,
  Pressable,
  Modal,
  Button,
} from "native-base";
import Chip from "component/Chip";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import AssignedList from "./AssignedList";
import DailyActivityList from "./DailyActivityList";

import DatePicker from "../../../v2/components/Static/FormBaseInput/DatePicker";

function View() {
  const { t } = useTranslation();
  const [data, setData] = useState();
  const [pcData, setPcData] = useState();
  const [assignPrerak, setassignPrerak] = useState();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <AdminLayout>
      <VStack flex={1} mt="5" space={4} p="4">
        <Breadcrumb
          drawer={<IconByName size="sm" name="ArrowRightSLineIcon" />}
          data={[
            {
              title: (
                <HStack space={2} alignItems={"center"}>
                  <IconByName name="TeamFillIcon" size="md" />
                  <AdminTypo.H4 bold>
                    {t("ALL_PRAGATI_COORDINATOR")}
                  </AdminTypo.H4>
                </HStack>
              ),
              link: "/poadmin/ips",
              icon: "GroupLineIcon",
            },

            <Chip
              textAlign="center"
              lineHeight="15px"
              label={`${pcData?.first_name} ${pcData?.middle_name || ""}  ${
                pcData?.last_name || ""
              }`}
            />,
          ]}
        />
        <HStack justifyContent={"space-between"} flexWrap="wrap">
          <VStack space="4" flexWrap="wrap">
            <HStack
              bg="textMaroonColor.600"
              rounded={"md"}
              alignItems="center"
              p="2"
            >
              <IconByName
                isDisabled
                _icon={{ size: "20px" }}
                name="CellphoneLineIcon"
                color="white"
              />

              <AdminTypo.H6 color="white" bold>
                {pcData?.mobile}
              </AdminTypo.H6>
            </HStack>
            <HStack
              bg="textMaroonColor.600"
              rounded={"md"}
              p="2"
              alignItems="center"
              space="2"
            >
              <IconByName
                isDisabled
                _icon={{ size: "20px" }}
                name="MapPinLineIcon"
                color="white"
              />
              <AdminTypo.H6 color="white" bold>
                {[
                  pcData?.state,
                  pcData?.district,
                  pcData?.block,
                  pcData?.village,
                  pcData?.grampanchayat,
                ]
                  .filter((e) => e)
                  .join(",")}
              </AdminTypo.H6>
            </HStack>
            <HStack space={4}>
              <AdminTypo.Secondarybutton
                // onPress={() => navigate("/admin/addpcuser")}
                onPress={() => setIsModalOpen(true)}
                rightIcon={
                  <IconByName
                    color="#084B82"
                    _icon={{}}
                    size="15px"
                    name="ShareLineIcon"
                  />
                }
              >
                {t("VIEW_DAILY_ACTIVITIES")}
              </AdminTypo.Secondarybutton>
              <AdminTypo.Secondarybutton
                onPress={() => navigate("/admin/addpcuser")}
                rightIcon={
                  <IconByName
                    color="#084B82"
                    _icon={{}}
                    size="15px"
                    name="ShareLineIcon"
                  />
                }
              >
                {t("RESET_PASSWORD")}
              </AdminTypo.Secondarybutton>
            </HStack>
          </VStack>
          <HStack flex="0.5" justifyContent="center">
            {pcData?.profile_photo_1?.name ? (
              <ImageView
                source={{
                  uri: pcData?.profile_photo_1?.name,
                }}
                alt="profile photo"
                width={"180px"}
                height={"180px"}
              />
            ) : (
              <IconByName
                isDisabled
                name="AccountCircleLineIcon"
                color="textGreyColor.300"
                _icon={{ size: "190px" }}
              />
            )}
          </HStack>
        </HStack>
        <HStack alignItems={"center"} p={4} space={4}>
          <CardComponent
            _header={{ bg: "light.100" }}
            _vstack={{ space: 0, flex: 1, bg: "light.100" }}
            _hstack={{ borderBottomWidth: 0, p: 1 }}
            item={{
              ...pcData,
              name: `${pcData?.first_name} ${pcData?.middle_name || ""}  ${
                pcData?.last_name || ""
              }`,
              address: `${pcData?.state ?? ""}, ${pcData?.district ?? ""}, ${
                pcData?.block ?? ""
              }, ${pcData?.village ?? ""}${
                pcData?.address ? `, ${pcData?.address}` : ""
              }`,
              prerak_assigned: assignPrerak,
            }}
            title={t("BASIC_DETAILS")}
            label={[
              "USER_ID",
              "NAME",
              "MOBILE_NUMBER",
              "EMAIL_ID",
              "PRERAK_ASSIGNED",
              "IP_ADDRESS",
            ]}
            arr={[
              "user_id",
              "name",
              "mobile",
              "email_id",
              "prerak_assigned",
              "address",
            ]}
          />
        </HStack>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          safeAreaTop={true}
          size="xl"
        >
          <Modal.Content>
            <Modal.Header p="5" borderBottomWidth="0">
              <Box
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <AdminTypo.H3 color="black">{t("PC_ACTIVITIES")}</AdminTypo.H3>
                <Box style={{ flexDirection: "row" }}>
                  <Button
                    colorScheme="red"
                    onPress={(e) => setIsModalOpen(false)}
                  >
                    {t("CLOSE")}
                  </Button>
                  <Button
                    ml={2}
                    colorScheme="red"
                    onPress={handleContinueBtn}
                    // isDisabled={isDisable}
                  >
                    {t("COMMENT")}
                  </Button>
                </Box>
              </Box>
              <Box width={"40%"}>
                <DatePicker />
              </Box>
            </Modal.Header>

            <Modal.Body p="5" pb="10">
              <VStack space="5">
                <DailyActivityList
                  setPcData={setPcData}
                  setassignPrerak={setassignPrerak}
                />
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>
        <AssignedList setPcData={setPcData} setassignPrerak={setassignPrerak} />
      </VStack>
    </AdminLayout>
  );
}

View.propTypes = {};

export default View;
