import React from "react";
import { Box, HStack, ScrollView } from "native-base";
import {
  AdminLayout as Layout,
  useWindowSize,
  benificiaryRegistoryService,
} from "@shiksha/common-lib";
import Table from "./AdminBeneficiariesDuplicatesListTable";

export default function AdminHome({ footerLinks, userTokenInfo }) {
  const [Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = React.useState();
  const [duplicateData, setduplicateData] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [paginationTotalRows, setPaginationTotalRows] = React.useState(0);
  const [filter, setFilter] = React.useState({});

  // facilitator pagination

  React.useEffect(async () => {
    const dupliData =
      await benificiaryRegistoryService.getDuplicateBeneficiariesList(filter);
    setPaginationTotalRows(dupliData?.count || 0);
    setduplicateData(dupliData?.data);
    setLoading(false);
  }, [filter]);

  return (
    <Layout
      getRefAppBar={(e) => setRefAppBar(e)}
      _sidebar={footerLinks}
      loading={loading}
    >
      <HStack>
        <ScrollView
          maxH={Height - refAppBar?.clientHeight}
          minH={Height - refAppBar?.clientHeight}
        >
          <Box roundedBottom={"2xl"} py={6} px={4} mb={5}>
            <Table
              filter={filter}
              setFilter={setFilter}
              duplicateData={duplicateData}
              facilitator={userTokenInfo?.authUser}
              paginationTotalRows={paginationTotalRows}
              loading={loading}
            />
          </Box>
        </ScrollView>
      </HStack>
    </Layout>
  );
}
