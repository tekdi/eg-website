import { Box, Flex, Heading, Image, VStack } from "native-base";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dataConfig } from "./card";
import Layout from "./Layout";
import moment from "moment";
import { useTranslation } from "react-i18next";

const VolunteerLandingPage = ({ userTokenInfo }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
        phone: authUser?.mobile,
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
      <VStack
        p="6"
        borderWidth="1px"
        borderColor="gray.300"
        borderRadius="lg"
        alignItems="center"
        textAlign="center"
        shadow="4"
        onClick={onClick}
        cursor="pointer"
      >
        {imageUrl && <Image src={imageUrl} mb="4" />}
        <Heading as="h2" size="md" mb="2">
          {t(title) || "Untitled"}
        </Heading>
      </VStack>
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
      <VStack p="4" flexWrap="wrap" justifyContent="center" space={4}>
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
      </VStack>
    </Layout>
  );
};

export default VolunteerLandingPage;
