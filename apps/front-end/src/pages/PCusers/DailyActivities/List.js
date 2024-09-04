import React, { useState, useEffect } from "react";
import {
  PCusers_layout as Layout,
  CardComponent,
  FrontEndTypo,
  enumRegistryService,
  PcuserService,
} from "@shiksha/common-lib";
import { useTranslation } from "react-i18next";
import { Pressable, VStack } from "native-base";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import moment from "moment";

const List = ({ userTokenInfo }) => {
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const { category } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const { data: enums } = await enumRegistryService.listOfEnum();
        setList(enums?.[category]);
      } catch (error) {
        console.error("Failed to fetch enums:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const getActivites = async (category, item) => {
    const { village } = JSON.parse(localStorage.getItem("activityAddress"), {});
    const payload = {
      page: "1",
      limit: "100",
      village,
      type: item?.value,
      date: moment().format("YYYY-MM-DD"),
    };
    const data = await PcuserService.activitiesDetails(payload);
    if (_.isEmpty(data?.data)) {
      navigate(`/daily-activities/${category}/${item?.value}/create`);
    } else {
      navigate(`/daily-activities/${category}/${item?.value}/view`);
    }
  };

  return (
    <Layout
      _appBar={{
        lang,
        setLang,
        onPressBackButton: (e) => {
          navigate(`/daily-activities/categories`);
        },
      }}
      loading={loading}
      facilitator={userTokenInfo?.authUser || {}}
      analyticsPageTitle={"LIST"}
      pageTitle={t("PCUSER_ACTIVITY")}
    >
      <VStack space="4" p="4" alignContent="center">
        <FrontEndTypo.H1 py="4">
          {`${t("DAILY_ACTIVITIES")} - ${t("PCUSER_ACTIVITY.PC_USER_ACTIVITY_CATEGORIES_" + category.replace("_ACTIVITY", ""))}`}
        </FrontEndTypo.H1>
        {list?.map((item) => {
          return (
            <Pressable
              flex={1}
              onPress={() => getActivites(category, item)}
              key={item}
            >
              <CardComponent
                _body={{ px: "6", pt: "6", pb: "6" }}
                _vstack={{ p: 0, space: 0, flex: 1 }}
              >
                <FrontEndTypo.H2 textAlign="center">
                  {t(`PCUSER_ACTIVITY.${item.title}`)}
                </FrontEndTypo.H2>
              </CardComponent>
            </Pressable>
          );
        })}
      </VStack>
    </Layout>
  );
};

export default List;

List.propTypes = {
  userTokenInfo: PropTypes.object,
};
