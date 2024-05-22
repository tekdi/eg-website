import React, { useState, useRef, useEffect } from "react";
import Form from "@rjsf/core";
import schema1 from "./schema.js";
import { Alert, Box, HStack } from "native-base";
import {
  facilitatorRegistryService,
  geolocationRegistryService,
  BodyMedium,
  filterObject,
  FrontEndTypo,
  enumRegistryService,
  getOptions,
  validation,
  sendAndVerifyOtp,
} from "@shiksha/common-lib";
import moment from "moment";
import { useParams } from "react-router-dom";
import {
  templates,
  widgets,
  validator,
  transformErrors,
  onError,
} from "../../Static/FormBaseInput/FormBaseInput.js";
import { useTranslation } from "react-i18next";
import PhotoUpload from "./PhotoUpload.js";
import accessControl from "./AccessControl.js";
import AadhaarNumberValidation from "./AadhaarNumberValidation.js";
import {
  setIndexedDBItem,
  getIndexedDBItem,
} from "../../../utils/Helper/JSHelper.js"; // Import your indexedDB functions
import {
  getOnboardingData,
  updateOnboardingData,
} from "v2/utils/OfflineHelper/OfflineHelper.js";
import AddressOffline from "./AddressOffline.js";

// PrerakOnboardingForm
export default function PrerakOnboardingForm({
  userTokenInfo,
  userid,
  step,
  navigatePage,
}) {
  const [page, setPage] = useState();
  const [pages, setPages] = useState();
  const [schema, setSchema] = useState();
  const [cameraFile, setCameraFile] = useState();
  const formRef = useRef();
  const [formData, setFormData] = useState();
  const [facilitator, setFacilitator] = useState();
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState();
  const [yearsRange, setYearsRange] = useState([1980, 2030]);
  const [lang, setLang] = useState();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [qualifications, setQualifications] = useState([]);
  const [enumObj, setEnumObj] = useState();
  const [otpButton, setOtpButton] = useState(false);
  const [mobileConditon, setMobileConditon] = useState(false);
  const [fields, setFields] = useState([]);
  const [isOnline, setIsOnline] = useState(
    window ? window.navigator.onLine : false
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    setLang(localStorage.getItem("lang"));
  }, []);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const id = userid;
        if (id) {
          //get online data
          //const result = await facilitatorRegistryService.getOne({ id });

          //get offline data
          const result = await getOnboardingData(id);
          //console.log({ result });
          setFacilitator(result);
          const ListOfEnum = await getIndexedDBItem("enums");
          // const ListOfEnum = await enumRegistryService.listOfEnum();
          if (!ListOfEnum?.error) {
            setEnumObj(ListOfEnum?.data);
          }
          if (step === "qualification_details") {
            updateSchemaBasedOnDiploma(result?.core_faciltator?.has_diploma);

            const dataF = result?.qualifications;
            const arr = result?.program_faciltators?.qualification_ids;
            let arrData = arr
              ? JSON.parse(arr)
                  ?.filter((e) =>
                    qualifications.find(
                      (item) => item.id == e && item.type === "teaching"
                    )
                  )
                  ?.map((e) => `${e}`)
              : [];
            const newData = {
              ...dataF,
              qualification_reference_document_id:
                dataF?.qualification_reference_document_id || undefined,
              qualification_ids: arrData,
              qualification_master_id: `${
                dataF?.qualification_master_id
                  ? dataF?.qualification_master_id
                  : undefined
              }`,
              type_of_document: dataF?.document_reference?.doument_type,
            };
            setFormData({
              ...newData,
              has_diploma: result?.core_faciltator?.has_diploma
                ? result?.core_faciltator?.has_diploma
                : false, // || undefined,
              diploma_details:
                result?.core_faciltator?.diploma_details || undefined,
            });
          } else if (step === "reference_details") {
            if (result?.references?.designation === "") {
              const newData = {
                ...result?.references,
                designation: undefined,
              };
              setFormData(newData);
            } else {
              const newData = result?.references;
              setFormData(newData);
            }
          } else if (step === "basic_details") {
            const formDataObject = {
              first_name: result?.first_name,
              middle_name:
                result?.middle_name !== "" ? result?.middle_name : undefined,
              last_name:
                result?.last_name !== "" ? result?.last_name : undefined,
              dob: result?.dob,
            };
            setFormData(formDataObject);
          } else {
            let programSelected = jsonParse(localStorage.getItem("program"));
            setFormData({
              ...result,
              state: programSelected?.state_name,
              aadhar_no: result?.aadhar_no,
            });
          }
          getEditAccess();
        }
      } catch (error) {
        // Handle errors if necessary
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [step, qualifications]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const qData = await getIndexedDBItem("qualification");
        setQualifications(qData);
      } catch (error) {
        console.log(error);
      }
    };
    if (step === "qualification_details") {
      fetchData();
    }
  }, []);

  const getEditAccess = async () => {
    const id = userid;

    try {
      const result = await getIndexedDBItem("editRequest");
      let field;
      const parseField = result?.data?.[0]?.fields;
      if (parseField && typeof parseField === "string") {
        field = JSON.parse(parseField);
      }
      setFields(field || []);
    } catch (error) {
      console.error("Failed to get edit access:", error);
    }
  };

  const uiSchema = {
    labelAddress: {
      "ui:widget": "LabelAddressWidget",
    },
    dob: {
      "ui:widget": "alt-date",
      "ui:options": {
        yearsRange: yearsRange,
        hideNowButton: true,
        hideClearButton: true,
        format: "DMY",
      },
    },

    qualification_ids: {
      "ui:widget": "MultiCheck",
    },
    has_diploma: {
      "ui:widget": "RadioBtn",
    },
  };

  const nextPreviewStep = async (pageStape = "n") => {
    setAlert();
    const index = pages.indexOf(page);
    if (index !== undefined) {
      let nextIndex = "";
      if (pageStape.toLowerCase() === "n") {
        nextIndex = pages[index + 1];
      } else {
        nextIndex = pages[index - 1];
      }
      if (pageStape === "p") {
        if (nextIndex === "qualification_details") {
          navigatePage("/profile", "");
        } else if (nextIndex === "work_availability_details") {
          navigatePage("/facilitatorqualification", "");
        } else {
          navigatePage("/facilitatorbasicdetail", "");
        }
      } else if (nextIndex === "qualification_details") {
        navigatePage(`/profile/edit/vo_experience`, "vo_experience");
      } else if (nextIndex === "aadhaar_details") {
        navigatePage(`/profile/edit/upload`, "upload");
      } else if (nextIndex !== undefined) {
        navigatePage(`/profile/edit/${nextIndex}`, nextIndex);
      } else {
        navigatePage(`/aadhaar-kyc/${facilitator?.id}`, "", {
          state: "/profile",
        });
      }
    }
  };

  const setSchemaData = (newSchema) => {
    //window.alert(JSON.stringify(newSchema));
    setSchema(accessControl(newSchema, fields));
  };

  const jsonParse = (str, returnObject = {}) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      return returnObject;
    }
  };

  const updateSchemaBasedOnDiploma = (hasDiploma) => {
    if (!hasDiploma) {
      const propertiesMain = schema1.properties?.qualification_details;
      const constantSchema = propertiesMain;
      const { diploma_details, ...properties } =
        constantSchema?.properties || {};
      const required = constantSchema?.required.filter((item) =>
        [
          "has_diploma",
          "qualification_ids",
          "qualification_master_id",
          "qualification_reference_document_id",
        ].includes(item)
      );
      setSchemaData({ ...constantSchema, properties, required });
    } else if (hasDiploma) {
      const propertiesMain = schema1.properties?.qualification_details;
      const constantSchema = propertiesMain;
      setSchemaData(constantSchema);
    }
  };

  // update schema
  useEffect(() => {
    const fetchData = async () => {
      let newSchema = schema;

      try {
        if (schema?.properties?.district) {
          let programSelected = null;
          try {
            programSelected = jsonParse(localStorage.getItem("program"));
          } catch (error) {}
          //add user specific state
          if (programSelected != null) {
            newSchema = await setDistric({
              schemaData: newSchema,
              state: programSelected?.state_name,
              district: formData?.district,
              block: formData?.block,
              // gramp: formData?.grampanchayat,
            });
          }
        }
        if (schema?.properties?.device_ownership) {
          if (formData?.device_ownership == "no") {
            setAlert(t("YOU_NOT_ELIGIBLE"));
          } else {
            setAlert();
          }
        }
        if (schema?.properties?.designation) {
          //get local enum
          const ListOfEnum = await getIndexedDBItem("enums");

          newSchema = getOptions(newSchema, {
            key: "designation",
            arr: ListOfEnum?.FACILITATOR_REFERENCE_DESIGNATION,
            title: "title",
            value: "value",
          });
        }
        if (schema?.["properties"]?.["marital_status"]) {
          //get local enum
          const ListOfEnum = await getIndexedDBItem("enums");

          newSchema = getOptions(newSchema, {
            key: "social_category",
            arr: ListOfEnum?.FACILITATOR_SOCIAL_STATUS,
            title: "title",
            value: "value",
          });

          newSchema = getOptions(newSchema, {
            key: "marital_status",
            arr: ListOfEnum?.MARITAL_STATUS,
            title: "title",
            value: "value",
          });
        }

        if (schema?.["properties"]?.["device_type"]) {
          //get local enum
          const ListOfEnum = await getIndexedDBItem("enums");

          newSchema = getOptions(newSchema, {
            key: "device_type",
            arr: ListOfEnum?.MOBILE_TYPE,
            title: "title",
            value: "value",
          });
        }

        if (schema?.["properties"]?.["document_id"]) {
          const id = userid;
          newSchema = getOptions(newSchema, {
            key: "document_id",
            extra: { userId: id },
          });
        }
        setLoading(false);
        setSchemaData(newSchema);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [page, formData?.district, formData?.block, formData?.village]);

  useEffect(() => {
    let newSchema = schema;
    const fetchData = async () => {
      if (schema?.properties?.qualification_master_id) {
        setLoading(true);
        if (schema?.["properties"]?.["qualification_master_id"]) {
          newSchema = getOptions(newSchema, {
            key: "qualification_master_id",
            arr: qualifications,
            title: "name",
            value: "id",
            filters: { type: "qualification" },
          });
          if (newSchema?.properties?.qualification_master_id) {
            let valueIndex = "";
            newSchema?.properties?.qualification_master_id?.enumNames?.forEach(
              (e, index) => {
                if (e.match("12")) {
                  valueIndex =
                    newSchema?.properties?.qualification_master_id?.enum[index];
                }
              }
            );
            if (
              valueIndex !== "" &&
              formData?.qualification_master_id == valueIndex
            ) {
              setAlert(t("YOU_NOT_ELIGIBLE"));
            } else {
              setAlert();
            }
          }
        }
        if (schema?.["properties"]?.["qualification_reference_document_id"]) {
          const id = userid;
          newSchema = getOptions(newSchema, {
            key: "qualification_reference_document_id",
            extra: {
              userId: id,
              document_type: formData?.type_of_document,
            },
          });
        }

        if (schema?.["properties"]?.["qualification_ids"]) {
          newSchema = getOptions(newSchema, {
            key: "qualification_ids",
            arr: qualifications,
            title: "name",
            value: "id",
            filters: { type: "teaching" },
          });
        }
      }
    };
    fetchData();
    setLoading(false);
    setSchemaData(newSchema);
  }, [formData?.qualification_ids]);

  useEffect(() => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      const newStep = step || newSteps[0];
      setPage(newStep);
      setSchemaData(properties[newStep]);
      setPages(newSteps);
      let minYear = moment().subtract("years", 50);
      let maxYear = moment().subtract("years", 18);
      setYearsRange([minYear.year(), maxYear.year()]);
    }
  }, [step]);

  const userExist = async (filters) => {
    return await facilitatorRegistryService.isExist(filters);
  };

  const otpfunction = async () => {
    if (formData?.mobile.length < 10) {
      const newErrors = {
        mobile: {
          __errors: t("MINIMUM_LENGTH_IS_10"),
        },
      };
      setErrors(newErrors);
    }

    if (!(formData?.mobile > 6000000000 && formData?.mobile < 9999999999)) {
      const newErrors = {
        mobile: {
          __errors: t("PLEASE_ENTER_VALID_NUMBER"),
        },
      };
      setErrors(newErrors);
    }

    const { status, newSchema } = await sendAndVerifyOtp(schema, {
      ...formData,
      hash: localStorage.getItem("hash"),
    });

    if (status === true) {
      if (errors) {
        const newErrors = {
          mobile: {
            __errors: t("MOBILE_NUMBER_ALREADY_EXISTS"),
          },
        };
        setErrors(newErrors);
      } else {
        onClickSubmit(false);
      }
    } else if (status === false) {
      const newErrors = {
        otp: {
          __errors: [t("USER_ENTER_VALID_OTP")],
        },
      };
      setErrors(newErrors);
    } else {
      setSchemaData(newSchema);
      setOtpButton(true);
    }
  };

  const formSubmitUpdate = async (data, overide) => {
    const id = userid;
    if (id) {
      setLoading(true);
      const result = await facilitatorRegistryService.profileStapeUpdate({
        ...data,
        page_type: step,
        ...(overide || {}),
        id: id,
      });
      setLoading(false);
      return result;
    }
  };

  const customValidate = (data, errors) => {
    if (step === "contact_details") {
      if (data?.mobile) {
        validation({
          data: data?.mobile,
          key: "mobile",
          errors,
          message: `${t("PLEASE_ENTER_VALID_10_DIGIT_NUMBER")}`,
          type: "mobile",
        });
      }
      if (data?.alternative_mobile_number) {
        validation({
          data: data?.alternative_mobile_number,
          key: "alternative_mobile_number",
          errors,
          message: `${t("PLEASE_ENTER_VALID_10_DIGIT_NUMBER")}`,
          type: "mobile",
        });
      }
    }

    if (step === "reference_details") {
      if (data?.contact_number) {
        validation({
          data: data?.contact_number,
          key: "contact_number",
          errors,
          message: `${t("PLEASE_ENTER_VALID_10_DIGIT_NUMBER")}`,
          type: "mobile",
        });
      }
    }

    if (step === "basic_details") {
      ["first_name", "middle_name", "last_name"].forEach((key) => {
        validation({
          data:
            typeof data?.[key] === "string"
              ? data?.[key]?.replaceAll(" ", "")
              : data?.[key],
          key,
          errors,
          message: `${t("REQUIRED_MESSAGE")} ${t(
            schema?.properties?.[key]?.title
          )}`,
        });
        if (data?.[key] && !data?.[key]?.match(/^[a-zA-Z ]*$/g)) {
          errors?.[key]?.addError(
            `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
          );
        }
      });
      if (data?.dob) {
        validation({
          data: data?.dob,
          key: "dob",
          errors,
          message: `${t("MINIMUM_AGE_18_YEAR_OLD")}`,
          type: "age-18",
        });
      }
    }
    if (step === "aadhaar_details") {
      if (data?.aadhar_no) {
        const validation = AadhaarNumberValidation({
          aadhaar: data?.aadhar_no,
        });
        if (validation) {
          errors?.aadhar_no?.addError(`${t(validation)}`);
        }
      }
    }
    if (step === "qualification_details") {
      if (data?.qualification_ids.length === 0) {
        errors?.qualification_ids?.addError(
          `${t("REQUIRED_MESSAGE")} "${t(
            schema?.properties?.qualification_ids?.label
          )}"`
        );
      }
    }
    return errors;
  };

  const setDistric = async ({ gramp, state, district, block, schemaData }) => {
    let newSchema = schemaData;
    setLoading(true);
    if (schema?.properties?.district && state) {
      const qData = await geolocationRegistryService.getDistricts({
        name: state,
      });
      if (schema?.["properties"]?.["district"]) {
        newSchema = getOptions(newSchema, {
          key: "district",
          arr: qData?.districts,
          title: "district_name",
          value: "district_name",
        });
      }
      if (schema?.["properties"]?.["block"]) {
        newSchema = await setBlock({
          state,
          district,
          block,
          gramp,
          schemaData: newSchema,
        });
        setSchemaData(newSchema);
      }
    } else {
      newSchema = getOptions(newSchema, { key: "district", arr: [] });
      if (schema?.["properties"]?.["block"]) {
        newSchema = getOptions(newSchema, { key: "block", arr: [] });
      }
      if (schema?.["properties"]?.["village"]) {
        newSchema = getOptions(newSchema, { key: "village", arr: [] });
      }
      setSchemaData(newSchema);
    }
    setLoading(false);
    return newSchema;
  };

  const setBlock = async ({ gramp, state, district, block, schemaData }) => {
    let newSchema = schemaData;
    setLoading(true);
    if (schema?.properties?.block && district) {
      const qData = await geolocationRegistryService.getBlocks({
        name: district,
        state: state,
      });
      if (schema?.["properties"]?.["block"]) {
        newSchema = getOptions(newSchema, {
          key: "block",
          arr: qData?.blocks,
          title: "block_name",
          value: "block_name",
        });
      }
      // if (
      //   schema?.["properties"]?.["grampanchayat"] &&
      //   ["BIHAR"].includes(state)
      // ) {
      //   newSchema = await setGramp({
      //     state,
      //     district,
      //     block,
      //     gramp,
      //     schemaData: newSchema,
      //   });
      //   setSchemaData(newSchema);
      // } else {
      newSchema = await setVilage({
        state,
        district,
        block,
        gramp: "null",
        schemaData: newSchema,
      });
      setSchemaData(newSchema);
      // }
    } else {
      newSchema = getOptions(newSchema, { key: "block", arr: [] });
      if (schema?.["properties"]?.["village"]) {
        newSchema = getOptions(newSchema, { key: "village", arr: [] });
      }
      setSchemaData(newSchema);
    }
    setLoading(false);
    return newSchema;
  };

  // const setGramp = async ({ gramp, state, district, block, schemaData }) => {
  //   let newSchema = schemaData;
  //   setLoading(true);
  //   if (schema?.properties?.village && block) {
  //     const qData = await geolocationRegistryService.getGrampanchyat({
  //       block: block,
  //       state: state,
  //       district: district,
  //     });
  //     if (schema?.["properties"]?.["grampanchayat"]) {
  //       newSchema = getOptions(newSchema, {
  //         key: "grampanchayat",
  //         arr: qData?.gramPanchayat,
  //         title: "grampanchayat_name",
  //         value: "grampanchayat_name",
  //         format: "select",
  //       });
  //     }
  //     setSchemaData(newSchema);

  //     if (schema?.["properties"]?.["village"] && gramp) {
  //       newSchema = await setVilage({
  //         state,
  //         district,
  //         block,
  //         gramp,
  //         schemaData: newSchema,
  //       });
  //     }
  //   } else {
  //     newSchema = getOptions(newSchema, { key: "grampanchayat", arr: [] });
  //     setSchemaData(newSchema);
  //   }
  //   setLoading(false);
  //   return newSchema;
  // };

  const setVilage = async ({ state, district, gramp, block, schemaData }) => {
    let newSchema = schemaData;
    setLoading(true);
    if (schema?.properties?.village && block) {
      const qData = await geolocationRegistryService.getVillages({
        name: block,
        state: state,
        district: district,
        gramp: gramp || "null",
      });
      if (schema?.["properties"]?.["village"]) {
        newSchema = getOptions(newSchema, {
          key: "village",
          arr: qData?.villages,
          title: "village_ward_name",
          value: "village_ward_name",
        });
      }
      setSchemaData(newSchema);
    } else {
      newSchema = getOptions(newSchema, { key: "village", arr: [] });
      setSchemaData(newSchema);
    }
    setLoading(false);
    return newSchema;
  };

  const onChange = async (e, id) => {
    const data = e.formData;
    setErrors();
    const newData = { ...formData, ...data };
    setFormData(newData);
    if (id === "root_mobile") {
      if (
        data?.mobile?.toString()?.length === 10 &&
        facilitator?.mobile !== data?.mobile
      ) {
        const result = await userExist({ mobile: data?.mobile });
        if (result?.registeredAsFacilitator) {
          const newErrors = {
            mobile: {
              __errors: [t("MOBILE_NUMBER_ALREADY_EXISTS")],
            },
          };
          setErrors(newErrors);
          setMobileConditon(false);
        } else {
          setMobileConditon(true);
        }
        if (schema?.properties?.otp) {
          const { otp, ...properties } = schema?.properties;
          const required = schema?.required.filter((item) => item !== "otp");
          setSchemaData({ ...schema, properties, required });
          setFormData((e) => {
            const { otp, ...fData } = e;
            return fData;
          });
          setOtpButton(false);
        }
      }
    }
    setFormData(newData);
    if (id === "root_contact_number") {
      if (data?.contact_number?.toString()?.length < 10) {
        const newErrors = {
          contact_number: {
            __errors: [t("PLEASE_ENTER_VALID_10_DIGIT_NUMBER")],
          },
        };
        setErrors(newErrors);
      }
      if (userTokenInfo?.authUser?.mobile === data?.contact_number) {
        const newErrors = {
          contact_number: {
            __errors: [t("REFERENCE_NUMBER_SHOULD_NOT_BE_SAME")],
          },
        };
        setErrors(newErrors);
      }
    }
    if (id === "root_name") {
      if (!data?.name?.length) {
        const newErrors = {
          name: {
            __errors: [t("NAME_CANNOT_BE_EMPTY")],
          },
        };
        setErrors(newErrors);
      }
    }
    if (id === "root_alternative_mobile_number") {
      if (data?.alternative_mobile_number === data?.mobile) {
        const newErrors = {
          alternative_mobile_number: {
            __errors: [
              t(
                "ALTERNATIVE_MOBILE_NUMBER_SHOULD_NOT_BE_SAME_AS_MOBILE_NUMBER"
              ),
            ],
          },
        };
        setErrors(newErrors);
      }
    }
    if (id === "root_aadhar_no") {
      if (data?.aadhar_no?.toString()?.length === 12) {
        const result = await userExist({
          aadhar_no: data?.aadhar_no,
        });
        if (result?.success) {
          const newErrors = {
            aadhar_no: {
              __errors: [t("AADHAAR_NUMBER_ALREADY_EXISTS")],
            },
          };
          setErrors(newErrors);
        }
      }
    }
    if (id === "root_qualification") {
      if (schema?.properties?.qualification) {
        let valueIndex = "";
        schema?.properties?.qualification?.enumNames?.forEach((e, index) => {
          if (e.match("12")) {
            valueIndex = schema?.properties?.qualification?.enum[index];
          }
        });
        if (valueIndex !== "" && data.qualification == valueIndex) {
          setAlert(t("YOU_NOT_ELIGIBLE"));
        } else {
          setAlert();
        }
      }
    }

    if (id === "root_device_ownership") {
      if (schema?.properties?.device_ownership) {
        if (data?.device_ownership == "no") {
          setAlert(t("YOU_NOT_ELIGIBLE"));
        } else {
          setAlert();
        }
      }
    }

    if (id === "root_state") {
      await setDistric({
        schemaData: schema,
        state: data?.state,
        district: data?.district,
        block: data?.block,
      });
    }

    if (id === "root_district") {
      await setBlock({
        district: data?.district,
        block: data?.block,
        schemaData: schema,
      });
    }

    if (id === "root_block") {
      await setVilage({ block: data?.block, schemaData: schema });
    }

    if (id === "root_type_of_document") {
      let newSchema = schema;
      const user = userTokenInfo?.authUser;
      if (schema?.["properties"]?.["qualification_reference_document_id"]) {
        setLoading(true);
        newSchema = getOptions(schema, {
          key: "qualification_reference_document_id",
          extra: {
            userId: user?.id,
            document_type: data.type_of_document,
          },
        });
        setSchemaData(newSchema);
        setLoading(false);
      }
    }

    if (id === "root_pincode") {
      if (data?.pincode?.toString()?.length !== 6 && data?.pincode) {
        const newErrors = {
          pincode: {
            __errors: [t("PINCODE_ERROR")],
          },
        };
        setErrors(newErrors);
      }
    }
    if (id === "root_has_diploma") {
      updateSchemaBasedOnDiploma(data?.has_diploma);
    }

    if (id === "root_qualification_ids") {
      if (
        formData?.qualification_ids.includes("11") &&
        data?.qualification_ids?.length <= 1
      ) {
        setFormData({ ...formData, qualification_ids: ["11"] });
      } else if (
        data?.qualification_ids.includes("11") &&
        !formData?.qualification_ids.includes("11")
      ) {
        setFormData({ ...formData, qualification_ids: ["11"] });
      } else {
        setFormData({
          ...formData,
          qualification_ids: data?.qualification_ids?.filter((e) => e !== "11"),
        });
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      let newFormData = data.formData;
      if (schema?.properties?.first_name) {
        newFormData = {
          ...newFormData,
          ["first_name"]: newFormData?.first_name.replaceAll(" ", ""),
        };
      }
      if (_.isEmpty(errors)) {
        const newdata = filterObject(
          newFormData,
          Object.keys(schema?.properties),
          {},
          ""
        );

        // console.log({ step, isOnline });
        if (step === "aadhaar_details" && isOnline === true) {
          await formSubmitUpdate(newdata);
          await updateOnboardingData(userid, newdata);
        } else if (step === "aadhaar_details" && isOnline === false) {
          const newErrors = {
            aadhar_no: {
              __errors: [t("PLEASE_TURN_ON_YOUR_INTERNET")],
            },
          };
          setErrors(newErrors);
        } else {
          await updateOnboardingData(userid, newdata);
        }
        //console.log("new updated Form Data", newdata);

        //online data submit

        //offline data submit
        if (localStorage.getItem("backToProfile") === "false") {
          nextPreviewStep();
        } else {
          navigatePage("/profile", "");
        }
      }
    } catch (e) {
      console.log("error in submit", e);
    }
  };
  if (page === "upload") {
    return (
      <PhotoUpload
        key={facilitator}
        {...{
          userid,
          facilitator,
          formData,
          cameraFile,
          setCameraFile,
          aadhar_no: facilitator?.aadhar_no,
        }}
        navigatePage={navigatePage}
      />
    );
  }

  const onClickSubmit = (backToProfile) => {
    if (formRef.current.validateForm()) {
      formRef?.current?.submit();
    } else {
      if (formRef.current.validateForm()) {
        formRef?.current?.submit();
      }
    }
    localStorage.setItem("backToProfile", backToProfile);
  };

  if (step === "address_details") {
    if (!isOnline) {
      return (
        <AddressOffline
          alert={"ADDRESS_ALERT"}
          navigatePage={navigatePage}
          facilitator={facilitator}
        />
      );
    }
  }
  return (
    <Box py={6} px={4} mb={5}>
      {alert && (
        <Alert status="warning" alignItems={"start"} mb="3">
          <HStack alignItems="center" space="2" color>
            <Alert.Icon />
            <BodyMedium>{alert}</BodyMedium>
          </HStack>
        </Alert>
      )}
      {page && page !== "" && schema && (
        <Form
          key={lang + schema}
          ref={formRef}
          extraErrors={errors}
          showErrorList={false}
          noHtml5Validate={true}
          {...{
            widgets,
            templates,
            validator,
            schema: schema || {},
            uiSchema,
            formData,
            customValidate,
            onChange,
            onSubmit,
            onError,
            transformErrors: (errors) => transformErrors(errors, schema, t),
          }}
        >
          {mobileConditon && step === "contact_details" ? (
            <FrontEndTypo.Primarybutton
              mt="3"
              variant={"primary"}
              type="submit"
              onPress={otpfunction}
            >
              {otpButton ? t("VERIFY_OTP") : t("SEND_OTP")}
            </FrontEndTypo.Primarybutton>
          ) : (
            <Box alignItems={"center"}>
              <FrontEndTypo.Primarybutton
                isLoading={loading}
                p="4"
                minWidth="60%"
                mt="4"
                onPress={() => onClickSubmit(false)}
              >
                {t("SAVE_AND_NEXT")}
              </FrontEndTypo.Primarybutton>

              {step === "aadhaar_details" ? (
                <FrontEndTypo.Secondarybutton
                  isLoading={loading}
                  p="4"
                  mt="4"
                  onPress={() => navigatePage("/profile", "")}
                >
                  {t("GO_TO_PROFILE")}
                </FrontEndTypo.Secondarybutton>
              ) : (
                <FrontEndTypo.Secondarybutton
                  isLoading={loading}
                  p="4"
                  mt="4"
                  onPress={() => onClickSubmit(true)}
                >
                  {t("SAVE_AND_PROFILE")}
                </FrontEndTypo.Secondarybutton>
              )}
            </Box>
          )}
        </Form>
      )}
    </Box>
  );
}
