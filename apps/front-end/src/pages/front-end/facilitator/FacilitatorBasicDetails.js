import React from "react";
import {
  HStack,
  VStack,
  Box,
  Progress,
  Divider,
  Center,
  Alert,
} from "native-base";
import {
  arrList,
  FrontEndTypo,
  IconByName,
  facilitatorRegistryService,
  t,
  Layout,
  enumRegistryService,
  GetEnumValue,
  BodyMedium,
  CardComponent,
} from "@shiksha/common-lib";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import ProfilePhoto from "./ProfilePhoto";

export default function FacilitatorBasicDetails({
  userTokenInfo,
  footerLinks,
}) {
  const [facilitator, setfacilitator] = React.useState();
  const navigate = useNavigate();
  const arrPersonal = {
    ...facilitator?.extended_users,
    gender: facilitator?.gender,
  };
  const [enumOptions, setEnumOptions] = React.useState({});

  React.useEffect(() => {
    facilitatorDetails();
  }, []);

  const facilitatorDetails = async () => {
    const { id } = userTokenInfo?.authUser;
    const result = await facilitatorRegistryService.getOne({ id });
    setfacilitator(result);
  };

  React.useEffect(async () => {
    const data = await enumRegistryService.listOfEnum();
    setEnumOptions(data?.data ? data?.data : {});
  }, [facilitator]);

  return (
    <Layout
      _appBar={{
        name: t("BASIC_DETAILS"),
        onPressBackButton: (e) => navigate(`/profile`),
      }}
    >
      {["quit"].includes(facilitator?.status) ? (
        <Alert status="warning" alignItems={"start"} mb="3" mt="4">
          <HStack alignItems="center" space="2" color>
            <Alert.Icon />
            <BodyMedium>{t("PAGE_NOT_ACCESSABLE")}</BodyMedium>
          </HStack>
        </Alert>
      ) : (
        <VStack paddingBottom="64px" bg="bgGreyColor.200">
          <VStack p="4" space="24px">
            <ProfilePhoto
              profile_photo_1={facilitator?.profile_photo_1}
              profile_photo_2={facilitator?.profile_photo_2}
              profile_photo_3={facilitator?.profile_photo_3}
            />
            <VStack>
              <HStack justifyContent="space-between" alignItems="Center">
                <FrontEndTypo.H1 color="textGreyColor.200" fontWeight="700">
                  {`${facilitator?.first_name ? facilitator?.first_name : ""} ${
                    facilitator?.middle_name ? facilitator?.middle_name : ""
                  } ${facilitator?.last_name ? facilitator?.last_name : ""}`}
                </FrontEndTypo.H1>
                <IconByName
                  name="PencilLineIcon"
                  color="iconColor.200"
                  _icon={{ size: "20" }}
                  onPress={(e) => {
                    navigate(`/profile/edit/basic_details`);
                  }}
                />
              </HStack>
              <HStack alignItems="Center">
                <IconByName name="Cake2LineIcon" color="iconColor.300" />
                <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                  {facilitator &&
                  facilitator.dob &&
                  moment(facilitator.dob, "YYYY-MM-DD", true).isValid()
                    ? moment(facilitator?.dob).format("DD/MM/YYYY")
                    : "-"}
                </FrontEndTypo.H3>
              </HStack>
            </VStack>
            <CardComponent
              _vstack={{ space: 0 }}
              _hstack={{ borderBottomWidth: 0 }}
              title={t("CONTACT_DETAILS")}
              label={["SELF", "ALTERNATIVE_NUMBER", "EMAIL"]}
              icon={[
                { name: "CellphoneLineIcon", color: "iconColor.100" },
                { name: "SmartphoneLineIcon", color: "iconColor.100" },
                { name: "MailLineIcon", color: "iconColor.100" },
              ]}
              item={facilitator}
              arr={["mobile", "alternative_mobile_number", "email_id"]}
              onEdit={(e) => navigate(`/profile/edit/contact_details`)}
            />
            <CardComponent
              isHideProgressBar={true}
              _vstack={{ space: 0 }}
              _hstack={{ borderBottomWidth: 0 }}
              title={t("ADDRESS_DETAILS")}
              label={["HOME"]}
              item={{
                home: [
                  facilitator?.state,
                  facilitator?.district,
                  facilitator?.block,
                  facilitator?.village,
                  facilitator?.grampanchayat,
                ]
                  .filter((e) => e)
                  .join(", "),
              }}
              arr={["home"]}
              onEdit={(e) => navigate(`/profile/edit/address_details`)}
            />
            <CardComponent
              _vstack={{ space: 0 }}
              _hstack={{ borderBottomWidth: 0 }}
              title={t("PERSONAL_DETAILS")}
              label={["Gender", "Social Category", "Martial Status"]}
              item={facilitator}
              arr={["gender", "social_category", "marital_status"]}
              onEdit={(e) => navigate(`/profile/edit/personal_details`)}
            />
            <CardComponent
              _vstack={{ space: 0 }}
              _hstack={{ borderBottomWidth: 0 }}
              title={t("REFERENCE_DETAILS")}
              label={["Name", "Designation", "Contact"]}
              item={{
                name: [facilitator?.references?.name],
                designation: [facilitator?.references?.designation],
                contact_number: [facilitator?.references?.contact_number],
              }}
              arr={["name", "designation", "contact_number"]}
              onEdit={(e) => navigate(`/profile/edit/reference_details`)}
            />
            <CardComponent
              _vstack={{ space: 0 }}
              _hstack={{ borderBottomWidth: 0 }}
              title={t("OTHER_DETAILS")}
              label={["Availability", "Designation", "Contact"]}
              item={facilitator}
              arr={["name"]}
              onEdit={(e) => navigate(`/profile/edit/work_availability_details`)}
            />
          </VStack>
        </VStack>
      )}
    </Layout>
  );
}
