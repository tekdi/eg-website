import { OnestService } from "@shiksha/common-lib";

export const dataConfig = {
  scholarship: {
    title: "SCHOLARSHIP",
    searchByKey: "title",
    listLink: "onest/scholarship",
    filters: ["provider_name"],
    apiLink_DB_CACHE: "scholarship_cache",
    apiLink_RESPONSE_DB: "response_cache_dev",
    apiLink_DOMAIN: "onest:financial-support",
    apiLink_BAP_ID: process.env.REACT_APP_SCHOLARSHIPS_BAP_ID,
    apiLink_BAP_URI: process.env.REACT_APP_SCHOLARSHIPS_BAP_URI,
    apiLink_API_BASE_URL: process.env.REACT_APP_SCHOLARSHIPS_BASE_URL,
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
    title: "JOBS",
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
    apiLink_BAP_ID: process.env.REACT_APP_JOBS_BAP_ID,
    apiLink_BAP_URI: process.env.REACT_APP_JOBS_BAP_URI,
    apiLink_API_BASE_URL: process.env.REACT_APP_JOBS_BASE_URL,
    apiLink_API_LIST_URL: `${process.env.REACT_APP_JOBS_BASE_URL}/jobs/search`,
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
    title: "LEARNING_EXPERIENCES",
    searchByKey: "title",
    listLink: "onest/learning",
    detailLink: "/learning/:id",
    apiLink_DB_CACHE: "kahani_cache_dev",
    apiLink_API_ROUTE: "content",
    apiLink_DOMAIN: "onest:learning-experiences",
    apiLink_BAP_ID: process.env.REACT_APP_LEARNINGS_BAP_ID,
    apiLink_BAP_URI: process.env.REACT_APP_LEARNINGS_BAP_URI,
    // apiLink_API_BASE_URL: "https://kahani-api.tekdinext.com",
    apiLink_API_BASE_URL: process.env.REACT_APP_LEARNINGS_BASE_URL,
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
