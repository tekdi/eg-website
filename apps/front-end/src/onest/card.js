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
  },

  // jobs: {
  //   title: "Jobs",
  //   searchByKey: "title",
  //   listLink: "onest/jobs",
  //   apiLink: "https://jobs-api.tekdinext.com/jobs/search",
  //   filters: [
  //     "city",
  //     "state",
  //     "qualification",
  //     "experience",
  //     "gender",
  //     "company",
  //   ],
  //   apiLink_DB_CACHE: "jobs_cache_dev",
  //   apiLink_RESPONSE_DB: "response_cache_dev",
  //   apiLink_DOMAIN: "onest:work-opportunities",
  //   apiLink_BAP_ID: "jobs-bap-dev.tekdinext.com",
  //   apiLink_BAP_URI: "https://jobs-bap-dev.tekdinext.com/",
  //   apiLink_API_BASE_URL: "https://jobs-api-dev.tekdinext.com",
  //   apiLink_SUNBIRD_API: "https://sunbirdsaas.com/api/content/v1/read",
  //   apiLink_DIKSHA_API: "https://diksha.gov.in/api/content/v1/read",
  //   apiLink_IMAGE_URL: "https://kvk-nashik.tekdinext.com",
  //   imageUrl: "",
  //   apiResponce: (e) => e.data.data.jobs_cache,
  //   // render: (e) => {
  //   //   console.log(e);
  //   //   return (
  //   //     <div>
  //   //       <h1>{e.title} </h1>
  //   //       <h2>{e.company}</h2>
  //   //     </div>
  //   //   );
  //   // },
  // },
  // learning: {
  //   title: "Learning experiences",
  //   searchByKey: "title",
  //   listLink: "onest/learning",
  //   detailLink: "/learning/:id",
  //   apiLink: "https://kahani-api.tekdinext.com/content/search",
  //   imageUrl: "",
  //   apiLink_DB_CACHE: "kahani_cache",
  //   apiLink_API_ROUTE: "content",
  //   apiLink_DOMAIN: "onest:learning-experiences",
  //   apiLink_BAP_ID: "13.201.4.186:6002",
  //   apiLink_BAP_URI: "http://13.201.4.186:6002/",
  //   apiLink_API_BASE_URL: "https://kahani-api.tekdinext.com",
  //   apiResponce: (e) => e.data.data.kahani_cache,
  //   // apiResponce: ({ data }) => {
  //   //   let response = [];
  //   //   //   response = data?.message?.catalog?.providers?.flatMap((e) => e.items);
  //   //   return data.data;
  //   // },
  //   render: (e) => {
  //     return "";
  //   },
  //   payload: {
  //     context: {
  //       domain: "onest:learning-experiences",
  //       action: "search",
  //       version: "1.1.0",
  //       bap_id: "13.201.4.186:6002",
  //       bap_uri: "http://13.201.4.186:6002/",
  //       location: {
  //         country: {
  //           name: "India",
  //           code: "IND",
  //         },
  //         city: {
  //           name: "Bangalore",
  //           code: "std:080",
  //         },
  //       },
  //       transaction_id: "a9aaecca-10b7-4d19-b640-b047a7c60008",
  //       message_id: "a9aaecca-10b7-4d19-b640-b047a7c60009",
  //       timestamp: "2023-02-06T09:55:41.161Z",
  //     },
  //     message: {
  //       intent: {
  //         item: {
  //           descriptor: {
  //             name: "",
  //           },
  //         },
  //       },
  //     },
  //   },
  // },
};
