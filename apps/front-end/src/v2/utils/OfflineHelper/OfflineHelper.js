import { isArray } from "lodash";
import {
  getUserInfo,
  getUserUpdatedInfo,
  getOnlyChanged,
  mergeOnlyChanged,
  setPrerakUpdateInfo,
  mergeExperiences,
  setPrerakOfflineInfo,
  getUserInfoNull,
  setIpUserInfo,
} from "../SyncHelper/SyncHelper";
import { cohortService } from "@shiksha/common-lib";
import { arraysAreEqual, generateUniqueRandomNumber } from "../Helper/JSHelper";

export async function getOnboardingData(id) {
  try {
    const userGetInfo = await getUserInfo(id);
    const userUpdatedInfo = await getUserUpdatedInfo(id);
    //console.log("userGetInfo getOnboardingData", userGetInfo);
    //console.log("userUpdatedInfo getOnboardingData", userUpdatedInfo);
    const userMergedInfo = await mergeOnlyChanged(userGetInfo, userUpdatedInfo);
    //console.log("userMergedInfo getOnboardingData", userMergedInfo);
    //experience
    const userMergedInfo_experience = await mergeExperiences(
      userGetInfo?.experience,
      userUpdatedInfo?.experience,
      ""
    );
    /*console.log(
      "userMergedInfo_experience getOnboardingData",
      userMergedInfo_experience
    );*/
    //preprocess data
    //qualification id
    let qualification_id_arr = null;
    try {
      qualification_id_arr = JSON.parse(
        userMergedInfo?.program_faciltators?.qualification_ids
      );
      if (qualification_id_arr) {
        qualification_id_arr = qualification_id_arr.map((str) => parseInt(str));
      }
      qualification_id_arr = "[" + qualification_id_arr.toString() + "]";
    } catch (e) {}
    //vo_experience and experience
    let vo_experience = [];
    let experience = [];
    try {
      let experience_obj = userMergedInfo_experience;
      //console.log("experience_obj", experience_obj);
      //console.log("experience_obj.length", experience_obj.length);
      if (experience_obj) {
        for (let i = 0; i < experience_obj.length; i++) {
          let temp_obj_experience = {
            id: experience_obj[i]?.id,
            type: experience_obj[i]?.type,
            role_title: experience_obj[i]?.role_title,
            organization: experience_obj[i]?.organization,
            description: experience_obj[i]?.description,
            experience_in_years: experience_obj[i]?.experience_in_years,
            related_to_teaching: experience_obj[i]?.related_to_teaching,
            reference: {
              id: experience_obj[i]?.references?.id,
              name: experience_obj[i]?.references?.name,
              contact_number: experience_obj[i]?.references?.contact_number,
              type_of_document: experience_obj[i]?.references?.type_of_document,
              document_id: experience_obj[i]?.references?.documents?.base64,
              document_reference: {
                base64: experience_obj[i]?.references?.documents?.base64,
                id: experience_obj[i]?.references?.documents?.document_id,
                name: experience_obj[i]?.references?.documents?.name,
                document_sub_type:
                  experience_obj[i]?.references?.documents?.document_sub_type,
                document_type:
                  experience_obj[i]?.references?.documents?.document_type,
                provider: experience_obj[i]?.references?.documents?.provider,
                path: experience_obj[i]?.references?.documents?.path,
              },
            },
            status: experience_obj[i]?.status,
            unique_key: experience_obj[i]?.unique_key,
          };
          //console.log("temp_obj_experience", temp_obj_experience);
          if (experience_obj[i]?.type == "vo_experience") {
            vo_experience.push(temp_obj_experience);
          } else if (experience_obj[i]?.type == "experience") {
            experience.push(temp_obj_experience);
          }
        }
      }
    } catch (e) {}
    //set onboard format
    let format_result = {
      id: id,
      //step 1 basic_details
      first_name: userMergedInfo?.users?.first_name || undefined,
      last_name: userMergedInfo?.users?.last_name || undefined,
      middle_name: userMergedInfo?.users?.middle_name || undefined,
      dob: userMergedInfo?.users?.dob || undefined,
      //step 2 contact_details
      mobile: userMergedInfo?.users?.mobile || undefined,
      email_id: userMergedInfo?.users?.email_id || undefined,
      device_type: userMergedInfo?.core_faciltators?.device_type || undefined,
      device_ownership:
        userMergedInfo?.core_faciltators?.device_ownership || undefined,
      alternative_mobile_number:
        userMergedInfo?.users?.alternative_mobile_number || undefined,
      //step 3 address_details
      block: userMergedInfo?.users?.block || undefined,
      district: userMergedInfo?.users?.district || undefined,
      grampanchayat: userMergedInfo?.users?.grampanchayat || undefined,
      pincode: userMergedInfo?.users?.pincode || undefined,
      state: userMergedInfo?.users?.state || undefined,
      village: userMergedInfo?.users?.village || undefined,
      //step 4 personal_details
      gender: userMergedInfo?.users?.gender || undefined,
      marital_status:
        userMergedInfo?.extended_users?.marital_status || undefined,
      social_category:
        userMergedInfo?.extended_users?.social_category || undefined,
      //step 5 reference_details
      references: {
        contact_number: userMergedInfo?.references?.contact_number || undefined,
        designation: userMergedInfo?.references?.designation || undefined,
        name: userMergedInfo?.references?.name || undefined,
      },
      //step 6 work_availability_details
      program_faciltators: {
        availability:
          userMergedInfo?.program_faciltators?.availability || undefined,
        status: userMergedInfo?.program_faciltators?.status || undefined,
        //step 9 qualification_details
        qualification_ids: qualification_id_arr || undefined,
      },
      availability:
        userMergedInfo?.program_faciltators?.availability || undefined,
      //step 7 work_experience_details vo_experience
      vo_experience: vo_experience || undefined,
      //step 8 work_experience_details experience
      experience: experience || undefined,
      //step 9 qualification_details
      qualifications: {
        qualification_master_id:
          userMergedInfo?.qualifications?.qualification_master_id || undefined,
        qualification_reference_document_id:
          userMergedInfo?.qualifications?.documents?.base64 || undefined,
        qualification_master:
          userMergedInfo?.qualifications?.qualification_master || undefined,
      },
      qualification_ids: qualification_id_arr || undefined,
      core_faciltators: {
        has_diploma: userMergedInfo?.core_faciltators?.has_diploma
          ? userMergedInfo?.core_faciltators?.has_diploma
          : false,
        diploma_details:
          userMergedInfo?.core_faciltators?.diploma_details || undefined,
        has_job_exp: userMergedInfo?.core_faciltators?.has_job_exp || undefined,
        has_volunteer_exp:
          userMergedInfo?.core_faciltators?.has_volunteer_exp || undefined,
      },
      //step 10 profile photo 1
      profile_photo_1: {
        base64:
          userMergedInfo?.users?.profile_photo_1?.documents?.base64 ||
          undefined,
        id:
          userMergedInfo?.users?.profile_photo_1?.documents?.document_id ||
          undefined,
        name:
          userMergedInfo?.users?.profile_photo_1?.documents?.name || undefined,
        doument_type:
          userMergedInfo?.users?.profile_photo_1?.documents?.doument_type ||
          undefined,
        document_sub_type:
          userMergedInfo?.users?.profile_photo_1?.documents
            ?.document_sub_type || undefined,
        path:
          userMergedInfo?.users?.profile_photo_1?.documents?.path || undefined,
      },
      //step 11 profile photo 2
      profile_photo_2: {
        base64:
          userMergedInfo?.users?.profile_photo_2?.documents?.base64 ||
          undefined,
        id:
          userMergedInfo?.users?.profile_photo_2?.documents?.document_id ||
          undefined,
        name:
          userMergedInfo?.users?.profile_photo_2?.documents?.name || undefined,
        doument_type:
          userMergedInfo?.users?.profile_photo_2?.documents?.doument_type ||
          undefined,
        document_sub_type:
          userMergedInfo?.users?.profile_photo_2?.documents
            ?.document_sub_type || undefined,
        path:
          userMergedInfo?.users?.profile_photo_2?.documents?.path || undefined,
      },
      //step 12 profile photo 3
      profile_photo_3: {
        base64:
          userMergedInfo?.users?.profile_photo_3?.documents?.base64 ||
          undefined,
        id: userMergedInfo?.users?.profile_photo_3?.documents?.document_id,
        name:
          userMergedInfo?.users?.profile_photo_3?.documents?.name || undefined,
        doument_type:
          userMergedInfo?.users?.profile_photo_3?.documents?.doument_type ||
          undefined,
        document_sub_type:
          userMergedInfo?.users?.profile_photo_3?.documents
            ?.document_sub_type || undefined,
        path:
          userMergedInfo?.users?.profile_photo_3?.documents?.path || undefined,
      },
      //Aadhaar_Details
      aadhaar_verification_mode:
        userMergedInfo?.users?.aadhaar_verification_mode || undefined,
      aadhar_no: userMergedInfo?.users?.aadhar_no || undefined,
      aadhar_token: userMergedInfo?.users?.aadhar_token || undefined,
      aadhar_verified: userMergedInfo?.users?.aadhar_verified || undefined,
    };

    return format_result;
  } catch (error) {
    console.log(error);
    return {};
  }
}

export async function updateOnboardingData(id, onboardingData) {
  let userInfo = await getUserInfo(id);
  //console.log("userInfo", userInfo);
  let userUpdatedInfo = await getUserUpdatedInfo(id);
  //console.log("userUpdatedInfo", userUpdatedInfo);
  let users = new Object();
  let core_faciltators = new Object();
  let extended_users = new Object();
  let references = new Object();
  let program_faciltators = new Object();
  let experience = [];
  let qualifications = new Object();
  //step 1 basic_details
  onboardingData?.first_name || onboardingData?.first_name == ""
    ? onboardingData.first_name != userInfo?.users?.first_name
      ? (users.first_name = onboardingData.first_name)
      : delete userUpdatedInfo?.users?.first_name
    : null;
  onboardingData?.last_name || onboardingData?.last_name == ""
    ? onboardingData.last_name != userInfo?.users?.last_name
      ? (users.last_name = onboardingData.last_name)
      : delete userUpdatedInfo?.users?.last_name
    : null;
  onboardingData?.middle_name || onboardingData?.middle_name == ""
    ? onboardingData.middle_name != userInfo?.users?.middle_name
      ? (users.middle_name = onboardingData.middle_name)
      : delete userUpdatedInfo?.users?.middle_name
    : null;
  onboardingData?.dob || onboardingData?.dob == ""
    ? onboardingData.dob != userInfo?.users?.dob
      ? (users.dob = onboardingData.dob)
      : delete userUpdatedInfo?.users?.dob
    : null;
  //step 2 contact_details
  onboardingData?.mobile || onboardingData?.mobile == ""
    ? onboardingData.mobile != userInfo?.users?.mobile
      ? (users.mobile = onboardingData.mobile)
      : delete userUpdatedInfo?.users?.mobile
    : null;
  onboardingData?.email_id || onboardingData?.email_id == ""
    ? onboardingData.email_id != userInfo?.users?.email_id
      ? (users.email_id = onboardingData.email_id)
      : delete userUpdatedInfo?.users?.email_id
    : null;
  onboardingData?.device_type || onboardingData?.device_type == ""
    ? onboardingData.device_type != userInfo?.core_faciltators?.device_type
      ? (core_faciltators.device_type = onboardingData.device_type)
      : delete userUpdatedInfo?.core_faciltators?.device_type
    : null;
  onboardingData?.device_ownership || onboardingData?.device_ownership == ""
    ? onboardingData.device_ownership !=
      userInfo?.core_faciltators?.device_ownership
      ? (core_faciltators.device_ownership = onboardingData.device_ownership)
      : delete userUpdatedInfo?.core_faciltators?.device_ownership
    : null;
  onboardingData?.has_volunteer_exp || onboardingData?.has_volunteer_exp == ""
    ? onboardingData.has_volunteer_exp !=
      userInfo?.core_faciltators?.has_volunteer_exp
      ? (core_faciltators.has_volunteer_exp = onboardingData.has_volunteer_exp)
      : delete userUpdatedInfo?.core_faciltators?.has_volunteer_exp
    : null;

  onboardingData?.has_job_exp || onboardingData?.has_job_exp == ""
    ? onboardingData.has_job_exp != userInfo?.core_faciltators?.has_job_exp
      ? (core_faciltators.has_job_exp = onboardingData.has_job_exp)
      : delete userUpdatedInfo?.core_faciltators?.has_job_exp
    : null;

  onboardingData?.alternative_mobile_number ||
  onboardingData?.alternative_mobile_number == ""
    ? onboardingData.alternative_mobile_number !=
      userInfo?.users?.alternative_mobile_number
      ? (users.alternative_mobile_number =
          onboardingData.alternative_mobile_number)
      : delete userUpdatedInfo?.users?.alternative_mobile_number
    : null;
  onboardingData?.aadhar_no
    ? onboardingData.aadhar_no != userInfo?.users?.aadhar_no
      ? (users.aadhar_no = onboardingData.aadhar_no)
      : delete userUpdatedInfo?.users?.aadhar_no
    : null;
  //step 3 address_details
  onboardingData?.block || onboardingData?.block == ""
    ? onboardingData.block != userInfo?.users?.block
      ? (users.block = onboardingData.block)
      : delete userUpdatedInfo?.users?.block
    : null;
  onboardingData?.district || onboardingData?.district == ""
    ? onboardingData.district != userInfo?.users?.district
      ? (users.district = onboardingData.district)
      : delete userUpdatedInfo?.users?.district
    : null;
  onboardingData?.grampanchayat || onboardingData?.grampanchayat == ""
    ? onboardingData.grampanchayat != userInfo?.users?.grampanchayat
      ? (users.grampanchayat = onboardingData.grampanchayat)
      : delete userUpdatedInfo?.users?.grampanchayat
    : null;
  onboardingData?.pincode || onboardingData?.pincode == ""
    ? onboardingData.pincode != userInfo?.users?.pincode
      ? (users.pincode = onboardingData.pincode)
      : delete userUpdatedInfo?.users?.pincode
    : null;
  onboardingData?.state || onboardingData?.state == ""
    ? onboardingData.state != userInfo?.users?.state
      ? (users.state = onboardingData.state)
      : delete userUpdatedInfo?.users?.state
    : null;
  onboardingData?.village || onboardingData?.village == ""
    ? onboardingData.village != userInfo?.users?.village
      ? (users.village = onboardingData.village)
      : delete userUpdatedInfo?.users?.village
    : null;
  //step 4 personal_details
  onboardingData?.gender || onboardingData?.gender == ""
    ? onboardingData.gender != userInfo?.users?.gender
      ? (users.gender = onboardingData.gender)
      : delete userUpdatedInfo?.users?.gender
    : null;
  onboardingData?.marital_status || onboardingData?.marital_status == ""
    ? onboardingData.marital_status != userInfo?.extended_users?.marital_status
      ? (extended_users.marital_status = onboardingData.marital_status)
      : delete userUpdatedInfo?.extended_users?.marital_status
    : null;
  onboardingData?.social_category || onboardingData?.social_category == ""
    ? onboardingData.social_category !=
      userInfo?.extended_users?.social_category
      ? (extended_users.social_category = onboardingData.social_category)
      : delete userUpdatedInfo?.extended_users?.social_category
    : null;
  //step 5 reference_details
  onboardingData?.contact_number || onboardingData?.contact_number == ""
    ? onboardingData.contact_number != userInfo?.references?.contact_number
      ? (references.contact_number = onboardingData.contact_number)
      : delete userUpdatedInfo?.references?.contact_number
    : null;
  onboardingData?.designation || onboardingData?.designation == ""
    ? onboardingData.designation != userInfo?.references?.designation
      ? (references.designation = onboardingData.designation)
      : delete userUpdatedInfo?.references?.designation
    : null;
  onboardingData?.name || onboardingData?.name == ""
    ? onboardingData.name != userInfo?.references?.name
      ? (references.name = onboardingData.name)
      : delete userUpdatedInfo?.references?.name
    : null;
  //step 6 work_availability_details
  onboardingData?.availability || onboardingData?.availability == ""
    ? onboardingData.availability != userInfo?.program_faciltators?.availability
      ? (program_faciltators.availability = onboardingData.availability)
      : delete userUpdatedInfo?.program_faciltators?.availability
    : null;
  //step 7 work_experience_details vo_experience //step 8 work_experience_details experience
  /* change experience CRUD */
  if (onboardingData?.role_title) {
    if (onboardingData?.status && onboardingData.status == "delete") {
      //delete
      experience.push({
        id: onboardingData?.arr_id ? onboardingData.arr_id : "",
        status: onboardingData?.status,
        unique_key: onboardingData?.unique_key,
        type: onboardingData?.type,
        references: {
          id: onboardingData?.reference?.id ? onboardingData.reference.id : "",
          documents: {
            document_id: onboardingData?.reference?.document_reference?.id,
          },
        },
      });
    } else {
      //edit //insert
      let unique_key = generateUniqueRandomNumber();
      experience.push({
        id: onboardingData?.arr_id ? onboardingData.arr_id : "",
        type: onboardingData?.type,
        role_title: onboardingData?.role_title,
        organization: onboardingData?.organization,
        description: onboardingData?.description,
        experience_in_years: onboardingData?.experience_in_years,
        related_to_teaching: onboardingData?.related_to_teaching,
        references: {
          id: onboardingData?.reference_details?.id
            ? onboardingData.reference_details.id
            : "",
          name: onboardingData?.reference_details?.name,
          contact_number: onboardingData?.reference_details?.contact_number,
          type_of_document: onboardingData?.reference_details?.type_of_document,
          document_id: "",
          documents: {
            base64: onboardingData?.reference_details?.document_id,
            document_id: "",
            name: onboardingData?.reference_details?.document_reference?.name,
            document_sub_type:
              onboardingData?.reference_details?.document_reference
                ?.document_sub_type,
            document_type:
              onboardingData?.reference_details?.document_reference
                ?.document_type,
            provider:
              onboardingData?.reference_details?.document_reference?.provider,
            path: onboardingData?.reference_details?.document_reference?.path,
          },
        },
        status: onboardingData?.status
          ? onboardingData.status
          : onboardingData?.arr_id
          ? "update"
          : "insert",
        unique_key: !onboardingData?.arr_id
          ? onboardingData?.unique_key
            ? onboardingData.unique_key
            : unique_key
          : null,
      });
    }
  }
  //step 9 qualification_details
  onboardingData?.qualification_master_id
    ? onboardingData.qualification_master_id !=
      userInfo?.qualifications?.qualification_master_id
      ? (qualifications.qualification_master_id =
          onboardingData.qualification_master_id)
      : delete userUpdatedInfo?.qualifications?.qualification_master_id
    : null;
  //qualification document
  if (onboardingData?.qualification_reference_document_id) {
    if (
      onboardingData.qualification_reference_document_id !=
      userInfo?.qualifications?.documents?.base64
    ) {
      //doc changed
      qualifications.qualification_reference_document_id = "";
      qualifications.documents = {
        base64: onboardingData?.qualification_reference_document_id,
        context: "",
        context_id: "",
        document_id: "",
        name: "",
        path: "",
        provider: "",
      };
    } else {
      //doc not change or upload already existing
      delete userUpdatedInfo?.qualifications?.documents;
      delete userUpdatedInfo?.qualifications
        ?.qualification_reference_document_id;
    }
  }
  try {
    if (onboardingData?.qualification_ids) {
      let onBoard_qualification_id_arr = null;
      try {
        onBoard_qualification_id_arr = onboardingData?.qualification_ids;
        if (onBoard_qualification_id_arr) {
          onBoard_qualification_id_arr = onBoard_qualification_id_arr.map(
            (str) => parseInt(str)
          );
        }
        onBoard_qualification_id_arr = onBoard_qualification_id_arr.toString();
        onBoard_qualification_id_arr = onBoard_qualification_id_arr
          .split(",")
          .map((numString) => parseInt(numString, 10));
      } catch (e) {
        console.log("qualification array id e", e);
      }
      let userInfo_qualification_id_arr = null;
      try {
        userInfo_qualification_id_arr = JSON.parse(
          userInfo?.program_faciltators?.qualification_ids
        );
        if (userInfo_qualification_id_arr) {
          userInfo_qualification_id_arr = userInfo_qualification_id_arr.map(
            (str) => parseInt(str)
          );
        }
        userInfo_qualification_id_arr =
          userInfo_qualification_id_arr.toString();
        userInfo_qualification_id_arr = userInfo_qualification_id_arr
          .split(",")
          .map((numString) => parseInt(numString, 10));
      } catch (e) {
        console.log("qualification array id e test", e);
      }
      if (
        userInfo_qualification_id_arr &&
        arraysAreEqual(
          onBoard_qualification_id_arr,
          userInfo_qualification_id_arr
        )
      ) {
        delete userUpdatedInfo?.program_faciltators?.qualification_ids;
      } else {
        program_faciltators.qualification_ids = JSON.stringify(
          onboardingData.qualification_ids
        );
      }
      //diploma and its value
      onboardingData?.has_diploma == true ||
      onboardingData?.has_diploma == false
        ? onboardingData.has_diploma != userInfo?.core_faciltators?.has_diploma
          ? (core_faciltators.has_diploma = onboardingData.has_diploma)
          : delete userUpdatedInfo?.core_faciltators?.has_diploma
        : null;
      onboardingData?.has_diploma == true ||
      onboardingData?.has_diploma == false
        ? onboardingData?.has_diploma == true
          ? onboardingData?.diploma_details
            ? onboardingData.diploma_details !=
              userInfo?.core_faciltators?.diploma_details
              ? (core_faciltators.diploma_details =
                  onboardingData.diploma_details)
              : delete userUpdatedInfo?.core_faciltators?.diploma_details
            : null
          : onboardingData?.has_diploma == false
          ? "" != userInfo?.core_faciltators?.diploma_details
            ? (core_faciltators.diploma_details = "")
            : delete userUpdatedInfo?.core_faciltators?.diploma_details
          : null
        : null;
    }
  } catch (e) {
    console.log("error in qualification", e);
  }
  //step 10 profile photo 1
  onboardingData?.profile_photo_1?.base64
    ? onboardingData.profile_photo_1.base64 !=
      userInfo?.users?.profile_photo_1?.documents?.base64
      ? (users.profile_photo_1 = {
          name: onboardingData.profile_photo_1?.name,
          documents: {
            base64: onboardingData.profile_photo_1?.base64,
            document_id: onboardingData.profile_photo_1?.id,
            name: onboardingData.profile_photo_1?.name,
            document_type: onboardingData.profile_photo_1?.document_type,
            document_sub_type:
              onboardingData.profile_photo_1?.document_sub_type,
            path: onboardingData.profile_photo_1?.path,
          },
        })
      : delete userUpdatedInfo?.users?.profile_photo_1
    : null;
  //step 11 profile photo 2
  onboardingData?.profile_photo_2?.base64
    ? onboardingData.profile_photo_2.base64 !=
      userInfo?.users?.profile_photo_2?.documents?.base64
      ? (users.profile_photo_2 = {
          name: onboardingData.profile_photo_2?.name,
          documents: {
            base64: onboardingData.profile_photo_2?.base64,
            document_id: onboardingData.profile_photo_2?.id,
            name: onboardingData.profile_photo_2?.name,
            document_type: onboardingData.profile_photo_2?.document_type,
            document_sub_type:
              onboardingData.profile_photo_2?.document_sub_type,
            path: onboardingData.profile_photo_2?.path,
          },
        })
      : delete userUpdatedInfo?.users?.profile_photo_2
    : null;
  //step 12 profile photo 3
  onboardingData?.profile_photo_3?.base64
    ? onboardingData.profile_photo_3.base64 !=
      userInfo?.users?.profile_photo_3?.documents?.base64
      ? (users.profile_photo_3 = {
          name: onboardingData.profile_photo_3?.name,
          documents: {
            base64: onboardingData.profile_photo_3?.base64,
            document_id: onboardingData.profile_photo_3?.id,
            name: onboardingData.profile_photo_3?.name,
            document_type: onboardingData.profile_photo_3?.document_type,
            document_sub_type:
              onboardingData.profile_photo_3?.document_sub_type,
            path: onboardingData.profile_photo_3?.path,
          },
        })
      : delete userUpdatedInfo?.users?.profile_photo_3
    : null;
  //merge two arrays
  //generate final object
  let temp_update_obj = {
    users: users,
    core_faciltators: core_faciltators,
    extended_users: extended_users,
    references: references,
    program_faciltators: program_faciltators,
    experience: experience,
    qualifications: qualifications,
  };
  //console.log("temp_update_obj", temp_update_obj);
  //update in system
  try {
    let userMergedInfo = await mergeOnlyChanged(
      userUpdatedInfo,
      temp_update_obj
    );
    let userMergedInfo_experience = await mergeExperiences(
      userUpdatedInfo?.experience,
      temp_update_obj?.experience,
      "update"
    );
    userMergedInfo.experience = userMergedInfo_experience;
    //console.log("userMergedInfo", userMergedInfo);
    //set prerak update object
    await setPrerakUpdateInfo(id, userMergedInfo);
  } catch (e) {
    console.log("error", e);
  }
}

export async function SyncOfflineData(id, isOnline) {
  let data = await getUserUpdatedInfo(id);
  const offlinePrerakData = await getUserInfoNull(id);

  // Check if any of the sub-objects or the experience array has data
  const isDataPresent = () => {
    return (
      data &&
      ((data.users && Object.keys(data.users).length > 0) ||
        (data.references && Object.keys(data.references).length > 0) ||
        (data.qualifications && Object.keys(data.qualifications).length > 0) ||
        (data.program_facilitators &&
          Object.keys(data.program_facilitators).length > 0) ||
        (data.extended_users && Object.keys(data.extended_users).length > 0) ||
        (data.core_facilitators &&
          Object.keys(data.core_facilitators).length > 0) ||
        (data.experience && data.experience.length > 0))
    );
  };

  if (isDataPresent() && isOnline && offlinePrerakData) {
    const jsonData = JSON.stringify(data);
    const jsonFile = new File([jsonData], "data.json", {
      type: "application/json",
    });

    const formData = new FormData();
    formData.append("jsonpayload", jsonFile);

    const res = await cohortService.syncOfflinePayload(formData);
    res?.result?.forEach((item) => {
      for (const key in item) {
        if (item[key].status) {
          delete data[key];
        }
      }
    });

    await setPrerakUpdateInfo(id, data);
    let getData = await setPrerakOfflineInfo(id);
    await setIpUserInfo(id);
    const profile_url = getData?.users?.profile_photo_1?.documents?.name;
    const { first_name, middle_name, last_name } = getData?.users ?? {};
    const fullName = `${first_name} ${
      last_name ? `${middle_name} ${last_name}` : ""
    }`;
    localStorage.setItem("profile_url", profile_url);
    localStorage.setItem("fullName", fullName);
    localStorage.setItem("first_name", first_name);
    localStorage.setItem("last_name", last_name);
  }
}
