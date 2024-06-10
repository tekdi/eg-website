import {
    AdminTypo,
    PoAdminLayout,
    organisationService,
    getOptions,
    IconByName,
    cohortService,
    setSelectedProgramId,
    Breadcrumb,
    validation,
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
  import Chip from "component/Chip";
  
  const Schema = {
    // title: "CREATE_IP",
    // description: "ADD_A_IP",
    type: "object",
    required: [
        "State name",
        "State cd",
      "District name",
          "District cd" ,
          "udise blockcode",
        "Block name",
       "Grampanchayat cd",
         "Grampanchayat name",
         "Village ward cd",
         "Village ward name",
         "School name",
         "udise sch code",
         "sch category id",
        "sch management id",
       "Open school type",
         "Nodal code"
    ],
    properties: {
        state_name: {
        type: "string",
        title: "STATE_NAME",
        // //: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
      },
      state_cd: {
        type: "string",
        title: "STATE_CD",
        // //: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
      },
      district_name: {
        type: "string",
        title: "DISTRICT_NAME",
        //: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
      },
      district_cd: {
        type: "string",
        title: "DISTRICT_ID",
        //: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
      },
      udise_block_code: {
        type: "string",
        title: "UDISE_BLOCK_CODE",
        //: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
      },
      block_name: {
        type: "string",
        title: "BLOCK_NAME",
        //: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
      },
      grampanchayat_cd: {
        type: "string",
        title: "GRAMPANCHAYAT_CD",
        //: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
      },
      grampanchayat_name: {
        type: "string",
        title: "GRAMPANCHAYAT_NAME",
        //: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
      },
    
      vill_ward_cd: {
        type: "string",
        format: "email",
        title: "VILLAGE_WARD_CD",
      },
     
      village_ward_name: {
        title: "VILLAGE_WARD_NAME",
        type: "string",
      },
      school_name: {
        title: "SCHOOL_NAME",
        type: "string",
      },
      udise_sch_code: {
        title: "UDISE_SCH_CODE",
        format: "select",
        // enum: ["15", "16", "17", "18", "19", "20"],
      },
      sch_category_id: {
        type: ["string", "number"],
        title: "SCH_CATEGORY_ID",
        readOnly: true,
      },
      sch_mgmt_id: {
        type: ["string", "number"],
        title: "SCH_MANAGEMENT_ID",
        readOnly: true,
      },
      open_school_type: {
        type: ["string", "number"],
        title: "OPEN_SCHOOL_TYPE",
        readOnly: true,
      },
      nodal_code: {
        type: ["string", "number"],
        title: "NODAL_CODE",
        readOnly: true,
      },
      // doc_per_cohort_id: {
      //   type: "string",
      //   label: "DUE_DILIGENCE_SIGNED_PROPOSAL",
      //   document_type: "camp",
      //   document_sub_type: "consent_form",
      //   format: "FileUpload",
      // },
      // doc_per_monthly_id: {
      //   type: "string",
      //   label: "QUARTELY_CA_CERTIFIED",
      //   document_type: "camp",
      //   document_sub_type: "consent_form",
      //   format: "FileUpload",
      // },
      // doc_quarterly_id: {
      //   type: "string",
      //   label: "MONTHLY_UTILIZATION",
      //   document_type: "camp",
      //   document_sub_type: "consent_form",
      //   format: "FileUpload",
      // },
    },
  };
  
  export default function App() {
    const { t } = useTranslation();
    const formRef = useRef();
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [lang, setLang] = React.useState(localStorage.getItem("lang"));
    const navigate = useNavigate();
    const [schema, setSchema] = useState({});
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
            key: "state",
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
  
      if (id === "root_learner_target" || id === "root_learner_per_camp") {
        const avgCount = Math.ceil(
          newData?.learner_target / newData?.learner_per_camp
        );
        const updatedFormData = { ...newData };
        updatedFormData.camp_target = avgCount;
        setFormData(updatedFormData);
      }
    };
  
    // const customValidate = (data, err) => {
    //   if (data?.mobile) {
    //     const isValid = validation({
    //       data: data?.mobile,
    //       key: "mobile",
    //       type: "mobile",
    //     });
    //     if (isValid) {
    //       err?.mobile?.addError([t("PLEASE_ENTER_VALID_NUMBER")]);
    //     }
    //   }
    //   return err;
    // };
  
    const onSubmit = async (data) => {
      setLoading(true);
      const newData = data.formData;
      const result = await organisationService.createOrg(newData);
      if (!result.error) {
        navigate("/poadmin/address");
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
                        {t("ALL_ADDRESS")}
                      </AdminTypo.H4>
                    </HStack>
                  ),
                  link: "/poadmin/ips",
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
                // customValidate,
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
                  onPress={() => navigate("/poadmin/address")}
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
  