import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import {
  IconByName,
  facilitatorRegistryService,
  Loading,
  t,
  ImageView,
  AdminTypo,
  CardComponent,
  FrontEndTypo,
  PoAdminLayout,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { HStack, Text, VStack } from "native-base";
import Chip, { ChipStatus } from "component/Chip";
import NotFound from "../../../NotFound";
import Clipboard from "component/Clipboard";

const Experience = (obj) => {
  return (
    <VStack>
      {obj?.role_title && (
        <Text>
          {t("ROLE")} : {obj?.role_title}
        </Text>
      )}
      {obj?.experience_in_years && (
        <Text>
          {t("YEARS_OF_EX")} : {obj?.experience_in_years}
        </Text>
      )}
      {obj?.description && (
        <Text>
          {t("DESCRIPTION")} : {obj?.description}
        </Text>
      )}
    </VStack>
  );
};

function View() {
  const { id } = useParams();
  const [data, setData] = useState();
  const [qualifications, setQualifications] = useState([]);
  const navigate = useNavigate();

  const profileDetails = useCallback(async () => {
    const result = await facilitatorRegistryService.getOne({ id });
    setData(result);
    const qualificationList =
      await facilitatorRegistryService.getQualificationAll();
    const qual = JSON.parse(result?.program_faciltators?.qualification_ids);

    if (qual?.length > 0) {
      const filterData = qualificationList?.filter((e) => {
        const qualData = qual?.find((item) => `${item}` === `${e?.id}`);
        return qualData ? true : false;
      });

      setQualifications(filterData);
    }
  }, [id]);

  useEffect(() => {
    profileDetails();
  }, [profileDetails]);

  const showData = (item) => item || "-";

  if (!data) {
    return <Loading />;
  } else if (_.isEmpty(data) || data.error) {
    return <NotFound goBack={(e) => navigate(-1)} />;
  }

  return (
    <PoAdminLayout>
      <HStack>
        <VStack flex={1} space={"5"} p="3" mb="5">
          <HStack alignItems={"center"} space="1" pt="3">
            <IconByName name="UserLineIcon" size="md" />
            <AdminTypo.H4 bold color="Activatedcolor.400">
              {t("ALL_PRERAK")}
            </AdminTypo.H4>
            <IconByName
              size="sm"
              name="ArrowRightSLineIcon"
              onPress={(e) => navigate(-1)}
            />
            <AdminTypo.H4
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              bold
            >
              {data?.first_name} {data?.last_name}
            </AdminTypo.H4>
            <IconByName
              size="sm"
              name="ArrowRightSLineIcon"
              onPress={(e) => navigate(-1)}
            />
            <Clipboard text={data?.id}>
              <Chip textAlign="center" lineHeight="15px" label={data?.id} />
            </Clipboard>
          </HStack>
          <HStack justifyContent={"space-between"} flexWrap="wrap">
            <VStack space="4" flexWrap="wrap">
              <ChipStatus status={data?.status} />
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
                  {data?.mobile}
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
                    data?.state,
                    data?.district,
                    data?.block,
                    data?.village,
                    data?.grampanchayat,
                  ]
                    .filter((e) => e)
                    .join(",")}
                </AdminTypo.H6>
              </HStack>
            </VStack>
            <HStack flex="0.5" justifyContent="center">
              {data?.profile_photo_1?.name ? (
                <ImageView
                  source={{
                    uri: data?.profile_photo_1?.name,
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

          <VStack space={"5"} p="4">
            <AdminTypo.H4 color="textGreyColor.800" bold>
              {t("PROFILE_DETAILS").toUpperCase()}
            </AdminTypo.H4>

            <HStack justifyContent="space-between">
              <VStack w="50%">
                <CardComponent
                  _body={{ bg: "light.100" }}
                  _header={{ bg: "light.100" }}
                  _vstack={{ space: 0 }}
                  _hstack={{ borderBottomWidth: 0, p: 1 }}
                  title={t("BASIC_DETAILS")}
                  label={[
                    "FIRST_NAME",
                    "MIDDLE_NAME",
                    "LAST_NAME",
                    "MOBILE_NO",
                    "DATE_OF_BIRTH",
                    "GENDER",
                    "ADDRESS",
                    "AADHAAR_NO",
                  ]}
                  item={showData({
                    ...data,
                    address:
                      [
                        data?.state,
                        data?.district,
                        data?.block,
                        data?.village,
                        data?.grampanchayat,
                      ].filter((e) => e).length > 0
                        ? [
                            data?.state,
                            data?.district,
                            data?.block,
                            data?.village,
                            data?.grampanchayat,
                          ]
                            .filter((e) => e)
                            .join(", ")
                        : "-",
                    aadhaar: (
                      <FrontEndTypo.H3>
                        {data?.aadhar_no ? data?.aadhar_no : "-"}
                      </FrontEndTypo.H3>
                    ),
                  })}
                  arr={[
                    "first_name",
                    "middle_name",
                    "last_name",
                    "mobile",
                    "dob",
                    "gender",
                    "address",
                    "aadhaar",
                  ]}
                  // onEdit={(e) => navigate(`/beneficiary/edit/${id}/contact-info`)}
                />
              </VStack>
              <VStack space={"2"} w="50%" ml="3">
                <CardComponent
                  _body={{ bg: "light.100" }}
                  _header={{ bg: "light.100" }}
                  _vstack={{ space: 0 }}
                  _hstack={{ borderBottomWidth: 0, p: 1 }}
                  title={t("EDUCATION")}
                  label={[
                    "QUALIFICATION",
                    "TEACHING_QUALIFICATION",
                    "WORK_EXPERIENCE",
                    "VOLUNTEER_EXPERIENCE",
                  ]}
                  item={{
                    ...data,
                    qualification: (
                      <FrontEndTypo.H3>
                        {data?.qualifications?.qualification_master?.name}
                      </FrontEndTypo.H3>
                    ),
                    teching_qualification: qualifications
                      ?.map((e) => t(e?.name))
                      .join(", "),
                    work_experience:
                      data?.experience?.[0] &&
                      data?.experience?.map((e, key) => (
                        <Experience key={e} {...e} />
                      )),
                    volunteer_experience:
                      data?.vo_experience?.[0] &&
                      data?.vo_experience?.map((e, key) => (
                        <Experience key={e} {...e} />
                      )),
                  }}
                  arr={[
                    "qualification",
                    "teching_qualification",
                    "work_experience",
                    "volunteer_experience",
                  ]}
                  // onEdit={(e) => navigate(`/beneficiary/edit/${id}/contact-info`)}
                />
                <CardComponent
                  _body={{ bg: "light.100" }}
                  _header={{ bg: "light.100" }}
                  _vstack={{ space: 0 }}
                  _hstack={{ borderBottomWidth: 0, p: 1 }}
                  title={t("OTHER_DETAILS")}
                  label={["AVAILABILITY", "DEVICE_OWNERSHIP", "TYPE_OF_DEVICE"]}
                  item={showData({
                    ...data,
                    availability:
                      data?.program_faciltators?.availability
                        ?.replaceAll("_", " ")
                        ?.charAt(0)
                        ?.toUpperCase() +
                      data?.program_faciltators?.availability
                        ?.replaceAll("_", " ")
                        ?.slice(1),

                    device_ownership:
                      data?.device_ownership.charAt(0).toUpperCase() +
                      data?.device_ownership.slice(1),
                    device_type:
                      data?.device_type.charAt(0).toUpperCase() +
                      data?.device_type.slice(1),
                  })}
                  arr={["availability", "device_ownership", "device_type"]}
                  // onEdit={(e) => navigate(`/beneficiary/edit/${id}/contact-info`)}
                />
              </VStack>
            </HStack>

            {data?.aadhar_verified === "in_progress" && (
              <VStack space={"5"} w="100%" bg="light.100" p="6" rounded="xl">
                <HStack
                  justifyContent="space-between"
                  alignItems="center"
                  borderColor="light.400"
                  pb="1"
                  borderBottomWidth="1"
                >
                  <AdminTypo.H5 color="textGreyColor" bold>
                    {t("AADHAAR_DETAILS")}
                  </AdminTypo.H5>
                </HStack>
                <HStack justifyContent={"space-between"}>
                  <ImageView
                    source={{ document_id: data?.aadhaar_front?.id }}
                    alt="aadhaar_front"
                    width="40vw"
                    height="45vh"
                    borderRadius="5px"
                    borderWidth="1px"
                    borderColor="worksheetBoxText.100"
                    alignSelf="Center"
                  />
                  <ImageView
                    source={{ document_id: data?.aadhaar_back?.id }}
                    alt="aadhaar_front"
                    width="40vw"
                    height="45vh"
                    borderRadius="5px"
                    borderWidth="1px"
                    borderColor="worksheetBoxText.100"
                    alignSelf="Center"
                  />
                </HStack>
              </VStack>
            )}
          </VStack>
        </VStack>
      </HStack>
    </PoAdminLayout>
  );
}

View.propTypes = { footerLinks: PropTypes.any };

export default View;
