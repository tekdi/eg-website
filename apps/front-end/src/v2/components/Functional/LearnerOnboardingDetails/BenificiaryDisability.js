import {
  CardComponent,
  FrontEndTypo,
  GetEnumValue,
  Layout,
  benificiaryRegistoryService,
  enumRegistryService,
  getSelectedProgramId,
} from "@shiksha/common-lib";
import { VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import schema1 from "../LearnerUpdateDetail/disability/schema";
import PropTypes from "prop-types";

const GetEnumValueLocal = ({ keyName, value, enums }) => {
  const { t } = useTranslation();
  const [enumType, setEnumType] = useState();

  useEffect(() => {
    const init = async () => {
      let { state_name } = await getSelectedProgramId();
      switch (keyName) {
        case "has_disability":
          setEnumType("BENEFICIARY_HAVE_DISABILITY");

          break;
        case "has_disability_certificate":
          setEnumType("BENEFICIARY_DISABILITY_CERTIFICATE");

          break;
        case "type_of_disability":
          setEnumType("BENEFICIARY_DISABILITY_TYPE");

          break;
        case "disability_occurence":
          setEnumType("BENEFICIARY_DISABILITY_OCCURENCE");

          break;
        case "has_govt_advantage":
          setEnumType("BENEFICIARY_TAKING_ADVANTAGE_DISABILITY");

          break;
        case "govt_advantages":
          setEnumType(
            `BENEFICIARY_DISABILITY_${state_name?.replace(" ", "_")}`,
          );

          break;
        case "support_for_exam":
          setEnumType("BENEFICIARY_EXAM_SUPPORT_NEEDED");

          break;

        default:
          break;
      }
    };
    init();
  }, [keyName, value, enums]);

  if (keyName == "disability_percentage") {
    return value;
  }

  if (Array.isArray(value)) {
    return (
      <VStack>
        {value?.map((itemVlaue, index) => (
          <GetEnumValue
            key={enumType + index}
            t={t}
            enumType={enumType}
            enumOptionValue={itemVlaue}
            enumApiData={enums}
          />
        ))}
      </VStack>
    );
  }

  return (
    <GetEnumValue
      t={t}
      enumType={enumType}
      enumOptionValue={value}
      enumApiData={enums}
    />
  );
};

const setSchemaByDependency = async (item) => {
  let cardData = {};
  const data = await enumRegistryService.listOfEnum();
  const enumOptions = data?.data ? data?.data : {};
  const getData = ({ only, except } = {}) => {
    return Object.keys(schema1?.properties || {}).reduce((acc, key) => {
      if (schema1.properties[key].properties) {
        const keysArr = Object.keys(schema1.properties[key].properties);
        let labelData = [],
          itemData = {};
        keysArr.forEach((e) => {
          let boolean = true;
          if (Array.isArray(only) && only?.length > 0) {
            if (!only.includes(e)) {
              boolean = false;
            }
          } else if (Array.isArray(except) && except?.length > 0) {
            if (except.includes(e)) {
              boolean = false;
            }
          }
          if (boolean) {
            labelData = [
              ...labelData,
              schema1.properties[key].properties?.[e].label ||
                schema1.properties[key].properties?.[e].title,
            ];
            itemData = {
              ...itemData,
              [e]: (
                <GetEnumValueLocal
                  keyName={e}
                  value={item?.[e]}
                  enums={enumOptions}
                />
              ),
            };
          }
        });
        acc = {
          ...acc,
          labels: [...(acc.labels || []), ...labelData],
          item: itemData,
          keys: [...(acc.keys || []), ...keysArr],
        };
      }
      return acc;
    }, {});
  };

  const hasDisability = item?.has_disability;
  const hasDisabilityCertificate = item?.has_disability_certificate;
  const hasGovtAdvantage = item?.has_govt_advantage;
  if (hasDisability === "yes") {
    if (hasDisabilityCertificate === "no" && hasGovtAdvantage === "no") {
      cardData = getData({
        except: ["govt_advantages", "disability_percentage"],
      });
    } else if (hasGovtAdvantage === "no") {
      cardData = getData({ except: ["govt_advantages"] });
    } else if (hasDisabilityCertificate === "no") {
      cardData = getData({ except: ["disability_percentage"] });
    } else {
      cardData = getData();
    }
  } else {
    cardData = getData({ only: ["has_disability"] });
  }
  return cardData;
};

export default function BenificiaryDisability({ userTokenInfo, _layout }) {
  const { id } = useParams();
  const [item, setItem] = useState();
  const [label, setLabel] = useState();
  const [arr, setArr] = useState();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onPressBackButton = async () => {
    navigate(`/beneficiary/profile/${id}`);
  };

  useEffect(() => {
    const init = async () => {
      let extended_users = {};
      if (!_layout?.item) {
        const { result } = await benificiaryRegistoryService.getOne(id);
        extended_users = result?.extended_users || {};
      } else {
        extended_users = _layout?.item || {};
      }
      const cardData = await setSchemaByDependency(extended_users);
      setItem(cardData?.item);
      setLabel(cardData?.labels);
      setArr(cardData?.arr);
      setLoading(false);
    };
    init();
  }, []);

  return (
    <Layout
      loading={loading}
      _page={{ _scollView: { bg: "bgGreyColor.200" } }}
      _appBar={{
        name: t("BENEFICIARY_DISABILITY_DETAILS"),
        onPressBackButton,
        _box: { bg: "white" },
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={userTokenInfo?.authUser}
      analyticsPageTitle={"BENEFICIARY_DISABILITY_DETAILS"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("BENEFICIARY_DISABILITY_DETAILS")}
      {..._layout}
    >
      <VStack p="5" pt="0" space={4}>
        <VStack>
          <FrontEndTypo.H1 fontWeight="600" mb="3">
            {t("BENEFICIARY_DISABILITY_DETAILS")}
          </FrontEndTypo.H1>
          <CardComponent
            _vstack={{ space: 0 }}
            _hstack={{ borderBottomWidth: 0 }}
            title={t("BENEFICIARY_DISABILITY_DETAILS")}
            {...{ label, item, arr }}
            {...(_layout?.allowRoles?.includes("program_coordinator")
              ? {}
              : {
                  onEdit: (e) =>
                    navigate(`/beneficiary/edit/${id}/disability-details`),
                })}
          />
        </VStack>
      </VStack>
    </Layout>
  );
}

GetEnumValueLocal.propTypes = {
  keyName: PropTypes.string,
  value: PropTypes.any,
  enums: PropTypes.Object,
};

BenificiaryDisability.propTypes = {
  userTokenInfo: PropTypes.any,
};
