import React, { useEffect } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";

export default function PrerakBasicDetails({ userTokenInfo }) {
  const [prerakProfile, setPrerakProfile] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const getPrerakProfile = async () => {
    setLoading(true);
    try {
      const payload = {
        id: id,
      };
      const result = await PcuserService.getPrerakProfile(payload);

      setPrerakProfile(result?.data);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);

      setLoading(false);
    }
  };

  useEffect(() => {
    getPrerakProfile();
  }, []);

  console.log({ prerakProfile });

  return (
    <Layout
      loading={loading}
      _appBar={{
        name: t("BASIC_DETAILS"),
        onPressBackButton: (e) => navigate(`/prerak/PrerakProfileView/${id}`),
      }}
      facilitator={userTokenInfo?.authUser || {}}
    >
      <VStack paddingBottom="64px" bg="bgGreyColor.200">
        <VStack p="4" space="24px">
          <HStack flex="0.5" justifyContent="center" m="4">
            {prerakProfile?.profile_photo_1?.name ? (
              <ImageView
                source={{
                  uri: prerakProfile?.profile_photo_1?.name,
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
          <VStack>
            <HStack justifyContent="space-between" alignItems="Center">
              <FrontEndTypo.H1 color="textGreyColor.200" fontWeight="700">
                {`${
                  prerakProfile?.first_name ? prerakProfile?.first_name : ""
                } ${
                  prerakProfile?.middle_name ? prerakProfile?.middle_name : ""
                } ${prerakProfile?.last_name ? prerakProfile?.last_name : ""}`}
              </FrontEndTypo.H1>
            </HStack>
            <HStack alignItems="Center">
              <IconByName name="Cake2LineIcon" color="iconColor.300" />
              <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                {prerakProfile?.dob &&
                moment(prerakProfile?.dob, "YYYY-MM-DD", true).isValid()
                  ? moment(prerakProfile?.dob).format("DD/MM/YYYY")
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
            item={prerakProfile}
            arr={["mobile", "alternative_mobile_number", "email_id"]}
          />
          <CardComponent
            isHideProgressBar={true}
            _vstack={{ space: 0 }}
            _hstack={{ borderBottomWidth: 0 }}
            title={t("ADDRESS_DETAILS")}
            label={["HOME"]}
            item={{
              home: [
                prerakProfile?.state,
                prerakProfile?.district,
                prerakProfile?.block,
                prerakProfile?.village,
                prerakProfile?.grampanchayat,
              ]
                .filter((e) => e)
                .join(", "),
            }}
            arr={["home"]}
          />
          <CardComponent
            _vstack={{ space: 0 }}
            _hstack={{ borderBottomWidth: 0 }}
            title={t("PERSONAL_DETAILS")}
            label={["Gender", "Social Category", "Martial Status"]}
            item={prerakProfile}
            arr={["gender", "social_category", "marital_status"]}
            // onEdit={(e) => navigate(`/profile/edit/personal_details`)}
          />
          <CardComponent
            _vstack={{ space: 0 }}
            _hstack={{ borderBottomWidth: 0 }}
            title={t("REFERENCE_DETAILS")}
            label={["Name", "Designation", "Contact"]}
            item={{
              name: [prerakProfile?.references?.name],
              designation: [prerakProfile?.references?.designation],
              contact_number: [prerakProfile?.references?.contact_number],
            }}
            arr={["name", "designation", "contact_number"]}
            // onEdit={(e) => navigate(`/profile/edit/reference_details`)}
          />
          <CardComponent
            _vstack={{ space: 0 }}
            _hstack={{ borderBottomWidth: 0 }}
            title={t("OTHER_DETAILS")}
            label={["Availability", "Designation", "Contact"]}
            item={{
              availability: [prerakProfile?.program_faciltators?.availability],
            }}
            arr={["availability"]}
            // onEdit={(e) => navigate(`/profile/edit/work_availability_details`)}
          />
        </VStack>
      </VStack>
    </Layout>
  );
}

PrerakBasicDetails.propTypes = {
  userTokenInfo: PropTypes.any,
};
