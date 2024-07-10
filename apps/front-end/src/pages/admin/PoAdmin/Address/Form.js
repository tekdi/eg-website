import {
  AdminTypo,
  PoAdminLayout,
  eventService,
  getOptions,
  IconByName,
  cohortService,
  setSelectedProgramId,
  Breadcrumb,
} from "@shiksha/common-lib";
import { Button, HStack, VStack } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import {
  widgets,
  templates,
  onError,
  transformErrors,
} from "component/BaseInput";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Schema = {
  type: "object",
  required: [
    "state_name",
    "state_cd",
    "district_name",
    "district_cd",
    "udise_block_code",
    "block_name",
    "grampanchayat_cd",
    "grampanchayat_name",
    "vill_ward_cd",
    "village_ward_name",
    "school_name",
    "udise_sch_code",
    "sch_category_id",
    // "sch_mgmt_id",
    // "open_school_type",
    // "nodal_code",
  ],
  properties: {
    state_name: {
      title: "STATE_NAME",
      type: "string",
    },
    state_cd: {
      type: "string",
      title: "STATE_CD",
    },
    district_name: {
      type: "string",
      title: "DISTRICT_NAME",
      regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
    },
    district_cd: {
      type: "string",
      title: "DISTRICT_CD",
    },
    udise_block_code: {
      type: "string",
      title: "UDISE_BLOCK_CODE",
    },
    block_name: {
      type: "string",
      title: "BLOCK_NAME",
      regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
    },
    grampanchayat_cd: {
      type: "string",
      title: "GRAMPANCHAYAT_CD",
    },
    grampanchayat_name: {
      type: "string",
      title: "GRAMPANCHAYAT_NAME",
      regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
    },
    vill_ward_cd: {
      type: "string",
      title: "VILLAGE_WARD_CD",
    },
    village_ward_name: {
      type: "string",
      title: "VILLAGE_WARD_NAME",
      regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
    },
    school_name: {
      type: "string",
      title: "SCHOOL_NAME",
    },
    udise_sch_code: {
      type: "string",
      title: "UDISE_SCH_CODE",
    },
    sch_category_id: {
      type: ["string", "number"],
      title: "SCH_CATEGORY_ID",
    },
    sch_mgmt_id: {
      type: "string",
      title: "SCH_MANAGEMENT_ID",
    },

    open_school_type: {
      type: ["string"],
      title: "OPEN_SCHOOL_TYPE",
    },
    nodal_code: {
      type: "string",
      title: "NODAL_CODE",
    },
  },
};

export default function App() {
  const { t } = useTranslation();
  const formRef = useRef();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const navigate = useNavigate();
  const [schema, setSchema] = useState(Schema);
  const [formData, setFormData] = useState();

  useEffect(async () => {
    if (Schema?.properties?.state) {
      const { data } = await cohortService.getProgramList();
      const newData = data.map((e) => ({
        ...e,
        state_name: `${e?.state?.state_name}`,
      }));
      let newSchema = Schema;
      if (Schema["properties"]["state"]) {
        newSchema = getOptions(newSchema, {
          key: "state_name",
          arr: newData,
          title: "state_name",
          value: "id",
        });
      }

      setSchema(newSchema);
    }
  }, []);

  const onChange = async (e, id) => {
    const newData = e.formData;
    if (newData?.state) {
      setSelectedProgramId({
        program_id: newData?.state,
      });
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const newData = Object.keys(data.formData).reduce((acc, key) => {
      acc[key] =
        typeof data.formData[key] === "string"
          ? data.formData[key].toUpperCase()
          : data.formData[key];
      return acc;
    }, {});
    // const newData = data.formData;
    const result = await eventService.createAddress(newData);
    if (!result.error) {
      navigate("/poadmin/Address");
    } else {
      setFormData(newData);
      setErrors({
        [result?.key || "name"]: {
          __errors: [result?.message],
        },
      });
    }
    setLoading(false);
  };

  return (
    <PoAdminLayout _appBar={{ setLang }}>
      <VStack p={4}>
        <VStack pt={4}>
          <Breadcrumb
            drawer={<IconByName size="sm" name="ArrowRightSLineIcon" />}
            data={[
              {
                title: (
                  <HStack>
                    <IconByName name="GroupLineIcon" size="md" />
                    <AdminTypo.H4 bold color="Activatedcolor.400">
                      {t("ALL_ADDRESSES")}
                    </AdminTypo.H4>
                  </HStack>
                ),
                link: "/poadmin/Address",
                icon: "GroupLineIcon",
              },
              {
                title: (
                  <AdminTypo.H4
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    bold
                  >
                    {t("CREATE")}
                  </AdminTypo.H4>
                ),
              },
            ]}
          />
        </VStack>

        <VStack p="4" space={4}>
          <Form
            key={lang}
            ref={formRef}
            extraErrors={errors}
            showErrorList={false}
            noHtml5Validate={true}
            {...{
              widgets,
              templates,
              validator,
              schema: schema || {},
              formData,
              onError,
              onSubmit,
              onChange,
              transformErrors: (e) => transformErrors(e, schema, t),
            }}
          >
            <HStack space={6} justifyContent={"center"} my="4">
              <AdminTypo.Secondarybutton
                icon={
                  <IconByName
                    color="black"
                    _icon={{ size: "18px" }}
                    name="DeleteBinLineIcon"
                  />
                }
                onPress={() => navigate("/poadmin/Address")}
              >
                {t("CANCEL")}
              </AdminTypo.Secondarybutton>
              <AdminTypo.PrimaryButton
                isLoading={loading}
                type="submit"
                p="4"
                onPress={() => {
                  formRef?.current?.submit();
                }}
              >
                {t("SUBMIT")}
              </AdminTypo.PrimaryButton>
            </HStack>
          </Form>
        </VStack>
      </VStack>
    </PoAdminLayout>
  );
}
