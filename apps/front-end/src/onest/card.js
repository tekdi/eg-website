import { OnestService } from "@shiksha/common-lib";

export const dataConfig = {
  scholarship: {
    title: "Scholarship",
    searchByKey: "title",
    listLink: "onest/scholarship",
    filters: ["provider_name"],
    apiLink_DB_CACHE: "scholarship_cache",
    apiLink_RESPONSE_DB: "response_cache_dev",
    apiLink_DOMAIN: "onest:financial-support",
    apiLink_BAP_ID: "eg-scholarship-dev-bap-network.tekdinext.com",
    apiLink_BAP_URI: "https://eg-scholarship-dev-bap-network.tekdinext.com/",
    apiLink_API_BASE_URL: "https://eg-scholarship-dev-api.tekdinext.com",
    imageUrl: "",
    apiResponce: (e) => e.data.data.scholarship_cache,
    onOrderIdGenerate: async (val) => {
      const data = {
        user_id: val.userData.user_id,
        context: val.type,
        context_item_id: val.jobId,
        status: "created",
        order_id:
          val.response.data.data.insert_scholarship_order_dev.returning[0]
            .order_id,
      };
      let response = await OnestService.create(data);
    },
    expiryLimit: 180, //seconds
  },

  jobs: {
    title: "Jobs",
    searchByKey: "title",
    listLink: "onest/jobs",
    //apiLink: "https://eg-jobs-dev-api.tekdinext.com",
    filters: [
      "city",
      "state",
      "qualification",
      "experience",
      "gender",
      "company",
    ],
    apiLink_DB_CACHE: "jobs_cache_dev",
    apiLink_RESPONSE_DB: "response_cache_dev",
    apiLink_DOMAIN: "onest:work-opportunities",
    apiLink_BAP_ID: "jobs-bap-dev.tekdinext.com",
    apiLink_BAP_URI: "https://jobs-bap-dev.tekdinext.com/",
    apiLink_API_BASE_URL: "https://eg-jobs-dev-api.tekdinext.com",
    apiLink_API_LIST_URL: "https://eg-jobs-dev-api.tekdinext.com/jobs/search",
    apiLink_SUNBIRD_API: "https://sunbirdsaas.com/api/content/v1/read",
    apiLink_DIKSHA_API: "https://diksha.gov.in/api/content/v1/read",
    apiLink_IMAGE_URL: "https://kvk-nashik.tekdinext.com",
    imageUrl: "",
    apiResponce: (e) => e.data.data.jobs_cache_dev,
    // render: (e) => {
    //   console.log(e);
    //   return (
    //     <div>
    //       <h1>{e.title} </h1>
    //       <h2>{e.company}</h2>
    //     </div>
    //   );
    // },
  },
  learning: {
    title: "Learning experiences",
    searchByKey: "title",
    listLink: "onest/learning",
    detailLink: "/learning/:id",
    apiLink_DB_CACHE: "kahani_cache_dev",
    apiLink_API_ROUTE: "content",
    apiLink_DOMAIN: "onest:learning-experiences",
    apiLink_BAP_ID: "eg-content-dev-bap-network.tekdinext.com",
    apiLink_BAP_URI: "https://eg-content-dev-bap-network.tekdinext.com/",
    // apiLink_API_BASE_URL: "https://kahani-api.tekdinext.com",
    apiLink_API_BASE_URL: "https://eg-content-dev-api.tekdinext.com",
    apiResponce: (e) => e.data.data.kahani_cache_dev,
    getTrackData: async (e) => {
      const data = {
        context: e?.type || "",
        context_item_id: e?.itemId,
        user_id: e?.user_id,
      };
      let result = await OnestService.getList({ filter: data });
      return result?.data?.[0];
    },
    onOrderIdGenerate: async (val) => {
      const paramData = { url: "", type: "" };
      paramData.url =
        val.response.responses[0].message.order.items[0][
          "add-ons"
        ][0].descriptor.media[0].url;
      const list =
        val.response.responses[0].message.order.items[0].tags[0].descriptor
          .list;
      list.forEach((item) => {
        // Check if the descriptor code is "urlType"
        if (item.descriptor.code === "urlType") {
          // If found, extract the value associated with it
          paramData.type = item.value;
        }
      });
      const data = {
        user_id: val.userData.user_id,
        context: val.type,
        context_item_id: val.itemId,
        status: "created",
        order_id: val.response.responses[0].message.order.id,
        params: paramData,
      };
      await OnestService.create(data);
    },
  },
};
