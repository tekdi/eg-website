import {
  IconByName,
  benificiaryRegistoryService,
  ImageView,
  AdminTypo,
  enumRegistryService,
  tableCustomStyles,
  useWindowSize,
  AdminLayout as Layout,
  urlData,
  setQueryParameters,
  getSelectedProgramId,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/BeneficiaryStatus";
import moment from "moment";
import {
  HStack,
  VStack,
  Image,
  Text,
  ScrollView,
  Input,
  Box,
  Pressable,
  Stack,
} from "native-base";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Filter } from "../AdminBeneficiariesList";
import { debounce } from "lodash";
import PropTypes from "prop-types";

const columns = (t, navigate, filter) => [
  {
    name: t("LEARNERS_ID"),
    selector: (row) => row?.id,
    // width: "150px",
  },
  {
    name: t("LEARNERS_NAME"),
    selector: (row) => (
      <HStack>
        <Pressable
          onPress={() =>
            navigate(`/admin/learners/enrollmentReceipt/${row?.id}`)
          }
        >
          <HStack alignItems={"center"} space={2}>
            {row?.profile_photo_1?.name ? (
              <ImageView
                urlObject={row?.profile_photo_1}
                // alt="Alternate Text"
                width={"35px"}
                height={"35px"}
              />
            ) : (
              <IconByName
                isDisabled
                name="AccountCircleLineIcon"
                color="gray.300"
                _icon={{ size: "35" }}
                mt="2"
              />
            )}
            {row?.program_beneficiaries?.status === "enrolled_ip_verified" ? (
              <AdminTypo.H5 bold>
                {row?.program_beneficiaries?.enrollment_first_name + " "}
                {row?.program_beneficiaries?.enrollment_last_name
                  ? row?.program_beneficiaries?.enrollment_last_name
                  : ""}
              </AdminTypo.H5>
            ) : (
              <AdminTypo.H5 bold>
                {row?.first_name + " "}
                {row?.last_name ? row?.last_name : ""}
              </AdminTypo.H5>
            )}
          </HStack>
        </Pressable>
      </HStack>
    ),
    wrap: true,
    width: "250px",
  },
  {
    name: t("LEARNERS_AGE"),
    selector: (row) => {
      if (row?.program_beneficiaries?.status === "enrolled_ip_verified") {
        if (row?.program_beneficiaries_enrollment_dob) {
          return moment().diff(
            row?.program_beneficiaries.enrollment_dob,
            "years"
          );
        } else {
          return "-";
        }
      } else if (row?.dob) {
        return moment().diff(row?.dob, "years");
      } else {
        return "-";
      }
    },
    // width: "150px",
  },
  {
    name: t("PRERAK_ID"),
    selector: (row) => row?.program_beneficiaries?.facilitator_user?.id,
    // width: "100px",
  },
  {
    name: t("PRERAK_NAME"),
    selector: (row) => {
      const {
        program_beneficiaries: {
          facilitator_user: { first_name, last_name },
        },
      } = row;
      return first_name || last_name ? `${first_name} ${last_name || ""}` : "-";
    },
    wrap: true,
    width: "200px",
  },
  {
    name: t("STATUS"),
    selector: (row, index) => (
      <Pressable
        onPress={() => navigate(`/admin/learners/enrollmentReceipt/${row?.id}`)}
      >
        <ChipStatus
          key={index}
          is_duplicate={row?.is_duplicate}
          is_deactivated={row?.is_deactivated}
          status={row?.program_beneficiaries?.status}
        />
      </Pressable>
    ),
    wrap: true,
    width: "180px",
  },
  {
    name: t("ACTION"),
    selector: (row) =>
      row?.program_beneficiaries?.status === "enrolled" &&
      !(row?.is_duplicate === "yes" && row?.is_deactivated === null) && (
        <AdminTypo.Secondarybutton
          my="3"
          onPress={() => {
            navigate(`/admin/learners/enrollmentReceipt/${row?.id}`, {
              state: filter,
            });
          }}
        >
          {t("VIEW")}
        </AdminTypo.Secondarybutton>
      ),
    width: "150px",
  },
];

// Table component
function EnrollmentVerificationList({ footerLinks }) {
  const { type } = useParams();
  const [beneficiaryStatus, setBeneficiaryStatus] = useState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [Width, Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = useState();
  const ref = useRef(null);
  const refSubHeader = useRef(null);
  const [urlFilterApply, setUrlFilterApply] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [stateName, setStateName] = useState();
  const [filter, setFilter] = useState({ limit: 10 });
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);
  const [paginationTotalRows, setPaginationTotalRows] = useState(0);
  const handleRowClick = (row) => {
    navigate(`/admin/learners/enrollmentReceipt/${row?.id}`, {
      state: filter,
    });
  };

  const handleOpenButtonClick = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const init = async () => {
      if (urlFilterApply && stateName) {
        setLoading(true);
        const result = await benificiaryRegistoryService.beneficiariesFilter({
          ...filter,
          status:
            type === "SSOID" && stateName == "RAJASTHAN"
              ? "sso_id_enrolled"
              : "enrolled",
        });
        setData(result.data?.data);
        setPaginationTotalRows(
          result?.data?.totalCount ? result?.data?.totalCount : 0
        );
        setLoading(false);
      }
    };
    init();
  }, [filter, stateName]);

  useEffect(() => {
    const urlFilter = urlData(["district", "facilitator", "block"]);
    setFilter({ ...filter, ...urlFilter });
    setUrlFilterApply(true);
  }, []);

  useEffect(async () => {
    const result = await enumRegistryService.listOfEnum();
    let { state_name } = await getSelectedProgramId();
    setStateName(state_name);
    let list = result?.data?.ENROLLEMENT_VERIFICATION_STATUS;
    if (state_name !== "RAJASTHAN") {
      list = result?.data?.ENROLLEMENT_VERIFICATION_STATUS?.filter(
        (e) => e.value != "sso_id_verified"
      );
    }
    setBeneficiaryStatus(list);
  }, []);

  const setFilterObject = (data) => {
    setFilter(data);
    setQueryParameters(data);
    return data;
  };

  const handleSearch = (e) => {
    setFilter({ ...filter, search: e.nativeEvent.text, page: 1 });
  };

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), []);

  return (
    <Layout
      w={Width}
      getRefAppBar={(e) => setRefAppBar(e)}
      _sidebar={footerLinks}
    >
      <HStack p="4" justifyContent="space-between" ref={refSubHeader}>
        <HStack justifyContent="space-between" alignItems="center" space={2}>
          <IconByName isDisabled name="GraduationCap" size="md" />
          <AdminTypo.H4>{t("All_AG_LEARNERS")}</AdminTypo.H4>
          <IconByName
            size="sm"
            name="ArrowRightSLineIcon"
            onPress={(e) => navigate("/admin/learners")}
          />
          <AdminTypo.H4 bold>
            {t(
              type === "SSOID"
                ? "SSOID_VERIFICATION"
                : "ENROLLMENT_VERIFICATION"
            )}
          </AdminTypo.H4>
        </HStack>
        <Input
          size={"xs"}
          minH="49px"
          maxH="49px"
          InputLeftElement={
            <IconByName
              color="coolGray.500"
              name="SearchLineIcon"
              isDisabled
              pl="2"
            />
          }
          placeholder={t("SEARCH_BY_LEARNER_NAME")}
          variant="outline"
          onChange={debouncedHandleSearch}
        />
      </HStack>
      <HStack>
        <Stack style={{ position: "relative", overflowX: "hidden" }}>
          <Stack
            style={{
              position: "absolute",
              top: 0,
              left: "0",
              transition: "left 0.3s ease",
              width: "250px",
              height: "100%",
              background: "white",
              zIndex: 1,
            }}
          >
            <Box
              flex={[2, 2, 1]}
              style={{
                borderRightColor: "dividerColor",
                borderRightWidth: "2px",
              }}
            >
              <ScrollView
                maxH={
                  Height -
                  (refAppBar?.clientHeight +
                    ref?.current?.clientHeight +
                    refSubHeader?.current?.clientHeight)
                }
                pr="2"
              >
                {urlFilterApply && <Filter {...{ filter, setFilter }} />}
              </ScrollView>
            </Box>
          </Stack>

          <Stack
            style={{
              marginLeft: isDrawerOpen ? "250px" : "0",
              transition: "margin-left 0.3s ease",
            }}
          />
        </Stack>
        <VStack
          ml={"-1"}
          rounded={"xs"}
          height={"50px"}
          bg={
            filter?.district ||
            filter?.state ||
            filter?.block ||
            filter?.status ||
            filter?.facilitator
              ? "textRed.400"
              : "#E0E0E0"
          }
          justifyContent="center"
          onClick={handleOpenButtonClick}
        >
          <IconByName
            name={isDrawerOpen ? "ArrowLeftSLineIcon" : "FilterLineIcon"}
            color={
              filter?.state ||
              filter?.district ||
              filter?.block ||
              filter?.status ||
              filter?.facilitator
                ? "white"
                : "black"
            }
            _icon={{ size: "30px" }}
          />
        </VStack>
        <Box flex={[5, 5, 4]}>
          <ScrollView
            maxH={
              Height -
              (refAppBar?.clientHeight + refSubHeader?.current?.clientHeight)
            }
            minH={
              Height -
              (refAppBar?.clientHeight + refSubHeader?.current?.clientHeight)
            }
          >
            <VStack py={6} px={0} mb={5}>
              <ScrollView horizontal={true} mb="2">
                <HStack pb="2">
                  <Text
                    color={
                      !filter?.enrollment_verification_status
                        ? "textRed.400"
                        : ""
                    }
                    bold={!filter?.enrollment_verification_status}
                    cursor={"pointer"}
                    mx={3}
                    onPress={() => {
                      const { enrollment_verification_status, ...newFilter } =
                        filter;
                      setFilterObject(newFilter);
                    }}
                  >
                    {t("BENEFICIARY_ALL")}
                    {!filter?.enrollment_verification_status &&
                      `(${paginationTotalRows})`}
                  </Text>
                  {beneficiaryStatus
                    ?.filter((e) => e?.value !== "verified")
                    ?.map((item, key) => {
                      return (
                        <Text
                          key={item?.title}
                          color={
                            filter?.enrollment_verification_status ==
                            t(item?.value)
                              ? "textRed.400"
                              : ""
                          }
                          bold={
                            filter?.enrollment_verification_status ==
                            t(item?.value)
                          }
                          cursor={"pointer"}
                          mx={3}
                          onPress={() => {
                            const newFilter = {
                              ...filter,
                              enrollment_verification_status: item?.value,
                              page: 1,
                            };
                            setFilterObject(newFilter);
                          }}
                        >
                          {t(`${item?.title}_LIST`)}
                          {filter?.enrollment_verification_status ==
                            t(item?.value) && `(${paginationTotalRows})`}
                        </Text>
                      );
                    })}
                </HStack>
              </ScrollView>
              <DataTable
                customStyles={tableCustomStyles}
                columns={[...columns(t, navigate, filter)]}
                data={data}
                persistTableHead
                progressPending={loading}
                pagination
                paginationServer
                paginationTotalRows={paginationTotalRows}
                onChangeRowsPerPage={(e) => {
                  setFilterObject({ ...filter, limit: e, page: 1 });
                }}
                onChangePage={(e) => {
                  setFilterObject({ ...filter, page: e });
                }}
                onRowClicked={handleRowClick}
              />
            </VStack>
          </ScrollView>
        </Box>
      </HStack>
    </Layout>
  );
}

EnrollmentVerificationList.PropTypes = {
  footerLinks: PropTypes.any,
};

export default memo(EnrollmentVerificationList);
