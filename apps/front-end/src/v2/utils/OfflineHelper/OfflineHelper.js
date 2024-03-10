import {
  getUserInfo,
  getUserUpdatedInfo,
  getOnlyChanged,
  mergeOnlyChanged,
} from "../SyncHelper/SyncHelper";

export async function getOnboardingData(id) {
  try {
    let userInfo = await getUserInfo(id);
    let userUpdatedInfo = await getUserUpdatedInfo(id);
    let userMergedInfo = await mergeOnlyChanged(userInfo, userUpdatedInfo);
    /*console.log(userInfo);
    console.log(userUpdatedInfo);
    console.log(userMergedInfo);*/
    //set onboard format
    let format_result = {
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
      },
      availability: userMergedInfo?.program_faciltators?.availability,
      //step 7
      //step 8
      //step 9 qualification_details

      
        "qualification_master_id": "5",
        "qualification_reference_document_id": "",
        "qualification_ids": [
            "16",
            "12"
        ],
        "has_diploma": true,
        "diploma_details": "test diploma",
        "page_type": "qualification_details"
    
    };

    return format_result;
  } catch (error) {
    console.log(error);
    return {};
  }
}

export async function updateOnboardingData(id) {}
