import {
  getUserInfo,
  getUserUpdatedInfo,
  getOnlyChanged,
  mergeOnlyChanged,
  setPrerakUpdateInfo,
} from "../SyncHelper/SyncHelper";

export async function getOnboardingData(id) {
  try {
    let userInfo = await getUserInfo(id);
    let userUpdatedInfo = await getUserUpdatedInfo(id);
    let userMergedInfo = await mergeOnlyChanged(userInfo, userUpdatedInfo);
    /*console.log(userInfo);
    console.log(userUpdatedInfo);
    console.log("userMergedInfo", userMergedInfo);*/
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
      let experience_obj = userMergedInfo?.experience;
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
              document_id: experience_obj[i]?.references?.document_id,
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
      first_name: userMergedInfo?.users?.first_name,
      last_name: userMergedInfo?.users?.last_name,
      middle_name: userMergedInfo?.users?.middle_name,
      dob: userMergedInfo?.users?.dob,
      //step 2 contact_details
      mobile: userMergedInfo?.users?.mobile,
      email_id: userMergedInfo?.users?.email_id,
      device_type: userMergedInfo?.core_faciltator?.device_type,
      device_ownership: userMergedInfo?.core_faciltator?.device_ownership,
      alternative_mobile_number:
        userMergedInfo?.users?.alternative_mobile_number,
      //step 3 address_details
      block: userMergedInfo?.users?.block,
      district: userMergedInfo?.users?.district,
      grampanchayat: userMergedInfo?.users?.grampanchayat,
      pincode: userMergedInfo?.users?.pincode,
      state: userMergedInfo?.users?.state,
      village: userMergedInfo?.users?.village,
      //step 4 personal_details
      gender: userMergedInfo?.users?.gender,
      marital_status: userMergedInfo?.extended_users?.marital_status,
      social_category: userMergedInfo?.extended_users?.social_category,
      //step 5 reference_details
      references: {
        contact_number: userMergedInfo?.references?.contact_number,
        designation: userMergedInfo?.references?.designation,
        name: userMergedInfo?.references?.name,
      },
      //step 6 work_availability_details
      program_faciltators: {
        availability: userMergedInfo?.program_faciltators?.availability,
        status: userMergedInfo?.program_faciltators?.status,
        //step 9 qualification_details
        qualification_ids: qualification_id_arr,
      },
      availability: userMergedInfo?.program_faciltators?.availability,
      //step 7 work_experience_details vo_experience
      vo_experience: vo_experience,
      //step 8 work_experience_details experience
      experience: experience,
      //step 9 qualification_details
      qualifications: {
        qualification_master_id:
          userMergedInfo?.qualifications?.qualification_master_id,
        qualification_reference_document_id:
          userMergedInfo?.qualifications?.qualification_reference_document_id,
        qualification_master:
          userMergedInfo?.qualifications?.qualification_master,
      },
      qualification_ids: qualification_id_arr,
      core_faciltator: {
        has_diploma: userMergedInfo?.core_faciltator?.has_diploma
          ? userMergedInfo?.core_faciltator?.has_diploma
          : false,
        diploma_details: userMergedInfo?.core_faciltator?.diploma_details,
      },
      //step 10 profile photo 1
      //step 11 profile photo 2
      //step 12 profile photo 3
      //Aadhaar_Details
      aadhaar_verification_mode:
        userMergedInfo?.users?.aadhaar_verification_mode,
      aadhar_no: userMergedInfo?.users?.aadhar_no,
      aadhar_token: userMergedInfo?.users?.aadhar_token,
      aadhar_verified: userMergedInfo?.users?.aadhar_verified,
    };

    return format_result;
  } catch (error) {
    console.log(error);
    return {};
  }
}

export async function updateOnboardingData(id, onboardingData) {
  let users = new Object();
  let core_faciltator = new Object();
  let extended_users = new Object();
  let references = new Object();
  let program_faciltators = new Object();
  let experience = [];
  let qualifications = new Object();
  console.log("onboardingData", onboardingData);
  //step 1 basic_details
  onboardingData?.first_name
    ? (users.first_name = onboardingData.first_name)
    : null;
  onboardingData?.last_name
    ? (users.last_name = onboardingData.last_name)
    : null;
  onboardingData?.middle_name
    ? (users.middle_name = onboardingData.middle_name)
    : null;
  onboardingData?.dob ? (users.dob = onboardingData.dob) : null;
  //step 2 contact_details
  onboardingData?.mobile ? (users.mobile = onboardingData.mobile) : null;
  onboardingData?.email_id ? (users.email_id = onboardingData.email_id) : null;
  onboardingData?.device_type
    ? (core_faciltator.device_type = onboardingData.device_type)
    : null;
  onboardingData?.device_ownership
    ? (core_faciltator.device_ownership = onboardingData.device_ownership)
    : null;
  onboardingData?.alternative_mobile_number
    ? (users.alternative_mobile_number =
        onboardingData.alternative_mobile_number)
    : null;
  onboardingData?.alternative_mobile_number
    ? (users.alternative_mobile_number =
        onboardingData.alternative_mobile_number)
    : null;
  //step 3 address_details
  onboardingData?.block ? (users.block = onboardingData.block) : null;
  onboardingData?.district ? (users.district = onboardingData.district) : null;
  onboardingData?.grampanchayat
    ? (users.grampanchayat = onboardingData.grampanchayat)
    : null;
  onboardingData?.pincode ? (users.pincode = onboardingData.pincode) : null;
  onboardingData?.state ? (users.state = onboardingData.state) : null;
  onboardingData?.village ? (users.village = onboardingData.village) : null;
  //step 4 personal_details
  onboardingData?.gender ? (users.gender = onboardingData.gender) : null;
  onboardingData?.marital_status
    ? (extended_users.marital_status = onboardingData.marital_status)
    : null;
  onboardingData?.social_category
    ? (extended_users.social_category = onboardingData.social_category)
    : null;
  //step 5 reference_details
  onboardingData?.contact_number
    ? (references.contact_number = onboardingData.contact_number)
    : null;
  onboardingData?.designation
    ? (references.designation = onboardingData.designation)
    : null;
  onboardingData?.name ? (references.name = onboardingData.name) : null;
  //step 6 work_availability_details
  onboardingData?.availability
    ? (program_faciltators.availability = onboardingData.availability)
    : null;
  //step 7 work_experience_details vo_experience //step 8 work_experience_details experience
  onboardingData?.role_title
    ? experience.push({
        id: null,
        type: onboardingData?.type,
        role_title: onboardingData?.role_title,
        organization: onboardingData?.organization,
        description: onboardingData?.description,
        experience_in_years: onboardingData?.experience_in_years,
        related_to_teaching: onboardingData?.related_to_teaching,
        references: {
          id: null,
          name: onboardingData?.reference_details?.name,
          contact_number: onboardingData?.reference_details?.contact_number,
          type_of_document: onboardingData?.reference_details?.type_of_document,
        },
      })
    : null;
  //step 9 qualification_details
  onboardingData?.qualification_master_id
    ? (qualifications.qualification_master_id =
        onboardingData.qualification_master_id)
    : null;
  onboardingData?.qualification_reference_document_id
    ? (qualifications.qualification_reference_document_id =
        onboardingData.qualification_reference_document_id)
    : null;
  onboardingData?.qualification_ids
    ? (program_faciltators.qualification_ids = JSON.stringify(
        onboardingData.qualification_ids
      ))
    : null;
  onboardingData?.has_diploma
    ? (core_faciltator.has_diploma = onboardingData.has_diploma)
    : (core_faciltator.has_diploma = false);
  onboardingData?.has_diploma
    ? onboardingData?.diploma_details
      ? (core_faciltator.diploma_details = onboardingData.diploma_details)
      : null
    : (core_faciltator.diploma_details = "");
  //step 10 profile photo 1
  //step 11 profile photo 2
  //step 12 profile photo 3
  //merge two arrays
  let userUpdatedInfo = await getUserUpdatedInfo(id);
  console.log("userUpdatedInfo", userUpdatedInfo);
  //generate final object
  let temp_update_obj = {
    users: users,
    core_faciltator: core_faciltator,
    extended_users: extended_users,
    references: references,
    program_faciltators: program_faciltators,
    experience: experience,
    qualifications: qualifications,
  };
  console.log("temp_update_obj", temp_update_obj);
  let userMergedInfo = await mergeOnlyChanged(userUpdatedInfo, temp_update_obj);
  console.log("userMergedInfo", userMergedInfo);

  //set prerak update object
  await setPrerakUpdateInfo(id, userMergedInfo);
}
