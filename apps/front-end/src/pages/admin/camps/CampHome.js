import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Image,
  Button,
  HStack,
  Input,
  ScrollView,
  VStack,
} from "native-base";
import {
  AdminTypo,
  IconByName,
  AdminLayout as Layout,
  debounce,
  t,
  useWindowSize,
} from "@shiksha/common-lib";
import DataTable from "react-data-table-component";

export const CustomStyles = {
  rows: {
    style: {
      minHeight: "72px",
    },
  },
  headCells: {
    style: {
      background: "#E0E0E0",
      color: "#616161",
      size: "16px",
      justifyContent: "center", // override the alignment of columns
    },
  },
  cells: {
    style: {
      color: "#616161",
      size: "19px",
      justifyContent: "center", // override the alignment of columns
    },
  },
};
const data = [
  {
    id: 1,
    camp: "abc",
    prerak_id: 9,
    prerak: "Tushar",
    camp_status: "Complete",
  },
  {
    id: 2,
    camp: "def",
    prerak_id: 8,
    prerak: "Sagar",
    camp_status: "Incomplete",
  },
  {
    id: 3,
    camp: "ghi",
    prerak_id: 7,
    prerak: "Swapnil",
    camp_status: "Complete",
  },
  {
    id: 4,
    camp: "jkl",
    prerak_id: 5,
    prerak: "Chaitanya",
    camp_status: "Complete",
  },
  {
    id: 5,
    camp: "mno",
    prerak_id: 10,
    prerak: "Rahul",
    camp_status: "InComplete",
  },
];
const columns = (navigate) => [
  {
    name: t("ID"),
    selector: (row) => row?.id,
    sortable: true,
    attr: "aadhaar",
    wrap: true,
  },
  {
    name: t("CAMP"),
    selector: (row) => row?.camp,
    sortable: true,
    attr: "count",
  },
  {
    name: t("PRERAK_ID"),
    selector: (row) => row?.prerak_id,
    sortable: true,
    attr: "count",
  },
  {
    name: t("PRERAK"),
    selector: (row) => row?.prerak,
    sortable: true,
    attr: "count",
  },
  {
    name: t("CAMP_STATUS"),
    selector: (row) => row?.camp_status,
    sortable: true,
    attr: "count",
  },
  {
    name: t("ACTION"),
    selector: (row) => (
      <AdminTypo.Secondarybutton
        my="3"
        onPress={() => navigate(`/admin/camp/987/view`)}
      >
        {t("VIEW")}
      </AdminTypo.Secondarybutton>
    ),
    sortable: true,
    attr: "count",
  },
];
export default function CampHome({ footerLinks, userTokenInfo }) {
  const [filter, setFilter] = React.useState({ limit: 10 });
  const [Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = React.useState();
  const ref = React.useRef(null);
  const navigate = useNavigate();
  return (
    <Layout getRefAppBar={(e) => setRefAppBar(e)} _sidebar={footerLinks}>
      <HStack
        space={[0, 0, "2"]}
        p="2"
        my="1"
        mb="3"
        justifyContent="space-between"
        flexWrap="wrap"
        gridGap="2"
      >
        <HStack
          justifyContent={"space-between"}
          space={"4"}
          alignItems="center"
        >
          <HStack justifyContent="space-between" alignItems="center">
            <IconByName name="GroupLineIcon" size="md" />
            <AdminTypo.H1>{t("ALL_CAMPS")}</AdminTypo.H1>
          </HStack>
          <Image
            source={{
              uri: "/box.svg",
            }}
            alt=""
            size={"28px"}
            resizeMode="contain"
          />
        </HStack>
        <Input
          size={"xs"}
          minH="49px"
          maxH="49px"
          onScroll={false}
          InputLeftElement={
            <IconByName
              color="coolGray.500"
              name="SearchLineIcon"
              isDisabled
              pl="2"
            />
          }
          placeholder={t("SEARCH")}
          variant="outline"
          onChange={(e) => {
            debounce(
              setFilter({ ...filter, search: e.nativeEvent.text, page: 1 }),
              3000
            );
          }}
        />

        <AdminTypo.Secondarybutton
          rightIcon={
            <IconByName
              color="#084B82"
              _icon={{}}
              size="15px"
              name="ShareLineIcon"
            />
          }
        >
          {t("EXPORT")}
        </AdminTypo.Secondarybutton>
      </HStack>
      <HStack>
        <Box
          flex={[2, 2, 1]}
          style={{ borderRightColor: "dividerColor", borderRightWidth: "2px" }}
        >
          <HStack ref={ref}></HStack>
          <ScrollView
            maxH={
              Height - (refAppBar?.clientHeight + ref?.current?.clientHeight)
            }
          >
            <VStack space={3}>
              <HStack
                alignItems="center"
                justifyContent="space-between"
                borderBottomWidth="2"
                borderColor="#eee"
                flexWrap="wrap"
              >
                <HStack>
                  <IconByName isDisabled name="FilterLineIcon" />
                  <AdminTypo.H5 bold>{t("FILTERS")}</AdminTypo.H5>
                </HStack>
                <Button variant="link" pt="3">
                  <AdminTypo.H6 color="blueText.400" underline bold>
                    {t("CLEAR_FILTER")}
                  </AdminTypo.H6>
                </Button>
              </HStack>
            </VStack>
          </ScrollView>
        </Box>
        <Box flex={[5, 5, 4]}>
          <ScrollView
            maxH={Height - refAppBar?.clientHeight}
            minH={Height - refAppBar?.clientHeight}
          >
            <Box roundedBottom={"2xl"} px="4" mb={5}>
              <DataTable
                customStyles={CustomStyles}
                columns={[...columns(navigate)]}
                persistTableHead
                pagination
                paginationRowsPerPageOptions={[5, 10, 15, 25, 50, 100]}
                defaultSortAsc
                paginationServer
                data={data}
              />
            </Box>
          </ScrollView>
        </Box>
      </HStack>
    </Layout>
  );
}
