import { H1, IconByName, t } from "@shiksha/common-lib";
import { ChipStatus } from "component/Chip";
import { HStack, Text, Avatar, Stack, Input } from "native-base";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";

const columns = (e) => [
  {
    name: t("Name"),
    selector: (row) => row?.name,
    // <HStack alignItems={"center"} space="2">
    //   <Avatar
    //     source={{
    //       uri: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    //     }}
    //     width={"35px"}
    //     height={"35px"}
    //   />
    //   <Text>{row?.name}</Text>
    // </HStack>
    sortable: true,
  },
  {
    name: t("LAST_YEAR_STUDIES_YEAR"),
    selector: (row) => row?.studiedyear,
    sortable: true,
  },
  {
    name: t("PRERAK"),
    selector: (row) => row?.prerakname,
    sortable: true,
  },
  {
    name: t("STATUS"),
    selector: (row, index) => <ChipStatus key={index} status={row?.status} />,

    sortable: true,
  },
  {
    name: t("COMMENTS"),
    selector: (row) => row.comments,
    sortable: true,
  },
];

const data = [
  {
    id: 1,
    name: "Chaitanya Kole",
    studiedyear: 2020,
    prerakname: "Dnyanesh K",
    status: "Applied",
    comments: "--",
  },
  {
    id: 2,
    name: "Tushar Mahajan",
    studiedyear: 2022,
    prerakname: "Sagar T.",
    status: "Applied",
    comments: "--",
  },
  {
    id: 3,
    name: "Dhanashree P.",
    studiedyear: 2021,
    prerakname: "Sagar T.",
    status: "Applied",
    comments: "--",
  },
  {
    id: 4,
    name: "Rahul Sanap",
    studiedyear: 2020,
    prerakname: "Dnyanesh K.",
    status: "Applied",
    comments: "--",
  },
  {
    id: 5,
    name: "Mahesh M.",
    studiedyear: 2017,
    prerakname: "Sagar T.",
    status: "Applied",
    comments: "--",
  },
  {
    id: 6,
    name: "Pavan J.",
    studiedyear: 2021,
    prerakname: "Manoj L.",
    status: "Applied",
    comments: "--",
  },
  {
    id: 7,
    name: "Saurabh W.",
    studiedyear: 2022,
    prerakname: "Sagar T.",
    status: "Applied",
    comments: "--",
  },
  {
    id: 8,
    name: "Pallavi P.",
    studiedyear: 2020,
    prerakname: "Manoj L.",
    status: "Rejected",
    comments: "Incomplete Form",
  },
  {
    id: 9,
    name: "Manisha S.",
    studiedyear: 2021,
    prerakname: "Sagar T.",
    status: "Applied",
    comments: "--",
  },
  {
    id: 10,
    name: "Raj K.",
    studiedyear: 2018,
    prerakname: "Dyanesh K.",
    status: "Shortlisted",
    comments: "--",
  },
  {
    id: 11,
    name: "Mahesh M.",
    studiedyear: 2020,
    prerakname: "Manoj L.",
    status: "Applied",
    comments: "--",
  },
  {
    id: 12,
    name: "Vishawas B.",
    studiedyear: 2019,
    prerakname: "Dnyanesh K.",
    status: "Rejected",
    comments: "Documentd missmatch",
  },
  {
    id: 13,
    name: "Avinash N",
    studiedyear: 2023,
    prerakname: "Sagar T.",
    status: "Applied",
    comments: "--",
  },
  {
    id: 14,
    name: "Balram Y.",
    studiedyear: 2015,
    prerakname: "Manoj L.",
    status: "Applied",
    comments: "--",
  },
  {
    id: 15,
    name: "Eknath K.",
    studiedyear: 2017,
    prerakname: "Manoj L.",
    status: "Rejected",
    comments: "False data",
  },
  {
    id: 16,
    name: "Yashoda Y.",
    studiedyear: 2017,
    prerakname: "Dnyanesh K.",
    status: "Applied",
    comments: "--",
  },
];
function AGslist() {
  const [record, setRecord] = React.useState(data);
  function handleFilter(e) {
    const newData = data.filter((row) => {
      return row.name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setRecord(newData);
  }
  return (
    <Stack>
      <HStack>
        <H1>{t("ALL_AG_LEARNERS")}</H1>
        <Input
          marginLeft={"650px"}
          width={"500px"}
          borderColor={"black"}
          type="text"
          placeholder={t("SEARCH_BY_AG_LEARNER_NAME")}
          onChange={handleFilter}
        />
      </HStack>
      <DataTable
        columns={[...columns()]}
        data={record}
        persistTableHead
        highlightOnHover
        pagination
      />
    </Stack>
  );
}

export default AGslist;
