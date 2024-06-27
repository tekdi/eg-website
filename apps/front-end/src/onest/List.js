import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  HStack,
  Heading,
  IconButton,
  Image,
  Input,
  Modal,
  Pressable,
  ScrollView,
  Select,
  Text,
  VStack,
} from "native-base";
import { useNavigate, useParams } from "react-router-dom";
import { dataConfig } from "./card";
import axios from "axios";
import Layout from "./Layout";
import { FrontEndTypo, IconByName, Loading } from "@shiksha/common-lib";
// import InfiniteScroll from "react-infinite-scroll-component";
import { convertToTitleCase } from "v2/utils/Helper/JSHelper";
import { useTranslation } from "react-i18next";
const limit = 6;
const List = ({ userTokenInfo: { authUser }, footerLinks }) => {
  const [cardData, setCardData] = useState();
  const [filterCardData, setFilterCardData] = useState();
  const [filterData, setfilterData] = useState();
  const [config, setConfig] = useState();
  const { type } = useParams();
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [filter, setFilter] = useState();
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  // const [loadingHeight, setLoadingHeight] = useState(0);
  const ref = useRef(null);
  const [bodyHeight, setBodyHeight] = useState(0);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   if (ref?.current?.clientHeight >= 0 && bodyHeight >= 0) {
  //     setLoadingHeight(bodyHeight - ref?.current?.clientHeight);
  //   } else {
  //     setLoadingHeight(bodyHeight);
  //   }
  // }, [bodyHeight, ref]);

  useEffect(() => {
    const fetchJobsData = async () => {
      setLoading(t("FETCHING_THE_DETAILS"));
      try {
        let response;
        const configData = dataConfig[type] || {};
        setConfig(configData);
        response = await axios.post(
          configData?.apiLink_API_LIST_URL ||
            `${configData?.apiLink_API_BASE_URL}/content/search`,
          configData?.payload || {}
        );
        if (configData.apiResponse) {
          response = configData.apiResponse(response);
        }
        if (response) {
          setCardData(response);
          setFilterCardData(
            paginateArray({
              data: response,
              filter: { page, limit, ...filter },
            })
          );
          setfilterData(filterToData(configData?.filters, response));
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobsData();
  }, []);

  useEffect(() => {
    const fethcData = () => {
      setFilterCardData(
        paginateArray({ data: cardData, filter: { page, limit, ...filter } })
      );
    };
    fethcData();
  }, [filter]);

  useEffect(() => {
    const fethcData = () => {
      setFilterCardData((e) => [
        // ...e,
        ...paginateArray({
          data: cardData,
          filter: { page, limit, ...filter },
        }),
      ]);
    };
    fethcData();
  }, [page, limit]);

  const handleFilter = (key, value) => {
    setFilter((e) => ({
      ...e,
      [key]: value,
    }));
  };

  const handleOpenModal = () => {
    setShowFiltersModal(true);
  };

  const fetchData = (numData) => {
    // Simulating fetching data from an API
    // In real application, replace this with actual API call

    // Increment page number
    const newPage = page + numData;
    setPage(newPage);

    // Update state with new data
    // setFilterCardData((e) => [
    //   ...(e || []),
    //   ...paginateArray({ data: cardData, filter }),
    // ]);

    // In this example, let's assume we have only 5 pages of data
    if (newPage >= Math.ceil(cardData?.length / limit)) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  };

  const removeFilter = (val) => {
    const { [val]: _, ...otherData } = filter;
    setFilter(otherData);
  };

  const handleBack = () => {
    navigate(`/onest`);
  };

  const getWarningMessage = () => {
    const warningKey = cardData?.length
      ? "NO_data_available"
      : {
          scholarship: "NO_SCHOLARSHIPS_FROM_PROVIDER",
          jobs: "NO_JOBS_FROM_PROVIDER",
          learning: "NO_LEARNING_EXPERIENCES_FROM_PROVIDER",
        }[type] || "NO_data_available";
    return t(warningKey);
  };

  if (loading) {
    return <Loading message={loading} />;
  }

  return (
    <Layout
      checkUserAccess
      _footer={{ menues: footerLinks }}
      facilitator={{
        ...authUser,
        program_faciltators: authUser?.user_roles?.[0],
      }}
      getBodyHeight={(e) => setBodyHeight(e)}
      _appBar={{
        onPressBackButton: handleBack,
      }}
    >
      <HStack justify="space-between" align="center" p="4" ref={ref}>
        <Input
          flex={11}
          type="text"
          placeholder="Search by name..."
          onChange={(e) =>
            handleFilter(config?.searchByKey || "title", e.target.value)
          }
          InputRightElement={
            <IconByName
              color="grey.100"
              name="SearchLineIcon"
              marginRight={2}
            />
          }
        />
        {config?.filters &&
          Array.isArray(config?.filters) &&
          config?.filters?.length > 0 && (
            <IconByName name="EqualizerFillIcon" onPress={handleOpenModal} />
          )}
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
                      {convertToTitleCase(heading)}
                    </Heading>
                    {Array.isArray(options) && (
                      <Select
                        placeholder={`Select ${convertToTitleCase(heading)}`}
                        onValueChange={(value) => handleFilter(heading, value)}
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
      {filter !== undefined && Object.keys(filter).length > 0 && (
        <ScrollView horizontal={true} p={4}>
          {Object.keys(filter)
            .filter((e) => e !== (config?.searchByKey || "title"))
            .map((fil, i) => {
              return (
                <Button
                  key={`filter-button-${fil}`}
                  endIcon={
                    <IconByName
                      name="CloseCircleFillIcon"
                      size="sm"
                      color={"gray.500"}
                      onClick={() => removeFilter(fil)}
                    />
                  }
                  backgroundColor={"blueGray.300"}
                  height={"36px"}
                  marginRight={"8px"}
                >
                  <Text color="gray.500">{filter[fil]}</Text>
                </Button>
              );
            })}
        </ScrollView>
      )}
      <Text p={4} fontSize={"16px"} fontWeight={"500"}>
        {t(dataConfig[type].title)}
      </Text>
      <VStack flexWrap="wrap" space={4}>
        {/* <InfiniteScroll
          dataLength={filterCardData?.length || 0}
          next={fetchData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={<p>No more items</p>}
          minHeight={"300px"}
          gap="10px"
        > */}
        <VStack space="4" alignContent="center" p="4">
          {filterCardData?.length ? (
            filterCardData?.map((e) => (
              <RenderCards key={e} obj={e} config={config} />
            ))
          ) : (
            <FrontEndTypo.H2>{getWarningMessage()}</FrontEndTypo.H2>
          )}
          {/* </InfiniteScroll> */}
          {hasMore && filterCardData?.length > 0 && (
            <FrontEndTypo.Primarybutton onPress={(e) => fetchData(1)}>
              {t("NEXT")}
            </FrontEndTypo.Primarybutton>
          )}
          {page > 1 && filterCardData?.length > 0 && (
            <FrontEndTypo.Primarybutton onPress={(e) => fetchData(-1)}>
              {t("BACK")}
            </FrontEndTypo.Primarybutton>
          )}
        </VStack>
      </VStack>
    </Layout>
  );
};

const RenderCards = ({ obj, config }) => {
  const navigate = useNavigate();
  return (
    <Pressable
      width={"100%"}
      p="6"
      borderWidth="1px"
      borderColor="gray.300"
      borderRadius="10px"
      backgroundColor="#246DDC1A"
      shadow="4"
      cursor="pointer"
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
        <VStack space={4}>
          {obj?.image_url && (
            <Image
              alignSelf={"center"}
              source={{ uri: obj?.image_url }}
              size={"lg"}
              src={obj?.image_url}
              alt={"no IMAGE"}
            />
          )}
          <Text fontSize={"16px"} fontWeight={500}>
            {obj?.title}
          </Text>
          {obj?.provider_name && (
            <Text
              color="gray.700"
              marginTop={"3"}
              fontWeight={600}
              fontSize={["sm", "md"]}
            >
              <strong>Published By:</strong> {obj?.provider_name}
            </Text>
          )}
          <Text
            color="gray.700"
            fontSize={["xs", "sm"]}
            marginLeft={0.5}
            textOverflow="ellipsis"
          >
            <strong>Description</strong>
            <div
              dangerouslySetInnerHTML={{
                __html: obj.shortDescription
                  ? obj.shortDescription
                  : obj.description
                  ? obj.description.substring(0, 100) + "..."
                  : "",
              }}
            />
          </Text>
        </VStack>
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
  arr?.forEach((item) => {
    data?.forEach((key) => {
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

const paginateArray = ({ data, filter }) => {
  const paginatedArrays = [];
  let currentPage = [];
  const { limit, page, ...filterObj } = filter;
  let dataArray = filterData({ data, filter: filterObj });
  dataArray?.forEach((item) => {
    if (currentPage.length === limit) {
      paginatedArrays.push([...currentPage]);
      currentPage = [];
    }
    currentPage.push(item);
  });

  if (currentPage.length > 0) {
    paginatedArrays.push([...currentPage]);
  }

  const currentPageNumber = Math.min(Math.max(1, page), paginatedArrays.length);
  return paginatedArrays[currentPageNumber - 1] || [];
  return {
    currentPage: currentPageNumber,
    paginatedArray: paginatedArrays[currentPageNumber - 1],
  };
};

const filterData = ({ data, filter }) => {
  if (!data && !Array.isArray(data)) {
    return [];
  }
  return data.filter((item) => {
    let resp = [];
    const filKeys = Object.keys(filter || {});
    filKeys?.forEach((key) => {
      resp = [
        ...resp,
        filter[key] === ""
          ? true
          : item?.[key]?.toLowerCase().includes(filter[key]?.toLowerCase()),
      ];
    });
    return resp.filter((e) => e).length === filKeys?.length;
  });
};

export default List;
