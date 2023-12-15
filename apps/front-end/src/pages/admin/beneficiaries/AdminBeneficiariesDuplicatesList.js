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
  const [duplicateData, setDuplicateData] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [paginationTotalRows, setPaginationTotalRows] = React.useState(0);
  const [filter, setFilter] = React.useState({});

  // facilitator pagination

  const getDuplicateBeneficiariesList = React.useCallback(async () => {
    setLoading(true);
    const dupliData =
      await benificiaryRegistoryService.getDuplicateBeneficiariesList(filter);
    setPaginationTotalRows(dupliData?.count || 0);
    setDuplicateData(dupliData?.data);
    setLoading(false);
  }, [filter]);

  React.useEffect(() => {
    getDuplicateBeneficiariesList();
  }, [getDuplicateBeneficiariesList]);

  const TableComponent = React.useMemo(
    () => (
      <Table
        filter={filter}
        setFilter={setFilter}
        duplicateData={duplicateData}
        facilitator={userTokenInfo?.authUser}
        paginationTotalRows={paginationTotalRows}
        loading={loading}
      />
    ),
    [
      filter,
      duplicateData,
      userTokenInfo?.authUser,
      paginationTotalRows,
      loading,
    ]
  );

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
            {TableComponent}
          </Box>
        </ScrollView>
      </HStack>
    </Layout>
  );
}
