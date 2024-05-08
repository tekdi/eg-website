import { Box, Flex, Heading, Image } from "native-base";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dataConfig } from "./card";
import Layout from "./Layout";
import moment from "moment";

const VolunteerLandingPage = ({ userTokenInfo }) => {
  const navigate = useNavigate();

  useEffect((e) => {
    const fetchData = () => {
      const { authUser } = userTokenInfo;
      const Address = [
        authUser?.state,
        authUser?.district,
        authUser?.block,
        authUser?.village,
        authUser?.grampanchayat,
      ]
        .filter((e) => e)
        .join(", ");
      const userDetails = {
        "Student Name": authUser?.first_name + " " + authUser?.last_name,
        name: authUser?.first_name + " " + authUser?.last_name,
        email: authUser?.email_id || `${authUser?.first_name}@gmail.com`,
        "Date Of Birth": authUser?.dob,
        birth_date: authUser?.dob,
        "mobile number": authUser?.mobile,
        contact: authUser?.mobile,
        Address,
        createdAt: moment().format("YYYY-MM-DD HH:mm"),
        user_id: authUser?.id,
      };
      localStorage.setItem("userData", JSON.stringify(userDetails));
    };
    fetchData();
  }, []);

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

export default VolunteerLandingPage;
