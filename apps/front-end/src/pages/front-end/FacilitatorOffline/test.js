import Form from "@rjsf/core";
import { VStack } from "native-base";
import React from "react";
import validator from "@rjsf/validator-ajv8";
import Clipboard from "./Clipboard";
import { widgets, templates } from "./BaseInput";
import Steper from "./Steper";

const Test2 = ({ onChange, value, schema }) => {
  console.log(schema);
  return (
    <h1
      onClick={(e) => {
        console.log(e);
        onChange(12);
      }}
    >
      {value}
      hello
    </h1>
  );
};

export default function Test() {
  const [page, setPage] = React.useState(0);
  const [text, setText] = React.useState("");
  const [formData, setFormData] = React.useState({});
  console.log(formData);
  return (
    <VStack space="5" p="40">
      <button onClick={(e) => setPage(page + 1)}>asd {page}</button>
      <Steper
        type={"circle"}
        steps={[
          { value: "6", label: "BASIC_DETAILS" },
          { value: "3", label: "WORK_DETAILS" },
          { value: "1", label: "OTHER_DETAILS" },
          { value: "1", label: "last" },
        ]}
        progress={page === "upload" ? 10 : page}
      />
      <Form
        formData={formData}
        onSubmit={(data) => setFormData(data.formData)}
        widgets={{ Test2 }}
        {...{ templates, widgets }}
        validator={validator}
        schema={{
          title: "A registration form",
          description: "A simple form example.",
          type: "object",
          required: ["firstName", "lastName"],
          properties: {
            firstName: {
              type: "string",
              title: "First name",
              default: "Chuck",
            },
            gender: {
              label: "GENDER",
              type: "string",
              format: "CustomR",
              grid: 3,
              icons: [
                {
                  name: "DeleteBinLineIcon",
                  _icon: { size: "30" },
                },
                {
                  name: "Male",
                  _icon: { size: "30" },
                },
                {
                  name: "Other",
                  _icon: { size: "30" },
                },
              ],
              enumNames: ["FEMALE", "MALE", "OTHER"],
              enum: ["female", "male", "other"],
            },
            device_type: {
              type: "string",
              label: "TYPE_OF_MOBILE_PHONE",
              format: "CustomR",
              enumNames: ["SMARTPHONE", "BASIC"],
              enum: [
                "smartphone",
                "basic",
                "SMARTPHONE",
                "BASIC",
                "SMARTPHONE",
              ],
              grid: "3",
            },
            lastName: {
              type: "string",
              title: "Last name",
            },
            age: {
              type: "integer",
              format: "Test2",
              title: "Age",
              sagar: "hello sagar",
            },
            bio: {
              type: "string",
              title: "Bio",
            },
            password: {
              type: "string",
              title: "Password",
              minLength: 3,
            },
            telephone: {
              type: "string",
              title: "Telephone",
              minLength: 10,
            },
          },
        }}
      />
    </VStack>
  );
}

const input = () => {
  return <input />;
};
