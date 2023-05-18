import {
  IconByName,
  facilitatorRegistryService,
  H1,
  H3,
  t,
  ImageView,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/Chip";
import Clipboard from "component/Clipboard";
import { Button, HStack, Input, Text, VStack, Modal } from "native-base";
import React from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";

const columns = (e) => [
  {
    name: t("FIRST_NAME"),
    selector: (row) => (
      <HStack alignItems={"center"} space="2">
        {row?.documents?.[0]?.name ? (
          <ImageView
            source={{
              uri: row?.documents?.[0]?.name,
            }}
            // alt="Alternate Text"
            width={"35px"}
            height={"35px"}
          />
        ) : (
          <IconByName
            isDisabled
            name="AccountCircleLineIcon"
            color="gray.300"
            _icon={{ size: "35" }}
          />
        )}
        <Text>{row?.first_name + " " + row.last_name}</Text>
      </HStack>
    ),
    sortable: true,
    attr: "name",
  },
  {
    name: t("EMAIL_ID"),
    selector: (row) => row?.email_id,
    sortable: true,
    attr: "email",
  },
  {
    name: t("STATUS"),
    selector: (row, index) => <ChipStatus key={index} status={row?.status} />,
    sortable: true,
    attr: "email",
  },
  {
    name: t("GENDER"),
    selector: (row) => row?.gender,
    sortable: true,
    attr: "city",
  },
];

const filters = (data, filter) => {
  return data.filter((item) => {
    for (let key in filter) {
      if (
        item[key] === undefined ||
        !filter[key].includes(
          `${
            item[key] && typeof item[key] === "string"
              ? item[key].trim()
              : item[key]
          }`
        )
      ) {
        return false;
      }
    }

    return true;
  });
};
function getBaseUrl() {
  var re = new RegExp(/^.*\//);
  return re.exec(window.location.href);
}

// Table component
function Table({ facilitator }) {
  const [data, setData] = React.useState([]);
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [paginationTotalRows, setPaginationTotalRows] = React.useState(0);
  const [filterObj, setFilterObj] = React.useState();
  const [modal, setModal] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(async () => {
    setLoading(true);
    const result = await facilitatorRegistryService.getAll(filterObj);
    setData(result.data);
    setPaginationTotalRows(result?.totalCount);
    setLoading(false);
  }, [filterObj]);

  React.useEffect(() => {
    setFilterObj({ page, limit });
  }, [page, limit]);

  return (
    <VStack>
      <HStack justifyContent={"space-between"} flexWrap="Wrap">
        <H1>{t("ALL_PRERAK")}</H1>
        {/* <Input
          InputLeftElement={
            <IconByName color="coolGray.500" name="SearchLineIcon" />
          }
          placeholder="search"
          variant="outline"
        /> */}
        <HStack>
          {/* <Button
            variant={"primary"}
            onPress={(e) => navigate("/admin/facilitator-onbording")}
          >
            {t("REGISTER_PRERAK")}
          </Button> */}

          <Button variant={"primary"} onPress={() => setModal(true)}>
            {t("SEND_AN_INVITE")}
          </Button>
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
                    <Clipboard
                      text={`${getBaseUrl()}facilitator-self-onboarding/${
                        facilitator?.program_users[0]?.organisation_id
                      }`}
                    >
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
                    </Clipboard>
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

      <DataTable
        columns={[
          ...columns(),
          {
            name: t("ACTION"),
            selector: (row) => (
              <Button
                size={"xs"}
                onPress={() => {
                  navigate(`/admin/view/${row?.id}`);
                }}
              >
                {t("VIEW")}
              </Button>
            ),
          },
        ]}
        data={data}
        subHeader
        persistTableHead
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={paginationTotalRows}
        onChangeRowsPerPage={(e) => setLimit(e)}
        onChangePage={(e) => setPage(e)}
      />
    </VStack>
  );
}

export default Table;
