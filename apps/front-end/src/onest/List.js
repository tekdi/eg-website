import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Input,
  Modal,
  Pressable,
  Select,
  Text,
  VStack,
} from "native-base";
import { useNavigate, useParams } from "react-router-dom";
import { dataConfig } from "./card";
import axios from "axios";
import Layout from "./Layout";
import { FrontEndTypo } from "@shiksha/common-lib";

const List = () => {
  const [cardData, setCardData] = useState();
  const [filterCardData, setFilterCardData] = useState();
  const [filterData, setfilterData] = useState();
  const [config, setConfig] = useState();
  const { type } = useParams();
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [filter, setFilter] = useState();

  useEffect(() => {
    const fetchJobsData = async () => {
      try {
        let response;
        const configData = dataConfig[type] || {};
        setConfig(configData);
        const apiUrl = configData?.apiLink;
        response = await axios.post(apiUrl, configData?.payload || {});
        if (configData.apiResponce) {
          response = configData.apiResponce(response);
        }
        if (response) {
          setCardData(response);
          setFilterCardData(response);
          setfilterData(filterToData(configData?.filters, response));
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchJobsData();
  }, []);

  useEffect(() => {
    const fethcData = () => {
      let filterData = cardData;
      if (filter) {
        filterData = cardData.filter((item) => {
          let resp = [];
          const filKeys = Object.keys(filter || {});
          filKeys.forEach((key) => {
            resp = [
              ...resp,
              filter[key] === ""
                ? true
                : item?.[key]
                    ?.toLowerCase()
                    .includes(filter[key]?.toLowerCase()),
            ];
          });
          return resp.filter((e) => e).length === filKeys?.length;
        });
      }
      setFilterCardData(filterData);
    };
    fethcData();
  }, [filter]);

  const handleFilter = (key, value) => {
    console.log(key, value);
    setFilter((e) => ({
      ...e,
      [key]: value,
    }));
  };

  const handleOpenModal = () => {
    setShowFiltersModal(true);
  };

  return (
    <Layout>
      <Box p="4">
        <HStack justify="space-between" align="center" mb="4">
          <Input
            flex={11}
            type="text"
            placeholder="Search by name..."
            onChange={(e) =>
              handleFilter(config?.searchByKey || "title", e.target.value)
            }
          />
          <FrontEndTypo.Primarybutton
            flex="1"
            colorScheme="gray"
            onPress={handleOpenModal}
            ml={1}
          >
            Filters
          </FrontEndTypo.Primarybutton>
        </HStack>
        <Modal
          isOpen={showFiltersModal}
          onClose={(e) => setShowFiltersModal(false)}
        >
          <Modal.Content m={2}>
            <Modal.Header>Apply Filters</Modal.Header>
            <Modal.CloseButton />
            <Modal.Body>
              {filterData &&
                Object.entries(filterData)?.map(([heading, options]) => {
                  return (
                    <Box key={heading} mb="4">
                      <Heading size="sm" mb="2">
                        {heading}
                      </Heading>
                      {Array.isArray(options) && (
                        <Select
                          placeholder={`Select ${heading}`}
                          onValueChange={(value) =>
                            handleFilter(heading, value)
                          }
                          value={filter?.[heading] || ""}
                        >
                          {options?.map(
                            (option) =>
                              option.constructor.name == "String" && (
                                <Select.Item
                                  key={option}
                                  value={option}
                                  label={option}
                                  _text={{ fontSize: 12, fontWeight: 500 }}
                                />
                              )
                          )}
                        </Select>
                      )}
                    </Box>
                  );
                })}
            </Modal.Body>
            <Modal.Footer>
              <Button
                colorScheme="gray"
                onPress={(e) => setShowFiltersModal(false)}
              >
                Apply
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
        <VStack flexWrap="wrap" space={4}>
          {filterCardData?.map((e) => (
            <RenderCards key={e} obj={e} config={config} />
          ))}
        </VStack>
      </Box>
    </Layout>
  );
};

const RenderCards = ({ obj, config }) => {
  const navigate = useNavigate();
  return (
    <Pressable
      p="4"
      borderWidth="1px"
      borderRadius="md"
      onPress={(e) => {
        if (obj?.detailLink) {
          navigate(replaceUrlParam(config?.detailLink, obj));
        } else {
          if (obj?.id) {
            navigate(`/${config?.listLink}/${obj?.item_id}`);
          }
        }
      }}
    >
      {config?.render ? (
        config.render(obj)
      ) : (
        <Box>
          <Heading as="h2" size="md" mb="2">
            {obj?.title}
          </Heading>
          <Text fontSize="md">{obj?.description}</Text>
        </Box>
      )}
    </Pressable>
  );
};

const replaceUrlParam = (url, object) => {
  const param = url.match(/:(\w+)/)[1]; // Extract the parameter name
  return url.replace(`:${param}`, object[param]);
};

const filterToData = (data, arr) => {
  let result = {};
  arr.forEach((item) => {
    data.forEach((key) => {
      if (item?.[key]) {
        const countData = result?.[key]?.indexOf(item?.[key]);
        if (!countData || countData < 1) {
          result = { ...result, [key]: [...(result[key] || []), item?.[key]] };
        }
      }
    });
  });
  return result;
};

export default List;
