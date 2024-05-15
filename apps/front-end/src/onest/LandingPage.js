import { Box, Flex, Heading, Image } from "native-base";
import React from "react";
import { useNavigate } from "react-router-dom";
import { dataConfig } from "./card";
import Layout from "./Layout";

const LandingPage = () => {
  const navigate = useNavigate();

  const FeatureCard = ({ title, onClick, imageUrl }) => {
    return (
      <Flex
        p="6"
        bg="white"
        borderWidth="1px"
        borderRadius="lg"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        boxShadow="md"
        width="300px"
        onClick={onClick}
        cursor="pointer"
        mb="8"
        mr="4"
        ml="4"
      >
        {imageUrl && <Image src={imageUrl} mb="4" />}
        <Heading as="h2" size="md" mb="2">
          {title || "Untitled"}
        </Heading>
      </Flex>
    );
  };

  const handleCardClick = async (title) => {
    try {
      navigate(`/${title}`);
    } catch (error) {
      console.error(`Error fetching data for ${title}:`, error);
    }
  };

  return (
    <Layout>
      <Box p="4">
        <Flex flexWrap="wrap" justifyContent="center">
          {dataConfig.constructor.name === "Object" &&
            Object.values(dataConfig).map((item) => {
              return (
                <FeatureCard
                  key={item}
                  title={item?.title}
                  onClick={() => handleCardClick(item?.listLink)}
                  imageUrl={item?.imageUrl}
                />
              );
            })}
        </Flex>
      </Box>
    </Layout>
  );
};

export default LandingPage;
