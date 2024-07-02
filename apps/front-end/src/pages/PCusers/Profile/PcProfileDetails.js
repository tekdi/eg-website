import React, { useEffect, useState } from "react";
import { HStack, VStack } from "native-base";
import {
  FrontEndTypo,
  IconByName,
  t,
  PCusers_layout as Layout,
  CardComponent,
  PcuserService,
  ImageView,
} from "@shiksha/common-lib";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export default function FacilitatorBasicDetails() {
  const [pcDetails, setPcDetails] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await PcuserService.getPcProfile();
      setPcDetails(data?.data);
    };
    fetchData();
  }, []);

  return (
    <Layout
      _appBar={{
        name: t("BASIC_DETAILS"),
        onPressBackButton: (e) => navigate(`/profile`),
      }}
      analyticsPageTitle={"PC_BASIC_DETAILS"}
      pageTitle={t("PC_BASIC_DETAILS")}
      stepTitle={t("PC_BASIC_DETAILS")}
    >
      <VStack paddingBottom="64px" bg="bgGreyColor.200">
        <VStack p="4" space="24px">
          <HStack
            flex="0.5"
            justifyContent="center"
            alignItems={"flex-start"}
            m="4"
          >
            {pcDetails?.profile_photo_1?.fileUrl ? (
              <ImageView
                urlObject={{ fileUrl: pcDetails?.profile_photo_1?.fileUrl }}
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
            <IconByName
              name="PencilLineIcon"
              color="iconColor.200"
              _icon={{ size: "20" }}
              onPress={(e) => {
                navigate(`/profile/${pcDetails?.user_id}/upload/1`);
              }}
            />
          </HStack>
          <VStack>
            <HStack justifyContent="space-between" alignItems="Center">
              <FrontEndTypo.H1 color="textGreyColor.200" fontWeight="700">
                {`${pcDetails?.first_name ? pcDetails?.first_name : ""} ${
                  pcDetails?.middle_name ? pcDetails?.middle_name : ""
                } ${pcDetails?.last_name ? pcDetails?.last_name : ""}`}
              </FrontEndTypo.H1>

              <IconByName
                name="PencilLineIcon"
                color="iconColor.200"
                _icon={{ size: "20" }}
                onPress={(e) => {
                  navigate(`/profile/${pcDetails?.user_id}/edit/basic_details`);
                }}
              />
            </HStack>
            <HStack alignItems="Center">
              <IconByName name="Cake2LineIcon" color="iconColor.300" />
              <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                {pcDetails?.dob &&
                moment(pcDetails?.dob, "YYYY-MM-DD", true).isValid()
                  ? moment(pcDetails?.dob).format("DD/MM/YYYY")
                  : "-"}
              </FrontEndTypo.H3>
            </HStack>
          </VStack>
          <CardComponent
            _vstack={{ space: 0 }}
            _hstack={{ borderBottomWidth: 0 }}
            title={t("CONTACT_DETAILS")}
            label={["SELF", "EMAIL", "GENDER"]}
            icon={[
              { name: "CellphoneLineIcon", color: "iconColor.100" },
              { name: "SmartphoneLineIcon", color: "iconColor.100" },
              { name: "MailLineIcon", color: "iconColor.100" },
            ]}
            item={pcDetails}
            arr={["mobile", "email_id", "gender"]}
          />
          <CardComponent
            isHideProgressBar={true}
            _vstack={{ space: 0 }}
            _hstack={{ borderBottomWidth: 0 }}
            title={t("ADDRESS_DETAILS")}
            label={["HOME"]}
            item={{
              home: [
                pcDetails?.state,
                pcDetails?.district,
                pcDetails?.block,
                pcDetails?.village,
                pcDetails?.grampanchayat,
              ]
                .filter((e) => e)
                .join(", "),
            }}
            arr={["home"]}
          />
        </VStack>
      </VStack>
    </Layout>
  );
}
