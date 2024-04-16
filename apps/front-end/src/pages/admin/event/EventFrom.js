import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import {
  AdminTypo,
  BodyMedium,
  IconByName,
  AdminLayout as Layout,
  arrList,
  enumRegistryService,
  eventService,
  facilitatorRegistryService,
  geolocationRegistryService,
  getOptions,
  jsonParse,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/Chip";
import { debounce } from "lodash";
import moment from "moment";
import {
  Alert,
  Checkbox,
  HStack,
  Input,
  Menu,
  Pressable,
  Stack,
  VStack,
  useToast,
} from "native-base";
import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { templates, widgets } from "../../../component/BaseInput";
import Schema from "./Schema";

const customStyles = {
  headCells: {
    style: {
      background: "#E0E0E0",
      fontSize: "14px",
      color: "#616161",
    },
  },
  cells: {
    style: {
      padding: "10px 5px",
    },
  },
};

const columns = (t, handleCheckboxChange, selectedRowId) => [
  {
    name: t("ID"),
    selector: (row) => (
      <HStack alignItems={"center"} space={2}>
        <Checkbox
          isChecked={selectedRowId.includes(row.id)}
          onChange={() => handleCheckboxChange(row?.id)}
        />
        <AdminTypo.H7 bold>{row?.id}</AdminTypo.H7>
      </HStack>
    ),
    sortable: false,
    wrap: true,
    width: "80px",
    attr: "name",
  },
  {
    name: t("NAME"),
    selector: (row) => (
      <HStack alignItems={"center"} space={2}>
        <AdminTypo.H6 bold textOverflow="ellipsis">
          {row?.first_name + " " + row?.last_name}
        </AdminTypo.H6>
      </HStack>
    ),
    sortable: false,
    wrap: true,
    width: "150px",
    attr: "name",
  },
  {
    name: t("STATUS"),
    selector: (row, index) => (
      <ChipStatus
        py="1"
        px="1"
        key={index}
        status={row?.program_faciltators?.[0]?.status}
      />
    ),
    sortable: false,
    attr: "email",
    wrap: true,
  },
  {
    name: t("DISTRICT"),
    selector: (row) => (row?.district ? row?.district : "-"),
    sortable: false,
    attr: "city",
  },

  {
    name: t("BLOCK"),
    selector: (row) => (row?.block ? row?.block : "-"),
    sortable: false,
    attr: "city",
  },
  {
    name: t("PHONE_NUMBER"),
    selector: (row) => (row?.mobile ? row?.mobile : "-"),
    sortable: false,
    attr: "city",
  },
];

const uiSchema = {
  date: {
    "ui:widget": "CalenderInput",
    // "ui:widget": "alt-datetime",
    // "ui:options": {
    //   hideNowButton: true,
    //   hideClearButton: true,
    //   yearsRange: [2023, 2030],
    // },
  },
  time: {
    "ui:widget": "Time",
    // "ui:widget": "hidden",
  },
};
export default function EventHome({ footerLinks }) {
  const formRef = useRef();
  const [errors, setErrors] = useState({});
  const [schema, setSchema] = useState({});
  const [loading, setLoading] = useState(true);
  const [isListOpen, setIsListOpen] = useState(true);
  const { t } = useTranslation();
  const [paginationTotalRows, setPaginationTotalRows] = useState(0);
  const [data, setData] = useState();
  const [district, setDistrict] = useState();
  const [block, setBlock] = useState();
  const [village, setVillage] = useState();
  const [programData, setProgramData] = useState();
  const [filter, setFilter] = useState({ page: 1, limit: 10 });
  const [isDisabled, setIsDisabled] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();
  const { step, id } = useParams();
  const [selectedRowId, setSelectedRowIds] = useState([]);

  const [formData, setFormData] = useState({});

  const handleOpenButtonClick = () => {
    setIsListOpen((prevState) => !prevState);
  };
  useEffect(async () => {
    if (id) {
      const eventResult = await eventService.getEventListById({ id });
      const peopleResult = await eventService.getAttendanceList({ id });
      const { event } = eventResult;
      const selectedId = peopleResult?.data?.map((e) => e?.id) || [];
      // eventResult?.event?.attendances?.map((e) => e?.user_id) || [];
      setSelectedRowIds(selectedId);
      setIsListOpen(false);
      const timeFormat = "HH:mm:ss";
      const dateFormat = "YYYY-MM-DD";
      const start_date_time = moment
        .utc(event?.start_date + " " + event?.start_time, "YYYY-MM-DD HH:mm:ss")
        ?.local();
      const end_date_time = moment
        .utc(event?.end_date + " " + event?.end_time, "YYYY-MM-DD HH:mm:ss")
        ?.local();
      setFormData({
        type: event?.type,
        name: event?.name,
        master_trainer: event?.master_trainer,
        date: JSON.stringify({
          startDate: start_date_time.format(dateFormat),
          endDate: end_date_time.format(dateFormat),
        }),
        start_date: start_date_time.format(dateFormat),
        start_time: start_date_time.format(timeFormat),
        end_date: end_date_time.format(dateFormat),
        end_time: end_date_time.format(timeFormat),
      });
    }
  }, [id]);

  const handleCheckboxChange = (rowId) => {
    setSelectedRowIds((prevSelectedRowIds) => {
      const isSelected = prevSelectedRowIds?.includes(rowId);
      if (isSelected) {
        return prevSelectedRowIds.filter((id) => id !== rowId);
      } else {
        return [...prevSelectedRowIds, rowId];
      }
    });
  };

  useEffect(async () => {
    const result = await enumRegistryService.listOfEnum();
    let newSchema = Schema;
    newSchema = getOptions(newSchema, {
      key: "type",
      arr: result?.data?.FACILITATOR_EVENT_TYPE?.map((e) => ({
        ...e,
        title: t(e.title),
      })),
      title: "title",
      value: "value",
    });
    newSchema = getOptions(newSchema, {
      key: "name",
      arr: result?.data?.EVENT_BATCH_NAME?.map((e) => ({
        ...e,
        title: t(e.title),
      })),
      title: "title",
      value: "value",
    });

    newSchema = {
      ...newSchema,
      properties: {
        ...newSchema.properties,
        date: {
          ...newSchema?.properties?.date,
          minDate: moment().toDate(),
          // daysDiff: 4,
        },
      },
    };
    if (step === "edit") {
      newSchema = {
        ...newSchema,
        properties: {
          ...newSchema.properties,
          type: {
            ...newSchema.properties.type,
            readOnly: true,
          },
        },
      };
    }
    setSchema(newSchema);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result =
        await facilitatorRegistryService.getFacilitatorByStatusInOrientation({
          ...filter,
          district: filter?.districts?.[0],
          block: filter?.blocks?.[0],
          type: formData?.type,
        });

      setData(result?.data?.data);
      setPaginationTotalRows(result?.data?.totalCount);
      setLoading(false);
    };

    fetchData();
  }, [isListOpen, step, formData?.type, filter]);

  useEffect(() => {
    const fetchData = async () => {
      let programSelected = jsonParse(localStorage.getItem("program"));
      const stateName = programSelected?.state_name;
      setProgramData(stateName);
      const getDistricts = await geolocationRegistryService.getDistricts({
        name: stateName,
      });
      if (Array.isArray(getDistricts?.districts)) {
        setDistrict(getDistricts?.districts);
      }
    };
    fetchData();
  }, []);

  const blockss = useCallback(async () => {
    if (filter?.districts) {
      const blockData = await geolocationRegistryService.getMultipleBlocks({
        districts: filter?.districts,
      });
      setBlock(blockData);
    }
  }, [filter?.districts]);

  useEffect(() => {
    blockss();
  }, [filter?.districts]);

  const villageData = useCallback(async () => {
    if (programData === "BIHAR" && filter?.districts && filter?.blocks) {
      const qData = await geolocationRegistryService.getVillages({
        name: filter?.blocks?.[0],
        state: programData,
        district: filter?.districts?.[0],
        gramp: "null",
      });
      setVillage(qData?.villages);
    }
  }, [filter?.blocks]);

  useEffect(() => {
    villageData();
  }, [filter?.blocks]);

  useEffect(() => {
    const persan = arrList(formData, [
      "type",
      "name",
      "master_trainer",
      "date",
      "start_time",
      "end_time",
    ]);
    setIsDisabled(persan !== 100);
  }, [formData]);

  const checkValidation = (newFormData, key = [], returnError = false) => {
    let errorsObj;
    if (key.includes("root_start_time") && newFormData?.end_time) {
      if (newFormData?.start_time > newFormData?.end_time) {
        const newErrors = {
          start_time: {
            __errors: [t("START_TIME_SHOULD_BE_GREATER_THAN_START_TIME")],
          },
        };
        errorsObj = { ...(errorsObj || {}), ...newErrors };
      }
    }
    if (key.includes("root_end_time") && newFormData?.start_time) {
      if (newFormData?.start_time > newFormData?.end_time) {
        const newErrors = {
          end_time: {
            __errors: [t("END_TIME_SHOULD_BE_GREATER_THAN_START_TIME")],
          },
        };
        errorsObj = { ...(errorsObj || {}), ...newErrors };
      }
    }

    if (key.includes("root_date")) {
      const obj = jsonParse(newFormData?.date);
      const startDate = moment(obj.startDate, "YYYY-MM-DD");
      const endDate = moment(obj.endDate, "YYYY-MM-DD");
      const differenceInDays = endDate.diff(startDate, "days");
      if (differenceInDays > 4) {
        const newErrors = {
          date: {
            __errors: [t("SELECT_DATE_ERROR_MESSAGE")],
          },
        };
        errorsObj = { ...(errorsObj || {}), ...newErrors };
      }
    }

    if (returnError) {
      return errorsObj;
    } else {
      setErrors(errorsObj);
    }
  };

  const onChange = async (data, id) => {
    setErrors({});
    const newData = data.formData;
    setFormData({ ...formData, ...newData });
    if (id === "root_type") {
      setSelectedRowIds([]);
    }
    if (newData?.end_date) {
      if (
        moment.utc(newData?.start_date).isAfter(moment.utc(newData?.end_date))
      ) {
        const newErrors = {
          end_date: {
            __errors: [t("EVENT_CREATE_END_DATE_GREATERE_THAN_START_DATE")],
          },
        };
        setErrors(newErrors);
      }
    }
    if (id === "root_start_time") {
      checkValidation(newData, [id]);
    } else if (id === "root_end_time") {
      checkValidation(newData, [id]);
    } else if (id === "root_date") {
      checkValidation(newData, [id]);
    }
  };

  const onSubmit = async (data) => {
    let newFormData = data?.formData;
    const resultValidation = checkValidation(
      newFormData,
      ["root_date", "root_start_time", "root_end_time"],
      true
    );

    if (!resultValidation) {
      if (Object.keys(errors || {}).length === 0) {
        setIsDisabled(true);
        setFormData(newFormData);
        const { startDate, endDate } = JSON.parse(newFormData.date || "{}");
        const obj = {
          ...newFormData,
          start_date: moment(startDate).format("YYYY-MM-DD"),
          end_date: moment(endDate).format("YYYY-MM-DD"),
          attendees: selectedRowId,
        };
        if (step === "edit") {
          const data = await eventService.updateEvent(id, obj);
          if (data?.success === true) {
            setIsDisabled(false);
            navigate(`/admin/event/${data?.data?.events?.id}`);
          } else {
            const newErrors = {
              [["start_date", "end_date"].includes(data?.key)
                ? "date"
                : ["start_time", "end_time"].includes(data?.key)
                ? data?.key
                : "name"]: {
                __errors: [t(data?.message)],
              },
            };
            setErrors(newErrors);
            toast.show({
              render: () => {
                return (
                  <Alert status="error" alignItems={"start"} mb="3" mt="4">
                    <HStack alignItems="center" space="2" color>
                      <Alert.Icon />
                      <BodyMedium>{data?.message}</BodyMedium>
                    </HStack>
                  </Alert>
                );
              },
            });
          }
        } else {
          const apiResponse = await eventService.createNewEvent(obj);
          if (apiResponse?.success === true) {
            setIsDisabled(false);
            toast.show({
              render: () => {
                return (
                  <Alert status="success" alignItems={"start"} mb="3" mt="4">
                    <HStack alignItems="center" space="2" color>
                      <Alert.Icon />
                      <BodyMedium>{t("EVENT_CREATED_SUCCESSFULLY")}</BodyMedium>
                    </HStack>
                  </Alert>
                );
              },
            });

            navigate(`/admin`);
          } else {
            const newErrors = {
              name: {
                __errors: [t(apiResponse?.message)],
              },
            };
            setErrors(newErrors);
            toast.show({
              render: () => {
                return (
                  <Alert status="error" alignItems={"start"} mb="3" mt="4">
                    <HStack alignItems="center" space="2" color>
                      <Alert.Icon />
                      <BodyMedium>{apiResponse?.message}</BodyMedium>
                    </HStack>
                  </Alert>
                );
              },
            });
          }
        }
      } else {
        setIsDisabled(false);
      }
    } else {
      setErrors(resultValidation);
    }
  };

  const transformErrors = (errors, uiSchema) => {
    return errors?.map((error) => {
      if (error.name === "required") {
        if (schema?.properties?.[error?.property]?.title) {
          error.message = `${t("REQUIRED_MESSAGE")} "${t(
            schema?.properties?.[error?.property]?.title
          )}"`;
        } else {
          error.message = `${t("REQUIRED_MESSAGE")}`;
        }
      } else if (error.name === "enum") {
        error.message = `${t("SELECT_MESSAGE")}`;
      } else if (error.name === "format") {
        const { format } = error?.params || {};
        let message = "REQUIRED_MESSAGE";
        if (format === "email") {
          message = "PLEASE_ENTER_VALID_EMAIL";
        }
        if (format === "string") {
          message = "PLEASE_ENTER_VALID_STREING";
        } else if (format === "number") {
          message = "PLEASE_ENTER_VALID_NUMBER";
        }

        if (schema?.properties?.[error?.property]?.title) {
          error.message = `${t(message)} "${t(
            schema?.properties?.[error?.property]?.title
          )}"`;
        } else {
          error.message = `${t(message)}`;
        }
      }
      return error;
    });
  };
  const handleSearch = (e) => {
    setFilter({ ...filter, search: e.nativeEvent.text, page: 1 });
  };
  const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), []);

  const updateSelected = async () => {
    const obj = {
      formData,
      attendees: selectedRowId,
    };
    if (step) {
      const data = await eventService.updateEvent(id, obj);
      if (data?.success === true) {
        setIsDisabled(true);
        navigate(`/admin/event/${id}`);
      }
    }
  };
  return (
    <Layout
      _sidebar={footerLinks}
      // loading={loading}
    >
      <VStack p={4}>
        <HStack
          pt="3"
          justifyContent={"space-between"}
          direction={["column", "row", "row"]}
          space={2}
        >
          <HStack alignItems={"center"} space={2} flexWrap={"wrap"}>
            <IconByName name="home" size="md" />
            <AdminTypo.H1 color="Activatedcolor.400">{t("HOME")}</AdminTypo.H1>
            <IconByName
              size="sm"
              name="ArrowRightSLineIcon"
              p="0"
              onPress={(e) => navigate(`/admin`)}
            />
            <AdminTypo.H1
              color="textGreyColor.800"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {t("SCHEDULE_EVENT")}
            </AdminTypo.H1>
          </HStack>

          {step === "candidate" && (
            <AdminTypo.Secondarybutton onPress={updateSelected}>
              {t("SAVE_EVENT")}
            </AdminTypo.Secondarybutton>
          )}
        </HStack>

        <HStack
          pt={6}
          space={4}
          justifyContent={"space-between"}
          direction={["column", "column", "row"]}
        >
          {step !== "candidate" && (
            <VStack
              flex={["auto", "auto", "30"]}
              background={"whiteSomke"}
              p={4}
            >
              <Form
                ref={formRef}
                extraErrors={errors}
                showErrorList={false}
                noHtml5Validate={true}
                {...{
                  widgets,
                  templates,
                  validator,
                  schema: schema,
                  uiSchema,
                  formData,
                  onChange,
                  onSubmit,
                  transformErrors,
                }}
              >
                <AdminTypo.PrimaryButton
                  isDisabled={isDisabled}
                  mt="4"
                  onPress={() => {
                    formRef?.current?.submit();
                  }}
                >
                  {step === "edit" ? t("SAVE_EVENT") : t("SCHEDULE_EVENT")}
                </AdminTypo.PrimaryButton>
              </Form>
            </VStack>
          )}
          <VStack
            flex={["auto", "auto", "70"]}
            display={step !== "candidate" && ["none", "none", "flex"]}
            bg={isListOpen ? "zambezi" : "whiteSomke"}
            p={[0, 0, "4"]}
            justifyContent={isListOpen && "center"}
          >
            {isListOpen ? (
              <VStack p={4}>
                <AdminTypo.Secondarybutton onPress={handleOpenButtonClick}>
                  {t("SELECT_CANDIDATE")}
                </AdminTypo.Secondarybutton>
              </VStack>
            ) : (
              <VStack background={"whiteSomke"}>
                <HStack
                  p={[2, 2, 0]}
                  space={4}
                  flexWrap={"wrap"}
                  direction={["column", "column", "column", "row", "row"]}
                >
                  <Input
                    minH="32px"
                    InputLeftElement={
                      <IconByName color="coolGray.500" name="SearchLineIcon" />
                    }
                    placeholder={t("SEARCH_BY_NAME")}
                    variant="outline"
                    onChange={debouncedHandleSearch}
                  />
                  <HStack space={4} alignItems={"center"}>
                    <AdminTypo.H4 bold>{t("FILTERS")}:-</AdminTypo.H4>
                    <HStack space={4} alignItems={"center"}>
                      <District
                        district={district}
                        filter={filter}
                        t={t}
                        setFilter={setFilter}
                      />

                      <Blocks
                        block={block}
                        t={t}
                        filter={filter}
                        setFilter={setFilter}
                      />
                      {programData === "BIHAR" && (
                        <Village
                          village={village}
                          t={t}
                          filter={filter}
                          setFilter={setFilter}
                        />
                      )}
                    </HStack>
                  </HStack>
                </HStack>
                <Stack alignSelf={"end"} pb={2} pr={4}>
                  <AdminTypo.H6 bold color="textBlue.200">
                    {`${t("ADD_SELECTED")} (${selectedRowId?.length ?? 0})`}
                  </AdminTypo.H6>
                </Stack>
                <DataTable
                  columns={columns(t, handleCheckboxChange, selectedRowId)}
                  data={data}
                  customStyles={customStyles}
                  persistTableHead
                  // selectableRows
                  progressPending={loading}
                  pagination
                  paginationServer
                  // onSelectedRowsChange={handleCheckboxChange}
                  paginationTotalRows={paginationTotalRows}
                  onChangeRowsPerPage={(e) => {
                    setFilter({ ...filter, limit: e, page: 1 });
                  }}
                  onChangePage={(e) => {
                    setFilter({ ...filter, page: e });
                  }}
                />
              </VStack>
            )}
          </VStack>
        </HStack>
      </VStack>
    </Layout>
  );
}

const District = ({ district, filter, t, setFilter }) => {
  const handleSelectAll = () => {
    const { districts, blocks, village, ...data } = filter;
    setFilter(data);
  };

  return (
    <Menu
      shadow={2}
      trigger={(triggerProps) => {
        return (
          <Pressable accessibilityLabel="More options menu" {...triggerProps}>
            <HStack space={4}>
              <AdminTypo.H4>
                {filter?.districts ? filter?.districts : t("DISTRICT")}
              </AdminTypo.H4>
              <IconByName name="ArrowDownSLineIcon" />
            </HStack>
          </Pressable>
        );
      }}
    >
      <Menu.Item key="selectAll" onPress={handleSelectAll}>
        Select All
      </Menu.Item>
      {district &&
        district.map &&
        district.map((e) => (
          <Menu.Item
            key={e.district_id}
            onPress={() =>
              setFilter((prevFilter) => ({
                ...prevFilter,
                districts: [e.district_name],
              }))
            }
          >
            {e.district_name}
          </Menu.Item>
        ))}
    </Menu>
  );
};
const Blocks = ({ block, filter, t, setFilter }) => {
  const handleSelectAll = () => {
    const { blocks, village, ...data } = filter;
    setFilter(data);
  };
  return (
    <Menu
      shadow={2}
      trigger={(triggerProps) => {
        return (
          <Pressable accessibilityLabel="More options menu" {...triggerProps}>
            <HStack space={4}>
              <AdminTypo.H4>
                {filter?.blocks ? filter?.blocks : t("BLOCK")}
              </AdminTypo.H4>
              <IconByName name="ArrowDownSLineIcon" />
            </HStack>
          </Pressable>
        );
      }}
    >
      <Menu.Item key="selectAll" onPress={handleSelectAll}>
        Select All
      </Menu.Item>
      {block &&
        block?.map &&
        block?.map((e) => (
          <Menu.Item
            key={e?.block_name}
            onPress={() =>
              setFilter((prevFilter) => ({
                ...prevFilter,
                blocks: [e?.block_name],
              }))
            }
          >
            {e?.block_name}
          </Menu.Item>
        ))}
    </Menu>
  );
};

const Village = ({ village, filter, t, setFilter }) => {
  const handleSelectAll = () => {
    const { village, ...data } = filter;
    setFilter(data);
  };
  return (
    <Menu
      shadow={2}
      trigger={(triggerProps) => {
        return (
          <Pressable accessibilityLabel="More options menu" {...triggerProps}>
            <HStack space={4}>
              <AdminTypo.H4>
                {filter?.villages ? filter?.villages : t("VILLAGE_WARD")}
              </AdminTypo.H4>
              <IconByName name="ArrowDownSLineIcon" />
            </HStack>
          </Pressable>
        );
      }}
    >
      <Menu.Item key="selectAll" onPress={handleSelectAll}>
        Select All
      </Menu.Item>
      {village?.map((e) => (
        <Menu.Item
          key={e?.block_id}
          onPress={() =>
            setFilter((prevFilter) => ({
              ...prevFilter,
              villages: [e?.village_ward_name],
            }))
          }
        >
          {e?.village_ward_name}
        </Menu.Item>
      ))}
    </Menu>
  );
};

EventHome.propTypes = {
  footerLinks: PropTypes.any,
};

District.propTypes = {
  district: PropTypes.string,
  setFilter: PropTypes.array,
};

Blocks.propTypes = {
  district: PropTypes.string,
  setFilter: PropTypes.array,
};
Village.propTypes = {
  district: PropTypes.string,
  setFilter: PropTypes.array,
};
