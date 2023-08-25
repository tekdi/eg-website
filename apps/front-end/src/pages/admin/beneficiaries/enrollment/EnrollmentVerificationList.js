import {
  IconByName,
  benificiaryRegistoryService,
  ImageView,
  AdminTypo,
  enumRegistryService,
  tableCustomStyles,
  debounce,
  useWindowSize,
  AdminLayout as Layout,
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
} from "native-base";
import React from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Filter } from "../AdminBeneficiariesList";

const columns = (t, navigate) => [
  {
    name: t("LEARNERS_ID"),
    selector: (row) => row?.id,
  },
  {
    name: t("LEARNERS_NAME"),
    selector: (row) => (
      <HStack alignItems={"center"} space="2">
        {row?.profile_photo_1?.name ? (
          <ImageView
            source={{
              uri: row?.profile_photo_1?.name,
            }}
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
    ),
    attr: "name",
    wrap: true,
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
      } else {
        if (row?.dob) {
          return moment().diff(row?.dob, "years");
        } else {
          return "-";
        }
      }
    },
  },
  {
    name: t("PRERAK_ID"),
    selector: (row) => row?.program_beneficiaries?.id,
  },
  {
    name: t("PRERAK_NAME"),
    selector: (row) => {
      const {
        program_beneficiaries: {
          facilitator_user: { first_name, last_name },
        },
      } = row;
      return first_name || last_name ? `${first_name}${last_name || ""}` : "-";
    },
    wrap: true,
  },
  {
    name: t("STATUS"),
    selector: (row, index) => (
      <ChipStatus
        key={index}
        is_duplicate={row?.is_duplicate}
        is_deactivated={row?.is_deactivated}
        status={row?.program_beneficiaries?.status}
      />
    ),

    attr: "email",
    wrap: true,
  },
  {
    name: t("ACTION"),
    selector: (row) =>
      row?.program_beneficiaries?.status === "enrolled" && (
        <AdminTypo.Secondarybutton
          my="3"
          onPress={() => {
            navigate(`/admin/learners/enrollmentReceipt/${row?.id}`);
          }}
        >
          {t("VIEW")}
        </AdminTypo.Secondarybutton>
      ),
  },
];

// Table component
function EnrollmentVerificationList({ footerLinks }) {
  const [beneficiaryStatus, setBeneficiaryStatus] = React.useState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [Width, Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = React.useState();
  const ref = React.useRef(null);

  const [filter, setFilter] = React.useState({ limit: 10, status: "enrolled" });
  const [loading, setLoading] = React.useState(true);

  const [data, setData] = React.useState([]);
  const [paginationTotalRows, setPaginationTotalRows] = React.useState(0);

  React.useEffect(async () => {
    setLoading(true);
    const result = await benificiaryRegistoryService.beneficiariesFilter(
      filter
    );
    setData(result.data?.data);
    setPaginationTotalRows(
      result?.data?.totalCount ? result?.data?.totalCount : 0
    );
    setLoading(false);
  }, [filter]);

  // React.useEffect(() => {
  //   setFilter(urlData(["district", "facilitator", "block"]));
  // }, []);

  React.useEffect(async () => {
    const result = await enumRegistryService.listOfEnum();
    setBeneficiaryStatus(result?.data?.ENROLLEMENT_VERIFICATION_STATUS);
  }, []);

  return (
    <Layout getRefAppBar={(e) => setRefAppBar(e)} _sidebar={footerLinks}>
      <HStack>
        <Box
          flex={[2, 2, 1]}
          style={{ borderRightColor: "dividerColor", borderRightWidth: "2px" }}
        >
          <HStack ref={ref}></HStack>
          <ScrollView
            maxH={
              Height - (refAppBar?.clientHeight + ref?.current?.clientHeight)
            }
            pr="2"
          >
            <Filter {...{ filter, setFilter }} />
          </ScrollView>
        </Box>
        <Box flex={[5, 5, 4]}>
          <ScrollView
            maxH={Height - refAppBar?.clientHeight}
            minH={Height - refAppBar?.clientHeight}
          >
            <Box roundedBottom={"2xl"} py={6} px={4} mb={5}>
              <VStack>
                <HStack my="1" mb="3" justifyContent="space-between">
                  <HStack justifyContent="space-between" alignItems="center">
                    <IconByName
                      isDisabled
                      name="GraduationCap"
                      _icon={{ size: "35" }}
                    />
                    <AdminTypo.H1 px="5">
                      {t("ENROLLMENT_VERIFICATION")}
                    </AdminTypo.H1>
                    <Image
                      source={{
                        uri: "/box.svg",
                      }}
                      alt=""
                      size={"28px"}
                      resizeMode="contain"
                    />
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
                    onChange={(e) => {
                      debounce(
                        setFilter({
                          ...filter,
                          search: e.nativeEvent.text,
                          page: 1,
                        }),
                        2000
                      );
                    }}
                  />
                </HStack>
                <ScrollView horizontal={true} mb="2">
                  <HStack pb="2">
                    <Text
                      color={
                        !filter?.enrollment_verification_status
                          ? "blueText.400"
                          : ""
                      }
                      bold={!filter?.enrollment_verification_status}
                      cursor={"pointer"}
                      mx={3}
                      onPress={() => {
                        const { enrollment_verification_status, ...newFilter } =
                          filter;
                        setFilter(newFilter);
                      }}
                    >
                      {t("BENEFICIARY_ALL")}
                      {!filter?.enrollment_verification_status &&
                        `(${paginationTotalRows})`}
                    </Text>
                    {beneficiaryStatus
                      ?.filter((e) => e?.value !== "verified")
                      ?.map((item) => {
                        return (
                          <Text
                            key={item}
                            color={
                              filter?.enrollment_verification_status ==
                              t(item?.value)
                                ? "blueText.400"
                                : ""
                            }
                            bold={
                              filter?.enrollment_verification_status ==
                              t(item?.value)
                            }
                            cursor={"pointer"}
                            mx={3}
                            onPress={() => {
                              setFilter({
                                ...filter,
                                enrollment_verification_status: item?.value,
                                page: 1,
                              });
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
                  columns={[...columns(t, navigate)]}
                  data={data}
                  persistTableHead
                  progressPending={loading}
                  pagination
                  paginationRowsPerPageOptions={[10, 15, 25, 50, 100]}
                  paginationServer
                  paginationTotalRows={paginationTotalRows}
                  onChangeRowsPerPage={(e) => {
                    setFilter({ ...filter, limit: e });
                  }}
                  onChangePage={(e) => {
                    setFilter({ ...filter, page: e });
                  }}
                />
              </VStack>
            </Box>
          </ScrollView>
        </Box>
      </HStack>
    </Layout>
  );
}

export default EnrollmentVerificationList;
