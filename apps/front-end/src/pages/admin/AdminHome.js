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
  Image,
  Modal,
  Input,
  Button
} from "native-base";
import {
  IconByName,
  AdminLayout as Layout,
  H1,
  useWindowSize,
  H3,
  t,
  BlueFillButton,
} from "@shiksha/common-lib";
import Table from "./facilitator/Table";
import Chip from "component/Chip";
import { useNavigate } from "react-router-dom";

const FilterSidebar = ({ items, element, _scrollView, _flex }) => {
  return items.map((item, key) => (
    <VStack space={"2"} key={key}>
      <HStack alignItems="center" space={"2"}>
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
function getBaseUrl() {
  var re = new RegExp(/^.*\//);
  return re.exec(window.location.href);
}
export default function AdminHome({ footerLinks, userTokenInfo }) {
  const [width, Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = React.useState();
  const ref = React.useRef(null);
  const [modal, setModal] = React.useState(false);
 
  return (
    <Layout getRefAppBar={(e) => setRefAppBar(e)} _sidebar={footerLinks}>
      <HStack justifyContent={"space-between"} my="8" mx="3">
      <HStack>
        <Image
          source={{
            uri: "/profile.svg",
          }}
          alt="Prerak Orientation"
          size={"xs"}
          resizeMode="contain"
        />
        <H1 pl="3" pr="8">{t("ALL_PRERAKS")}</H1>
        <Image
          source={{
            uri: "/box.svg",
          }}
          alt="Prerak Orientation"
          size="30px"
          resizeMode="contain"
          mt="1"
        />
        </HStack>
        <HStack>
        <BlueFillButton  shadow="BlueOutlineShadow" onPress={() => setModal(true)} rightIcon={<IconByName color="#084B82" size="15px" name="ShareLineIcon"></IconByName>}>
            <Text>{t("SEND_AN_INVITE")}</Text>
          </BlueFillButton> 
          <BlueFillButton mx="3" shadow="BlueFillShadow"  rightIcon={<IconByName  size="20px" name="PencilLineIcon"></IconByName>}>
            {t("REGISTER_PRERAK")}
          </BlueFillButton>
          <Modal
            isOpen={modal}
            onClose={() => setModal(false)}
            safeAreaTop={true}
            size="xl"
          >
            <Modal.Content>
              <Modal.CloseButton />
              <Modal.Header p="5" borderBottomWidth="0">
                <H1 textAlign="center"> {t("SEND_AN_INVITE")}</H1>
              </Modal.Header>
              <Modal.Body p="5" pb="10">
                <VStack space="5">
                  <HStack
                    space="5"
                    borderBottomWidth={1}
                    borderBottomColor="gray.300"
                    pb="5"
                  >
                    <H3> {t("INVITATION_LINK")}</H3>
                    {/* <Clipboard
                      text={`${getBaseUrl()}facilitator-self-onboarding/${
                        facilitator?.program_users[0]?.organisation_id
                      }`}
                    > */}
                      <HStack space="3">
                        <IconByName
                          name="FileCopyLineIcon"
                          isDisabled
                          rounded="full"
                          color="blue.300"
                        />
                        <H3 color="blue.300">
                          {" "}
                          {t("CLICK_HERE_TO_COPY_THE_LINK")}
                        </H3>
                      </HStack>
                    {/* </Clipboard> */}
                  </HStack>
                  <HStack space="5" pt="5">
                    <Input
                      flex={0.7}
                      placeholder={t("EMAIL_ID_OR_PHONE_NUMBER")}
                      variant="underlined"
                    />
                    <Button flex={0.3} variant="primary">
                      {t("SEND")}
                    </Button>
                  </HStack>
                </VStack>
              </Modal.Body>
            </Modal.Content>
          </Modal>
        </HStack>
        </HStack>
      <HStack>
      
        <Box flex="0.2">
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
                  <Text fontSize="md" color="textGreyColor.550" bold>{t("FILTERS")}</Text>
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
        </Box>
        {/* <ScrollView
          maxH={Height - refAppBar?.clientHeight}
          minH={Height - refAppBar?.clientHeight}
        > */}
          <Box roundedBottom={"2xl"} flex="0.8" py={4} px={4} mb={5}>
            <Table facilitator={userTokenInfo?.authUser} />
          </Box>
        {/* </ScrollView> */}
      </HStack>
    </Layout>
  );
}
