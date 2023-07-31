import React, { useEffect } from "react";
import { Box, HStack, VStack, ScrollView, Button } from "native-base";
import {
  IconByName,
  AdminLayout as Layout,
  useWindowSize,
  facilitatorRegistryService,
} from "@shiksha/common-lib";
import Table from "../duplicate/DuplicateTable";
import { useTranslation } from "react-i18next";

export default function AdminHome({ footerLinks, userTokenInfo }) {
  const { t } = useTranslation();
  const [width, Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = React.useState();
  const [duplicateData, setduplicateData] = React.useState();

  const ref = React.useRef(null);
  const [loading, setLoading] = React.useState(true);
  const [paginationTotalRows, setPaginationTotalRows] = React.useState(0);

  // facilitator pagination

  React.useEffect(async () => {
    const dupliData = await facilitatorRegistryService.getDuplicateList();
    setduplicateData(dupliData);
    setLoading(false);
  }, []);

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
