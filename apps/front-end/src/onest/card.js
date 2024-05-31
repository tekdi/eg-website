import { IconByName, OnestService } from "@shiksha/common-lib";
import jobs from "./assets/images/onest-jobs.png";
import scholarships from "./assets/images/onest-scholarships.png";
import learnings from "./assets/images/onest-learnings.png";
import { HStack, Image, Text, VStack } from "native-base";
import moment from "moment";

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
    imageUrl: scholarships,
    apiResponce: (e) => e.data.data.scholarship_cache,
    render: (obj) => {
      const getDates = (range) => {
        return `${moment(range.start).format("DD MMM YYYY")} to ${moment(
          range.end
        ).format("DD MMM YYYY")}`;
      };
      const getMinEligibilityValue = (data) => {
        // Find the object with descriptor.code === "academic-eligibility"
        const academicEligibility = data.find(
          (item) => item.descriptor.code === "academic-eligibility"
        );
        // If the object is found, proceed to map the "list" array
        if (academicEligibility) {
          // Find the value where descriptor.code === "min-eligibility"
          const minEligibility = academicEligibility.list.find(
            (listItem) => listItem.descriptor.code === "min-eligibility"
          );
          // Return the value if found, otherwise return an empty string
          return minEligibility ? minEligibility.value : "";
        }

        return "-";
      };
      return (
        <VStack space={4}>
          {obj?.image_url && (
            <Image
              alignSelf={"center"}
              source={{ uri: obj?.image_url }}
              size={"lg"}
              src={obj?.image_url}
              alt={"no IMAGE"}
            />
          )}
          <Text fontSize={"16px"} fontWeight={600}>
            {obj?.title}
          </Text>
          <HStack alignItems={"center"} space={4}>
            <IconByName color="gray.700" name="" />
            <Text color="gray.700" fontWeight={500} fontSize={["sm", "md"]}>
              {obj?.provider_name}
            </Text>
          </HStack>
          <HStack space={4}>
            <IconByName color="gray.700" name="SuitcaseFillIcon" />
            <Text color="gray.700" fontWeight={500} fontSize={["sm", "md"]}>
              {getMinEligibilityValue(obj.item.tags)}
            </Text>
          </HStack>
          <HStack alignItems={"center"} space={4}>
            <IconByName color="gray.700" name="CalendarEventLineIcon" />
            <Text color="gray.700" fontWeight={500} fontSize={["sm", "md"]}>
              {getDates(obj.item.time.range)}
            </Text>
          </HStack>
          <HStack space={4}>
            <Text fontSize={"2xl"} paddingLeft={2}>
              ₹
            </Text>
            <Text color="gray.700" fontWeight={500} fontSize={["sm", "md"]}>
              {obj.item?.price?.value ? obj.item.price.value : "-"}
            </Text>
          </HStack>
        </VStack>
      );
    },
    onOrderIdGenerate: async (val) => {
      const data = {
        user_id: val.userData.user_id,
        context: val.type,
        context_item_id: val.jobId,
        status: "created",
        order_id:
          val.response.data.data[
            process.env.REACT_APP_SCHOLARSHIPS_INSERT_ORDER
          ].returning[0].order_id,
        provider_name: val?.item?.provider_name || "",
        item_name: val?.item?.title || "",
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
    imageUrl: jobs,
    apiResponce: (e) => e.data.data.jobs_cache_dev,
    render: (obj) => {
      const getSalary = (val1, val2) => {
        const invalidValues = ["0", "undefined"];
        if (invalidValues.includes(val1) || invalidValues.includes(val2)) {
          return "As per Industry Standards";
        }
        return `${val1} - ${val2}`;
      };
      return (
        <VStack space={4}>
          {obj?.image_url && (
            <Image
              alignSelf={"center"}
              source={{ uri: obj?.image_url }}
              size={"lg"}
              src={obj?.image_url}
              alt={"no IMAGE"}
            />
          )}
          <Text fontSize={"16px"} fontWeight={600}>
            {obj?.title}
          </Text>
          <HStack alignItems={"center"} space={4}>
            <IconByName color="gray.700" name="" />
            <Text color="gray.700" fontWeight={500} fontSize={["sm", "md"]}>
              {obj?.item?.creator?.descriptor?.name}
            </Text>
          </HStack>
          <HStack alignItems={"center"} space={4}>
            <IconByName color="gray.700" name="MapPin2FillIcon" />
            <Text color="gray.700" fontWeight={500} fontSize={["sm", "md"]}>
              {`${obj.city}, ${obj.state}`}
            </Text>
          </HStack>
          <HStack alignItems={"center"} space={4}>
            <IconByName color="gray.700" name="SuitcaseFillIcon" />
            <Text color="gray.700" fontWeight={500} fontSize={["sm", "md"]}>
              {obj.fulfillments ? obj.fulfillments : "-"}
            </Text>
          </HStack>
          <HStack alignItems={"center"} space={4}>
            <Text fontSize={"2xl"} paddingLeft={2}>
              ₹
            </Text>
            <Text color="gray.700" fontWeight={500} fontSize={["sm", "md"]}>
              {getSalary(
                obj.item.tags[2].list[0].value,
                obj.item.tags[2].list[1].value
              )}
            </Text>
          </HStack>
        </VStack>
      );
    },
    onOrderIdGenerate: async (val) => {
      const data = {
        user_id: val.userData.user_id,
        context: val.type,
        context_item_id: val.jobId,
        status: "created",
        order_id:
          val.response.data.data.insert_jobs_order_dev.returning[0].order_id,
        provider_name: val?.item?.provider_name || "",
        item_name: val?.item?.title || "",
      };
      await OnestService.create(data);
    },
  },
  learning: {
    title: "LEARNING_EXPERIENCES",
    searchByKey: "title",
    listLink: "onest/learning",
    filters: ["provider_name"],
    detailLink: "/learning/:id",
    apiLink_DB_CACHE: "kahani_cache_dev",
    apiLink_API_ROUTE: "content",
    apiLink_DOMAIN: "onest:learning-experiences",
    apiLink_BAP_ID: process.env.REACT_APP_LEARNINGS_BAP_ID,
    apiLink_BAP_URI: process.env.REACT_APP_LEARNINGS_BAP_URI,
    // apiLink_API_BASE_URL: "https://kahani-api.tekdinext.com",
    apiLink_API_BASE_URL: process.env.REACT_APP_LEARNINGS_BASE_URL,
    imageUrl: learnings,
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
        provider_name: val?.item?.provider_name || "",
        item_name: val?.item?.title || "",
        params: paramData,
      };
      await OnestService.create(data);
    },
  },
};
