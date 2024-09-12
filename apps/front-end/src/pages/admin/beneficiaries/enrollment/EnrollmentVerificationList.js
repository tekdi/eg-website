import {
  IconByName,
  benificiaryRegistoryService,
  ImageView,
  AdminTypo,
  enumRegistryService,
  tableCustomStyles,
  useWindowSize,
  AdminLayout as Layout,
  getFilterLocalStorage,
  setFilterLocalStorage,
  getSelectedProgramId,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/BeneficiaryStatus";
import moment from "moment";
import {
  HStack,
  VStack,
  Text,
  ScrollView,
  Input,
  Box,
  Pressable,
} from "native-base";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Filter } from "../AdminBeneficiariesList";
import { debounce } from "lodash";
import PropTypes from "prop-types";
const filterNameCore = "leaner_enrollment_filter";

const columns = (t, navigate) => [
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
            "years",
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
      ["enrolled", "sso_id_enrolled", "pragati_syc_reattempt"].includes(
        row?.program_beneficiaries?.status,
      ) &&
      !(row?.is_duplicate === "yes" && row?.is_deactivated === null) && (
        <AdminTypo.Secondarybutton
          my="3"
          onPress={() => {
            if (
              row?.program_beneficiaries?.status === "pragati_syc_reattempt"
            ) {
              navigate(`/admin/learners/syc/${row?.id}`);
            } else {
              navigate(`/admin/learners/enrollmentReceipt/${row?.id}`);
            }
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
  const [filterName, setFilterName] = useState();
  const [title, setTitle] = useState();
  const handleRowClick = (row) => {
    if (row?.program_beneficiaries?.status === "pragati_syc_reattempt") {
      navigate(`/admin/learners/syc/${row?.id}`);
    } else {
      navigate(`/admin/learners/enrollmentReceipt/${row?.id}`);
    }
  };

  const handleOpenButtonClick = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const init = async () => {
      if (urlFilterApply && stateName) {
        setLoading(true);
        let status;
        if (type === "SSOID" && stateName === "RAJASTHAN") {
          status = "sso_id_enrolled";
        } else if (type === "SYC") {
          status = "pragati_syc_reattempt";
        } else {
          status = "enrolled";
        }
        const result = await benificiaryRegistoryService.beneficiariesFilter({
          ...filter,
          status,
        });
        setData(result.data?.data);
        setPaginationTotalRows(
          result?.data?.totalCount ? result?.data?.totalCount : 0,
        );
        setLoading(false);
      }
    };
    init();
  }, [filter, stateName]);

  useEffect(() => {
    const filterNameNew = `${type || "enrollment"}_${filterNameCore}`;
    setFilterName(filterNameNew);
    const urlFilter = getFilterLocalStorage(filterNameNew);
    setFilter({ ...filter, ...urlFilter });
    setUrlFilterApply(true);
  }, []);

  useEffect(() => {
    const init = async () => {
      const result = await enumRegistryService.listOfEnum();
      let { state_name } = await getSelectedProgramId();
      setStateName(state_name);
      let list = result?.data?.ENROLLEMENT_VERIFICATION_STATUS;
      if (state_name !== "RAJASTHAN") {
        list = result?.data?.ENROLLEMENT_VERIFICATION_STATUS?.filter(
          (e) => e.value != "sso_id_verified",
        );
      }
      let title1;
      if (type === "SSOID") {
        title1 = "SSOID_VERIFICATION";
      } else if (type === "SYC") {
        title1 = "SYC_VERIFICATION";
      } else {
        title1 = "ENROLLMENT_VERIFICATION";
      }
      setTitle(title1);

      setBeneficiaryStatus(list);
    };
    init();
  }, []);

  const setFilterObject = (data) => {
    setFilter(data);
    setFilterLocalStorage(filterName, data);
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
          <AdminTypo.H4 bold>{t(title)}</AdminTypo.H4>
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
        <VStack style={{ position: "relative", overflowX: "hidden" }}>
          <VStack
            style={{
              top: 0,
              transition: "left 0.3s ease",
              left: "0",
              position: "absolute",
              width: "250px",
              background: "white",
              zIndex: 1,
              height: "100%",
            }}
          >
            <Box
              flex={[2, 2, 1]}
              style={{
                borderRightWidth: "2px",
                borderRightColor: "dividerColor",
              }}
            >
              <ScrollView
                pr="2"
                maxH={
                  Height -
                  (refAppBar?.clientHeight +
                    ref?.current?.clientHeight +
                    refSubHeader?.current?.clientHeight)
                }
              >
                {urlFilterApply && (
                  <Filter
                    {...{
                      filter,
                      setFilter: (fdata) => {
                        setFilterLocalStorage(filterName, fdata);
                        setFilter(fdata);
                      },
                    }}
                  />
                )}
              </ScrollView>
            </Box>
          </VStack>

          <VStack
            style={{
              transition: "margin-left 0.3s ease",
              marginLeft: isDrawerOpen ? "250px" : "0",
            }}
          />
        </VStack>
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
              {type !== "SYC" && (
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
              )}
              <Table
                {...{
                  data,
                  loading,
                  paginationTotalRows,
                  setFilterObject,
                  handleRowClick,
                }}
              />
            </VStack>
          </ScrollView>
        </Box>
      </HStack>
    </Layout>
  );
}

EnrollmentVerificationList.propTypes = {
  footerLinks: PropTypes.any,
};

export const Table = ({
  loading,
  data,
  paginationTotalRows,
  setFilterObject,
  handleRowClick,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <DataTable
      customStyles={tableCustomStyles}
      columns={[...columns(t, navigate)]}
      data={data}
      persistTableHead
      progressPending={loading}
      pagination
      paginationServer
      paginationTotalRows={paginationTotalRows}
      onChangeRowsPerPage={(e) => {
        setFilterObject((filter) => ({ ...filter, limit: e, page: 1 }));
      }}
      onChangePage={(e) => {
        setFilterObject((filter) => ({ ...filter, page: e }));
      }}
      onRowClicked={handleRowClick}
    />
  );
};

Table.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.array,
  paginationTotalRows: PropTypes.number,
  setFilterObject: PropTypes.func,
  handleRowClick: PropTypes.func,
};

export default memo(EnrollmentVerificationList);
