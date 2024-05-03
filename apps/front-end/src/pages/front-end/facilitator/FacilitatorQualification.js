import React from "react";
import { HStack, VStack, Box, Progress, Divider, Alert } from "native-base";
import {
  arrList,
  FrontEndTypo,
  IconByName,
  facilitatorRegistryService,
  t,
  Layout,
  ImageView,
  enumRegistryService,
  GetEnumValue,
  BodyMedium,
  CardComponent,
} from "@shiksha/common-lib";
import { useNavigate } from "react-router-dom";
import { getIndexedDBItem } from "v2/utils/Helper/JSHelper";
import { getOnboardingData } from "v2/utils/OfflineHelper/OfflineHelper";

const GetOptions = ({ array, enumType, enumApiData }) => {
  const { t } = useTranslation();
  return (
    <VStack>
      {getUniqueArray(array)?.map((item, index) => (
        <Text
          fontSize="14px"
          fontWeight="400"
          lineHeight="24px"
          color={"inputValueColor"}
        >
          <GetEnumValue
            fontSize="14px"
            key={index}
            t={t}
            enumOptionValue={item}
            {...{ enumType, enumApiData }}
          />
        </Text>
      ))}
    </VStack>
  );
};

export default function FacilitatorQualification({ userTokenInfo }) {
  const [facilitator, setfacilitator] = React.useState();
  const [qualifications, setQualifications] = React.useState();
  const [qualification, setQualification] = React.useState();
  const navigate = useNavigate();
  const [enumOptions, setEnumOptions] = React.useState({});
  const [qua, setQua] = React.useState();

  React.useEffect(async () => {
    const { id } = userTokenInfo?.authUser;
    const result = await getOnboardingData(id);
    setfacilitator(result);
    setQualification(result?.qualifications ? result?.qualifications : {});
  }, []);

  React.useEffect(() => {
    let isMounted = true;
    const fetchEnumData = async () => {
      const data = await getIndexedDBItem(`enums`);
      if (isMounted) setEnumOptions(data || {});
    };

    const fetchQualificationData = async () => {
      const qua = await getIndexedDBItem(`qualification`);
      if (isMounted) setQua(qua);
    };

    fetchEnumData();
    fetchQualificationData();
    return () => {
      isMounted = false;
    };
  }, []);

  React.useEffect(async () => {
    const ids = JSON.parse(
      facilitator?.qualification_ids ? facilitator?.qualification_ids : "[]"
    );
    if (Array.isArray(qua) && Array.isArray(ids)) {
      const arr = qua.filter((item) => ids.includes(item.id));
      setQualifications(arr);
    }
  }, [qua, facilitator]);

  const onPressBackButton = () => {
    navigate("/profile");
  };
  return (
    <Layout
      _appBar={{
        onlyIconsShow: ["backBtn", "langBtn"],
        _box: { bg: "white", shadow: "appBarShadow" },
        leftIcon: (
          <FrontEndTypo.H2>{t("QUALIFICATION_DETAILS")}</FrontEndTypo.H2>
        ),
        onPressBackButton,
        profile_url: facilitator?.profile_photo_1?.name,
        name: [facilitator?.first_name, facilitator?.last_name].join(" "),
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={facilitator}
      _page={{ _scollView: { bg: "formBg.500" } }}
    >
      {["quit"].includes(facilitator?.status) ? (
        <Alert status="warning" alignItems={"start"} mb="3" mt="4">
          <HStack alignItems="center" space="2" color>
            <Alert.Icon />
            <BodyMedium>{t("PAGE_NOT_ACCESSABLE")}</BodyMedium>
          </HStack>
        </Alert>
      ) : (
        <VStack>
          <VStack px="5" pt="3">
            <CardComponent
              _vstack={{ space: 0 }}
              _hstack={{ borderBottomWidth: 0 }}
              title={t("QUALIFICATION")}
              label={["DEGREE", "DOCUMENT", "TEACHING_DEGREE"]}
              item={{
                qualification_master: (
                  <GetEnumValue
                    t={t}
                    enumType={"QUALIFICATION"}
                    enumOptionValue={qualification?.qualification_master?.name}
                    enumApiData={enumOptions}
                  />
                ),

                qualification_reference_document_id: (
                  <ImageView
                    text={t("LINK")}
                    urlObject={{
                      fileUrl:
                        qualification?.qualification_reference_document_id,
                    }}
                  />
                ),
                qualifications: (
                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {t(`${qualifications?.map((e) => e.name).join(", ")}`)}
                  </FrontEndTypo.H3>
                ),
              }}
              arr={[
                "qualification_master",
                "qualification_reference_document_id",
                "qualifications",
              ]}
              onEdit={(e) => {
                navigate(`/profile/edit/qualification_details`);
              }}
            />
          </VStack>
        </VStack>
      )}
    </Layout>
  );
}
