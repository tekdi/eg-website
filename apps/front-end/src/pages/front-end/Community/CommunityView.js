import React from "react";
// import Form from "./Form";
import { FrontEndTypo, Layout } from "@shiksha/common-lib";
import { HStack, VStack } from "native-base";
import { useNavigate } from "react-router-dom";
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
const columns = [
  {
    name: "Sr",
    selector: (row) => row.id,
  },
  {
    name: "Name",
    selector: (row) => row.name,
  },
  {
    name: "Mobile",
    selector: (row) => row.mobile,
  },
  {
    name: "Designation",
    selector: (row) => row.designation,
  },
];

const data = [
  { id: 1, name: "John Doe", mobile: "123-456-7890", designation: "President" },
  {
    id: 2,
    name: "Jane Smith",
    mobile: "987-654-3210",
    designation: "Vice President",
  },
];

export default function CommunityView({ footerLinks }) {
  const navigate = useNavigate();
  return (
    <Layout
      _appBar={{
        onlyIconsShow: ["userInfo", "loginBtn"],
        _box: { bg: "white", shadow: "appBarShadow" },
        _backBtn: { borderWidth: 1, p: 0, borderColor: "btnGray.100" },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
      _footer={{ menues: footerLinks }}
    >
      <VStack p="4">
        <HStack justifyContent={"right"}>
          <FrontEndTypo.Primarybutton>
            <FrontEndTypo.H2
              color={"#fff"}
              onPress={(e) => navigate("/community/communityform")}
            >
              Add Community member
            </FrontEndTypo.H2>
          </FrontEndTypo.Primarybutton>
        </HStack>
        <DataTable customStyles={CustomStyles} columns={columns} data={data} />
      </VStack>
    </Layout>
  );
}
