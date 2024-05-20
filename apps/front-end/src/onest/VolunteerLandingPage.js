import { HStack, Heading, Image, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dataConfig } from "./card";
import Layout from "./Layout";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { chunk } from "@shiksha/common-lib";

const VolunteerLandingPage = ({ userTokenInfo }) => {
  const [dataArray, setDataArray] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const chuckArr = Object.values(dataConfig);
    const newArr = chunk(chuckArr, 2);
    setDataArray(newArr);
  }, []);

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

  const FeatureCard = ({ title, onClick, imageUrl, ...props }) => {
    return (
      <VStack
        p="6"
        borderWidth="1px"
        borderColor="gray.300"
        borderRadius="10px"
        alignItems="center"
        textAlign="center"
        shadow="4"
        onClick={onClick}
        cursor="pointer"
        {...props}
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            source={{ uri: imageUrl }}
            alt={title}
            mb="4"
            size={"lg"}
            height={"74px"}
            width={"74px"}
            color={"black"}
          />
        )}
        <Heading as="h2" size="md" mb="2" fontSize={"16px"} fontWeight={"500"}>
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

  const handleBack = () => {
    navigate(`/`);
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton: handleBack,
      }}
    >
      <VStack p="4" space={4}>
        {dataConfig.constructor.name === "Object" &&
          dataArray?.map((pItem) => (
            <HStack space={"6%"}>
              {pItem.map((item) => {
                return (
                  <FeatureCard
                    key={item}
                    title={item?.title}
                    onClick={() => handleCardClick(item?.listLink)}
                    imageUrl={item?.imageUrl}
                    width={"47%"}
                    height={"152px"}
                  />
                );
              })}
            </HStack>
          ))}
      </VStack>
    </Layout>
  );
};

export default VolunteerLandingPage;
