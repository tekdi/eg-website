import React, { useState, useEffect } from "react";
import {
  PCusers_layout as Layout,
  CardComponent,
  FrontEndTypo,
  enumRegistryService,
} from "@shiksha/common-lib";
import { useTranslation } from "react-i18next";
import { Pressable, VStack } from "native-base";
import { useNavigate, useParams } from "react-router-dom";

const List = ({ userTokenInfo }) => {
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const { category } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const { data: enums } = await enumRegistryService.listOfEnum();
      setList(enums?.[category]);
      setLoading(false);
    };
    init();
  }, []);

  return (
    <Layout
      loading={loading}
      facilitator={userTokenInfo?.authUser || {}}
      analyticsPageTitle={"HOME"}
      pageTitle={t("HOME")}
      _appBar={{
        lang,
        setLang,
        onPressBackButton: (e) => {
          navigate(`/daily-activities/categories`);
        },
      }}
    >
      <VStack space="4" p="4" alignContent="center">
        <FrontEndTypo.H1 py="4">
          {`${t("DAILY_ACTIVITIES")} - ${t("PCUSER_ACTIVITY.PC_USER_ACTIVITY_CATEGORIES_" + category.replace("_ACTIVITY", ""))}`}
        </FrontEndTypo.H1>
        {list?.map((item) => {
          return (
            <Pressable
              flex={1}
              onPress={async () => {
                navigate(`/daily-activities/${category}/${item?.value}/view`);
              }}
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
