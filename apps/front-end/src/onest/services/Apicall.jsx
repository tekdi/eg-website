// import { get, post, update as coreUpdate, patch, distory } from "./index";
import { get, patch, post } from "@shiksha/common-lib";
import apiPath from "./ApiUrl.json";
import config from "./config.json";

const baseUrl = "import.meta.env.VITE_API_BASE_URL";
const env = "import.meta.env";

const searchUrl = "import.meta.env.VITE_BASE_URL";
const sunbird = "import.meta.env.VITE_SUNBIRD_API";
const diksha = "import.meta.env.VITE_DIKSHA_API";
const imageurl = "import.meta.env.VITE_IMAGE_URL";

let configDatas = localStorage.getItem("config");
let localData = JSON.parse(configDatas);

let data = config;

export const fetchToken = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    "Content-Type": "application/json",
  };
  try {
    const result = await post(`${apiUrl}/auth/`, params, { headers });
    if (result?.data) {
      return result?.data;
    } else {
      return {};
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const getAuthUser = async ({ ...params } = {}, header = {}) => {
  let headers = {
    Authorization: "Bearer " + localStorage.getItem("token"),
    ...header,
  };

  const result = await get(
    `${apiUrl}/auth/realms/hasura/protocol/openid-connect/userinfo`,
    {
      params,
      headers,
    }
  ).catch((error) => error);

  if (result.data) {
    return result.data;
  } else {
    return {};
  }
};

export const getTekdiallContent = async (header = {}) => {
  let headers = {
    ...header,
  };
  let bodyData = {
    context: {
      domain: "onest:learning-experiences",
      action: "search",
      version: "1.1.0",
      bap_id: "tekdi.onest-dev.bap",
      bap_uri: "http://65.1.248.164:6002/",
      location: {
        country: {
          name: "India",
          code: "IND",
        },
        city: {
          name: "Bangalore",
          code: "std:080",
        },
      },
      transaction_id: "a9aaecca-10b7-4d19-b640-b047a7c60008",
      message_id: "a9aaecca-10b7-4d19-b640-b047a7c60009",
      timestamp: new Date().toISOString(),
    },
    message: {
      intent: {
        item: {
          descriptor: {
            name: "",
          },
        },
      },
    },
  };

  try {
    if (data?.apiEndPoint === "/search") {
      // this is  api for Onest search
      const result = await post(`${searchUrl}${data?.apiEndPoint}`, bodyData, {
        headers,
      });
      if (result.data) {
        return result.data;
      } else {
        return {};
      }
    } else if (data?.apiEndPoint === `${env?.VITE_API_ROUTE}/search`) {
      // this is  api for Tekdi search
      const result = await post(
        `/${baseUrl}/${env?.VITE_API_ROUTE}/search`,
        bodyData,
        {
          headers,
        }
      );
      if (result.data) {
        return result.data;
      } else {
        return {};
      }
    } else {
      const result = await post(
        `${baseUrl}/${env?.VITE_API_ROUTE}/search`,
        bodyData,
        {
          // Default tekdi search
          headers,
        }
      );
      if (result.data) {
        return result.data;
      } else {
        return {};
      }
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const getAllCollections = async (params = {}, header = {}) => {
  let headers = {
    ...header,
  };

  try {
    const result = await get(`${baseUrl}/${collection}`, {
      headers,
    });

    if (result?.data) {
      return result?.data?.data?.collection;
    } else {
      return [];
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const getallContent = async (params = {}, header = {}) => {
  let headers = {
    ...header,
  };

  try {
    const result = await post(
      `${baseUrl}/${env?.VITE_API_ROUTE}/${apiPath.search}`
    );
    if (result.data) {
      return result.data;
    } else {
      return {};
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const getseletedData = async (params = {}, header = {}) => {
  let headers = {
    ...header,
  };

  try {
    const result = await post(`${baseUrl}/${apiPath?.select}`, params, {
      headers,
    });
    if (result) {
      return result.data;
    } else {
      return {};
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const getconfirmdata = async (params = {}, header = {}) => {
  let headers = {
    ...header,
  };

  try {
    const result = await post(`${baseUrl}/${apiPath?.confirm}`, params, {
      headers,
    });
    if (result) {
      return result?.data;
    } else {
      return {};
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const getInitdata = async (params = {}, header = {}) => {
  let headers = {
    ...header,
  };

  try {
    const result = await post(`${baseUrl}/${apiPath?.init}`, params, {
      headers,
    });
    if (result) {
      return result?.data;
    } else {
      return {};
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const getContentbyCollectionId = async (
  id,
  params = {},
  header = {}
) => {
  let headers = {
    ...header,
  };

  try {
    const result = await get(`${baseUrl}/${apiPath?.collection}/${id}`, {
      headers,
    });
    if (result?.data) {
      return result?.data?.data?.collection[0];
    } else {
      return [];
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const userLogin = async (params = {}, header = {}) => {
  let headers = {
    ...header,
  };
  try {
    const result = await post(`${baseUrl}/auth/login`, params, {
      headers,
    });
    if (result?.data) {
      return result?.data;
    } else {
      return {};
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const registerUser = async (params = {}, header = {}) => {
  let headers = {
    ...header,
  };
  try {
    const result = await post(`${baseUrl}/auth/registerUser`, params, {
      headers,
    });
    if (result?.data) {
      return result?.data;
    } else {
      return {};
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const createBookmarks = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
  try {
    const result = await post(`${baseUrl}/${apiPath?.bookmark}`, params, {
      headers,
    });
    if (result?.data) {
      return result?.data;
    } else {
      return {};
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const addContentToBookmarks = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
  try {
    const result = await post(`${baseUrl}/seeker/contentBookmark`, params, {
      headers,
    });
    if (result?.data) {
      return result?.data;
    } else {
      return {};
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const getAllBookMarks = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: "Bearer " + localStorage.getItem("token"),
  };

  try {
    const result = await get(`${baseUrl}/${apiPath?.bookmark}`, {
      headers,
    });

    if (result?.data) {
      return result?.data?.data?.bookmark;
    } else {
      return [];
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const getBookmarksbyId = async (id, params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: "Bearer " + localStorage.getItem("token"),
  };

  try {
    const result = await get(`${baseUrl}/${apiPath?.bookmark}/${id}`, {
      headers,
    });

    if (result?.data) {
      return result?.data?.data?.bookmark[0]?.bookmarkContentRelation;
    } else {
      return [];
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const removeFrombookmark = async (id, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: "Bearer " + localStorage.getItem("token"),
    };
    const result = await distory(
      `${baseUrl}/seeker/contentBookmark/${id}`,
      {},
      {
        headers: headers ? headers : {},
      }
    );

    if (result?.data) {
      return result?.data;
    } else {
      return {};
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const removebookmarkFromList = async (id, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: "Bearer " + localStorage.getItem("token"),
    };
    const result = await distory(
      `${baseUrl}/${apiPath?.bookmark}/${id}`,
      {},
      {
        headers: headers ? headers : {},
      }
    );

    if (result?.data) {
      return result?.data?.data;
    } else {
      return {};
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const getImageUrl = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: "Bearer " + localStorage.getItem("token"),
  };

  try {
    const result = await get(`${imageurl}/provider/getImageUrl/${params}`, {
      headers,
    });

    if (result?.data) {
      return result?.data;
    } else {
      return [];
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const resetPassword = async (params = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: "Bearer " + localStorage.getItem("token"),
    };
    const result = await patch(`${baseUrl}/seeker/resetPassword`, params, {
      headers,
    });
    if (result?.data) {
      return result?.data;
    } else {
      return [];
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const uploadImage = async (params = {}, header = {}) => {
  let headers = {
    "Content-Type": "multipart/form-data",
    ...header,
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
  try {
    const result = await post(`${baseUrl}/provider/uploadImage`, params, {
      headers,
    });
    if (result?.data) {
      return result?.data;
    } else {
      return {};
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

// export const getConfiguration = async (params = {}, header = {}) => {
//   let headers = {
//     ...header,
//     Authorization: "Bearer " + localStorage.getItem("token"),
//   };

//   try {
//     const result = await get(`${baseUrl}/seeker/configuration`, {
//       headers,
//     });

//     if (result?.data) {
//       return result?.data?.data?.Seeker[0];
//     } else {
//       return [];
//     }
//   } catch ({ response, message }) {
//     return {
//       status: response?.status ? response?.status : 404,
//       error: response?.data?.message ? response?.data?.message : message,
//     };
//   }
// };

export const getSunbirdContent = async (id, header = {}) => {
  let headers = {
    ...header,
  };

  try {
    const result = await get(`${sunbird}/${id}`, {
      headers,
    });

    if (result?.data) {
      return result?.data?.result?.content;
    } else {
      return [];
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const getdikshaContent = async (id, header = {}) => {
  let headers = {
    ...header,
  };

  try {
    const result = await get(`${diksha}/${id}`, {
      headers,
    });

    if (result?.data) {
      return result?.data?.result?.content;
    } else {
      return [];
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const getDikshaContentWithBody = async (id, header = {}) => {
  let headers = {
    ...header,
  };
  try {
    const result = await get(
      `${diksha}/${id}?fields=transcripts,ageGroup,appIcon,artifactUrl,attributions,attributions,audience,author,badgeAssertions,board,body,channel,code,concepts,contentCredits,contentType,contributors,copyright,copyrightYear,createdBy,createdOn,creator,creators,description,displayScore,domain,editorState,flagReasons,flaggedBy,flags,framework,gradeLevel,identifier,itemSetPreviewUrl,keywords,language,languageCode,lastUpdatedOn,license,mediaType,medium,mimeType,name,originData,osId,owner,pkgVersion,publisher,questions,resourceType,scoreDisplayConfig,status,streamingUrl,subject,template,templateId,totalQuestions,totalScore,versionKey,visibility,year,primaryCategory,additionalCategories,interceptionPoints,interceptionType&orgdetails=orgName,email&licenseDetails=name,description,url`,
      {
        headers,
      }
    );

    if (result?.data) {
      return result?.data?.result?.content;
    } else {
      return [];
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const getShikshaWithBody = async (id, header = {}) => {
  let headers = {
    ...header,
  };
  try {
    const result = await get(
      `${sunbird}/${id}?fields=transcripts,ageGroup,appIcon,artifactUrl,attributions,attributions,audience,author,badgeAssertions,board,body,channel,code,concepts,contentCredits,contentType,contributors,copyright,copyrightYear,createdBy,createdOn,creator,creators,description,displayScore,domain,editorState,flagReasons,flaggedBy,flags,framework,gradeLevel,identifier,itemSetPreviewUrl,keywords,language,languageCode,lastUpdatedOn,license,mediaType,medium,mimeType,name,originData,osId,owner,pkgVersion,publisher,questions,resourceType,scoreDisplayConfig,status,streamingUrl,subject,template,templateId,totalQuestions,totalScore,versionKey,visibility,year,primaryCategory,additionalCategories,interceptionPoints,interceptionType&orgdetails=orgName,email&licenseDetails=name,description,url`,
      {
        headers,
      }
    );

    if (result?.data) {
      return result?.data?.result?.content;
    } else {
      return [];
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const registerTelementry = async (siteUrl, transactionId) => {
  let telementryJson = {
    id: "onest.telemetry",
    ver: "1",
    events: [
      {
        eid: "IMPRESSION",
        transId: "",
        ets: 0,
        actor: {
          type: "user",
          id: "",
          agent: "",
          distributor: "",
        },
        context: {
          channel: "",
        },
        edata: {
          pageurl: "",
        },
      },
    ],
  };

  localStorage.setItem("transactionId", transactionId);
  const url = new URL(siteUrl);
  telementryJson.events[0].ets = Date.now();
  telementryJson.events[0].transId = transactionId;
  telementryJson.events[0].actor.id = url.searchParams.get("agent-id") || "";

  telementryJson.events[0].actor.agent = url.searchParams.get("agent")
    ? url.searchParams.get("agent")
    : "";
  telementryJson.events[0].actor.distributor = url.searchParams.get(
    "distributor-name"
  )
    ? url.searchParams.get("distributor-name")
    : "";
  telementryJson.events[0].context.channel = url.hostname.split(".")[0];
  telementryJson.events[0].edata.pageurl = siteUrl;

  console.log(telementryJson);
  try {
    const response = post(`${baseUrl}/content/telemetry`, telementryJson, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
  } catch (error) {
    console.error("Error:", error);
  }
};
