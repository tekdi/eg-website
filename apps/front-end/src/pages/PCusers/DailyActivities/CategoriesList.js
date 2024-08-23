import React, { useState, useEffect } from "react";
import {
  PCusers_layout as Layout,
  CardComponent,
  FrontEndTypo,
  enumRegistryService,
  chunk,
  Breadcrumb,
  jsonParse,
} from "@shiksha/common-lib";
import { useTranslation } from "react-i18next";
import { HStack, Pressable, VStack } from "native-base";
import { useNavigate } from "react-router-dom";

const List = ({ userTokenInfo }) => {
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const { data: enums } = await enumRegistryService.listOfEnum();
        setList(chunk(enums.PC_USER_ACTIVITY_CATEGORIES, 2));
      } catch (error) {
        console.error("Failed to fetch enums:", error);
      } finally {
        setLoading(false);
      }
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
          navigate(`/select-village`);
        },
      }}
    >
      <VStack space="4" p="4" alignContent="center">
        <Breadcrumb
          _hstack={{ flexWrap: "wrap", pb: 4 }}
          data={[
            <FrontEndTypo.H1 key="1-b">{t("SELECT_CATEGORY")}</FrontEndTypo.H1>,
            <FrontEndTypo.H2 key="3-b" color="textGreyColor.700">
              {jsonParse(localStorage.getItem("activityAddress"))?.village}
            </FrontEndTypo.H2>,
          ]}
        />

        {list?.map((pitem) => (
          <HStack key={pitem} space={4}>
            {pitem?.map((item) => {
              return (
                <Pressable
                  flex={1}
                  onPress={async () => {
                    navigate(
                      `/daily-activities/${item?.foreign_enum_key}/list`,
                    );
                  }}
                  key={item}
                >
                  <CardComponent
                    _body={{ px: "2", pt: "8", pb: "8" }}
                    _vstack={{ p: 0, space: 0, flex: 1 }}
                  >
                    <FrontEndTypo.H2 textAlign="center">
                      {t(`PCUSER_ACTIVITY.${item.title}`)}
                    </FrontEndTypo.H2>
                  </CardComponent>
                </Pressable>
              );
            })}
          </HStack>
        ))}
      </VStack>
    </Layout>
  );
};

export default List;
