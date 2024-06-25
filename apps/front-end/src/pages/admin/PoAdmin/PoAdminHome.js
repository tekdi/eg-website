import React, { useEffect, useState } from "react";
import { Box, HStack, ScrollView } from "native-base";
import {
  PoAdminLayout as Layout,
  useWindowSize,
  benificiaryRegistoryService,
} from "@shiksha/common-lib";
import Table from "./Table";
import PropTypes from "prop-types";

export default function AdminHome({ footerLinks, userTokenInfo }) {
  const [Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = useState();
  const [duplicateData, setduplicateData] = useState();
  const [loading, setLoading] = useState(true);
  const [paginationTotalRows, setPaginationTotalRows] = useState(0);
  const [filter, setFilter] = useState({ limit: 10 });

  useEffect(async () => {
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

AdminHome.PropTypes = {
  footerLinks: PropTypes.any,
  userTokenInfo: PropTypes.any,
};
