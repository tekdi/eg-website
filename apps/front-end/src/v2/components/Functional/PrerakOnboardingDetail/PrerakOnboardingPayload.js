import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PrerakMainPayload from "./PrerakMainPayload";
import { get, set } from "idb-keyval";

const PrerakOnboardingPayload = ({ payload }) => {
  const [pageTypeMappings, setPageTypeMappings] = useState({
    basic_details: {
      users: {
        first_name: payload?.first_name,
        middle_name: payload?.middle_name,
        last_name: payload?.last_name,
        dob: payload?.dob,
      },
    },
    contact_details: {
      users: {
        mobile: payload?.mobile,
        email_id: payload?.email_id,
        alternative_mobile_number: payload?.alternative_mobile_number,
      },
      core_facilitator: {
        device_ownership: payload?.device_ownership,
        device_type: payload?.device_type,
      },
    },
    address_details: {
      users: {
        state: payload?.state,
        district: payload?.district,
        block: payload?.block,
        grampanchayat: payload?.grampanchayat,
        village: payload?.village,
        pincode: payload?.pincode,
      },
    },
    personal_details: {
      users: {
        gender: payload?.gender,
      },
      extended_users: {
        marital_status: payload?.marital_status,
        social_category: payload?.social_category,
      },
    },
    reference_details: {
      references: {
        name: payload?.name,
        designation: payload?.designation,
        contact_number: payload?.contact_number,
      },
    },
    work_availability_details: {
      program_facilitators: {
        availability: payload?.availability,
      },
    },
    qualification_details: {
      qualifications: {
        qualification_master_id: payload?.qualification_master_id,
        qualification_ids: payload?.qualification_ids,
        has_diploma: payload?.has_diploma,
        diploma_details: payload?.diploma_details,
        documents: {
          base64: payload?.qualification_reference_document_id,
        },
      },
    },
    work_experience_details: {
      experience: [],
    },
  });

  useEffect(() => {
    if (payload.page_type === "work_experience_details") {
      setPageTypeMappings((prevState) => {
        return {
          ...prevState,
          work_experience_details: {
            ...prevState.work_experience_details,
            experience: [
              ...prevState.work_experience_details.experience,
              payload,
            ],
          },
        };
      });
    }
  }, [payload]);

  PrerakMainPayload({
    mainData: pageTypeMappings?.[payload?.page_type] || null,
  });

  return <div></div>;
};

PrerakOnboardingPayload.propTypes = {
  payload: PropTypes.object,
};

export default PrerakOnboardingPayload;
