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
    apiLink_DB_CACHE: process.env.REACT_APP_SCHOLARSHIP_DB_CACHE,
    apiLink_DOMAIN: process.env.REACT_APP_SCHOLARSHIP_DOMAIN,
    apiLink_BAP_ID: process.env.REACT_APP_SCHOLARSHIPS_BAP_ID,
    apiLink_BAP_URI: process.env.REACT_APP_SCHOLARSHIPS_BAP_URI,
    apiLink_API_BASE_URL: process.env.REACT_APP_SCHOLARSHIPS_BASE_URL,
    imageUrl: scholarships,
    apiResponse: (e) =>
      e?.data?.data?.[process.env.REACT_APP_SCHOLARSHIP_DB_CACHE],
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
        user_id: val?.userData.user_id,
        context: val?.type,
        context_item_id: val?.jobId,
        status: "created",
        order_id:
          val?.response?.data?.data?.[
            process.env.REACT_APP_SCHOLARSHIPS_INSERT_ORDER
          ]?.returning?.[0]?.order_id,
        provider_name: val?.item?.provider_name || "",
        item_name: val?.item?.title || "",
      };
      await OnestService.create(data);
    },
    expiryLimit: 600, //seconds
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
    apiLink_DB_CACHE: process.env.REACT_APP_JOBS_DB_CACHE,
    apiLink_DOMAIN: process.env.REACT_APP_JOBS_DOMAIN,
    apiLink_BAP_ID: process.env.REACT_APP_JOBS_BAP_ID,
    apiLink_BAP_URI: process.env.REACT_APP_JOBS_BAP_URI,
    apiLink_API_BASE_URL: process.env.REACT_APP_JOBS_BASE_URL,
    apiLink_API_LIST_URL: `${process.env.REACT_APP_JOBS_BASE_URL}/jobs/search`,
    imageUrl: jobs,
    apiResponse: (e) => e?.data?.data?.[process.env.REACT_APP_JOBS_DB_CACHE],
    render: (obj) => {
      const getSalaryInfo = (data) => {
        // Find the object with descriptor.code === "salary-info"
        const salaryInfo = data.find(
          (item) => item.descriptor.code === "salary-info"
        );
        // If the object is found, proceed to return the values of list[0] and list[1]
        if (salaryInfo && salaryInfo.list.length >= 2) {
          const minSalary = salaryInfo.list[0].value;
          const maxSalary = salaryInfo.list[1].value;
          return `Rs. ${minSalary} - Rs. ${maxSalary}`;
        }
        // Return null if the object or required list items are not found
        return "As per Industry Standards";
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
              {obj?.item?.creator?.descriptor?.name ||
                "Company name not mentioned"}
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
              {getSalaryInfo(obj.item.tags)}
            </Text>
          </HStack>
        </VStack>
      );
    },
    onOrderIdGenerate: async (val) => {
      const data = {
        user_id: val?.userData.user_id,
        context: val?.type,
        context_item_id: val?.jobId,
        status: "created",
        order_id:
          val?.response?.data?.data[process.env.REACT_APP_JOBS_INSERT_ORDER]
            ?.returning?.[0]?.order_id,
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
    apiLink_DB_CACHE: process.env.REACT_APP_LEARNINGS_DB_CACHE,
    apiLink_API_ROUTE: "content",
    apiLink_DOMAIN: process.env.REACT_APP_LEARNINGS_DOMAIN,
    apiLink_BAP_ID: process.env.REACT_APP_LEARNINGS_BAP_ID,
    apiLink_BAP_URI: process.env.REACT_APP_LEARNINGS_BAP_URI,
    // apiLink_API_BASE_URL: "https://kahani-api.tekdinext.com",
    apiLink_API_BASE_URL: process.env.REACT_APP_LEARNINGS_BASE_URL,
    imageUrl: learnings,
    apiResponse: (e) => e.data.data[process.env.REACT_APP_LEARNINGS_DB_CACHE],
    getTrackData: async (e) => {
      const data = {
        context: e?.type || "",
        context_item_id: e?.itemId,
        user_id: e?.user_id,
      };
      let result = await OnestService.getList({ filters: data });

      if (
        result?.data?.length &&
        typeof result?.data?.[0].params === "string"
      ) {
        try {
          result.data[0].params = JSON.parse(result.data[0].params);
        } catch (e) {
          console.error("Error parsing params:", e);
        }
      }
      return result?.data?.[0];
    },
    onOrderIdGenerate: async (val) => {
      const paramData = { url: "", type: "" };
      paramData.url =
        val.response.responses?.[0]?.message.order?.fulfillments?.[0]?.stops?.[0]?.instructions?.media?.[0]?.url;
      paramData.type =
        val.response.responses?.[0]?.message.order?.fulfillments?.[0]?.stops?.[0]?.type;
      // const list =
      //   val.response.responses[0].message.order.items[0].tags[0].list;
      // list.forEach((item) => {
      //   // Check if the descriptor code is "urlType"
      //   if (item.descriptor.code === "urlType") {
      //     // If found, extract the value associated with it
      //     paramData.type = item.value;
      //   }
      // });
      const data = {
        user_id: val?.userData?.user_id,
        context: val?.type,
        context_item_id: val?.itemId,
        status: "created",
        order_id: val?.response?.responses?.[0]?.message.order.id,
        provider_name: val?.item?.provider_name || "",
        item_name: val?.item?.title || "",
        params: JSON.stringify(paramData),
      };
      await OnestService.create(data);
    },
  },
};
