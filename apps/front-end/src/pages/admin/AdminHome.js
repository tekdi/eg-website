import React from "react";
import {
  Box,
  HStack,
  Select,
  CheckIcon,
  Text,
  Checkbox,
  VStack,
  ScrollView,
  Flex,
} from "native-base";
import {
  IconByName,
  AdminLayout as Layout,
  H2,
  useWindowSize,
  H3,
  t,
} from "@shiksha/common-lib";
import Table from "./facilitator/Table";
import Chip from "component/Chip";

const FilterSidebar = ({ items, element, _scrollView, _flex }) => {
  return items.map((item, key) => (
    <VStack space={"2"} key={key}>
      <HStack alignItems="center" space={"2"}>
        <IconByName isDisabled name="MapPinLineIcon" />
        <H3>{item.name}</H3>
      </HStack>
      <ScrollView {..._scrollView}>
        <Flex px="2" space={"2"} direction="column" flexWrap="wrap" {..._flex}>
          {item?.data?.map((e, index) =>
            element ? (
              element(e, index)
            ) : (
              <Checkbox key={index} value={e?.value} _icon={{ size: "12px" }}>
                {e?.label}
              </Checkbox>
            )
          )}
        </Flex>
      </ScrollView>
    </VStack>
  ));
};

export default function AdminHome({ footerLinks, userTokenInfo }) {
  const [width, Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = React.useState();
  const ref = React.useRef(null);

  return (
    <Layout getRefAppBar={(e) => setRefAppBar(e)} _sidebar={footerLinks}>
      <HStack>
        {/* <Box flex={0.2}>
          <Box p="10px" bg="primary.500" ref={ref}>
            <H2 color="white">{t("MY_PRERAKS")}</H2>
          </Box>
          <ScrollView
            maxH={
              Height - (refAppBar?.clientHeight + ref?.current?.clientHeight)
            }
          >
            <VStack space={5} py="5" px="2">
              <HStack alignItems="center" space={1} width="200px" height="24px">
                <IconByName isDisabled name="SortDescIcon" />
                <Text>{t("SORT_BY")}</Text>
              </HStack>
              <Select
                minWidth="20"
                placeholder="Recent"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />,
                }}
                mt={1}
                onValueChange={(itemValue) => setService(itemValue)}
              >
                <Select.Item label="abc" value="ux" />
              </Select>

              <VStack space={5}>
                <HStack alignItems="center">
                  <IconByName isDisabled name="FilterLineIcon" />
                  <Text>{t("FILTER")}</Text>
                </HStack>
                <FilterSidebar
                  items={[
                    {
                      name: t("DISTRICT"),
                      data: [
                        { label: "All", value: "all" },
                        { label: "Ajmer", value: "ajmer" },
                        { label: "Alwar", value: "alwar" },
                        { label: "Bikaner", value: "bikaner" },
                        { label: "Banswara", value: "banswara" },
                        { label: "Baran", value: "baran" },
                        { label: "Barmer", value: "barmer" },
                      ],
                    },
                  ]}
                />
                <FilterSidebar
                  items={[
                    {
                      name: t("QUALIFICATION"),
                      data: [
                        { label: "All", value: "all" },
                        { label: "12th", value: "12" },
                        { label: "Graduate", value: "graduate" },
                        { label: "Post Graduate", value: "post_graduate" },
                        { label: "Diploma", value: "diploma" },
                      ],
                    },
                  ]}
                />
                <FilterSidebar
                  _flex={{ direction: "row" }}
                  element={(e, index) => (
                    <Chip key={index} isActive={!index} {...e} />
                  )}
                  items={[
                    {
                      name: t("WORK_EXPERIENCE"),
                      data: [
                        { label: "All", value: "all" },
                        { label: "0 yrs", value: "0" },
                        { label: "1 yrs", value: "1" },
                        { label: "2 yrs", value: "2" },
                        { label: "3 yrs", value: "3" },
                        { label: "4 yrs", value: "4" },
                        { label: "5 yrs", value: "5" },
                        { label: "+5 yrs", value: "5" },
                      ],
                    },
                  ]}
                />
              </VStack>
            </VStack>
          </ScrollView>
        </Box> */}
        <ScrollView
          maxH={Height - refAppBar?.clientHeight}
          minH={Height - refAppBar?.clientHeight}
        >
          <Box flex={1}  roundedBottom={"2xl"} py={6} px={4} mb={5}>
            <Table  facilitator={userTokenInfo?.authUser} />
          </Box>
        </ScrollView>
      </HStack>
    </Layout>
  );
}
