import {
  Breadcrumb,
  FrontEndTypo,
  PCusers_layout as Layout,
  campService,
} from "@shiksha/common-lib";
import BeneficiaryCard from "component/Beneficiary/BeneficiaryCard";
import Chip from "component/Chip";
import { VStack } from "native-base";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const List = ({ data }) => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <VStack space="4" p="4" alignContent="center">
      <Breadcrumb
        _hstack={{ flexWrap: "wrap", pb: 2 }}
        data={[
          <FrontEndTypo.H1 key="1-b">{t("CAMP")}</FrontEndTypo.H1>,
          <Chip key="2-b" py="1" px="3" label={id} />,
          <FrontEndTypo.H2 key="3-b" color="textGreyColor.700">
            {t("LEARNERS_DETAILS")}
          </FrontEndTypo.H2>,
        ]}
      />
      {(data && data?.length > 0) || data?.constructor?.name === "Array" ? (
        data &&
        data?.constructor?.name === "Array" &&
        data?.map((item) => (
          <BeneficiaryCard
            key={item?.id}
            item={{
              ...item,
              program_beneficiaries: item?.program_beneficiaries?.[0] || {},
            }}
            onPress={async () => {
              navigate(`/learners/list-view/${item?.id}`);
            }}
          />
        ))
      ) : (
        <FrontEndTypo.H3>{t("DATA_NOT_FOUND")}</FrontEndTypo.H3>
      )}
    </VStack>
  );
};

List.propTypes = {
  data: PropTypes.array,
};

export default function CampLearnerList({ userTokenInfo }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [filter, setFilter] = useState({ limit: 6 });
  const [hasMore, setHasMore] = useState(true);
  const [loadingHeight, setLoadingHeight] = useState(0);
  const location = useLocation();
  const [campLearners, setCampLearners] = useState();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const getPrerakCampProfile = async () => {
    setLoading(true);
    try {
      const payload = {
        academic_year_id: location.state?.academic_year_id,
        program_id: location.state?.program_id,
        user_id: location.state?.user_id,
      };
      const result = await campService.getPrerakCampProfile(id, payload);
      setCampLearners(result?.group_users);
      if (result?.group_users?.length == 0) {
        setHasMore(false);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);

      setLoading(false);
    }
  };

  useEffect(() => {
    getPrerakCampProfile();
  }, []);

  return (
    <Layout
      getBodyHeight={(e) => setLoadingHeight(e)}
      _appBar={{
        name: t("PRERAK_PROFILE"),
        onPressBackButton: () => {
          navigate(`/camps/${id}`, {
            state: {
              academic_year_id: location.state?.academic_year_id,
              program_id: location.state?.program_id,
              user_id: location.state?.user_id,
            },
          });
        },
      }}
      loading={loading}
      analyticsPageTitle={"PRERAK_PROFILE"}
      pageTitle={t("PRERAK_PROFILE")}
      facilitator={userTokenInfo?.authUser || {}}
    >
      <InfiniteScroll
        dataLength={campLearners?.length || 0}
        next={(e) =>
          setFilter({
            ...filter,
            page: (filter?.page ? filter?.page : 1) + 1,
          })
        }
        hasMore={hasMore}
        key={loadingHeight}
        height={loadingHeight}
        // loader={<Loading height="100" />}
        endMessage={
          <FrontEndTypo.H3 bold display="inherit" textAlign="center">
            {campLearners?.length > 0
              ? t("COMMON_NO_MORE_RECORDS")
              : t("DATA_NOT_FOUND")}
          </FrontEndTypo.H3>
        }
        // below props only if you need pull down functionality
        pullDownToRefreshThreshold={50}
      >
        <List data={campLearners} />
      </InfiniteScroll>
    </Layout>
  );
}

CampLearnerList.PropTypes = {
  userTokenInfo: PropTypes.object,
};
