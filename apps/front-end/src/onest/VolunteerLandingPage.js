import { chunk } from "@shiksha/common-lib";
import moment from "moment";
import { HStack, VStack } from "native-base";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dataConfig } from "./card";
import Layout from "./Layout";
import { FeatureCard } from "./LandingPage";

const VolunteerLandingPage = ({ userTokenInfo: { authUser }, footerLinks }) => {
  const [dataArray, setDataArray] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const chuckArr = Object.values(dataConfig);
    const newArr = chunk(chuckArr, 2);
    setDataArray(newArr);
  }, []);

  useEffect((e) => {
    const fetchData = () => {
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
        "Education Qualification":
          authUser?.qualifications?.qualification_master?.name || "",
        gender: authUser?.gender || "",
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
  VolunteerLandingPage.propTypes = {
    userTokenInfo: PropTypes.any,
    footerLinks: PropTypes.any,
  };

  const handleCardClick = async (title) => {
    try {
      navigate(`/${title}`);
    } catch (error) {
      console.error(`Error fetching data for ${title}:`, error);
    }
  };

  // handleBack
  const handleBack = () => {
    navigate(`/`);
  };

  return (
    <Layout
      _footer={{ menues: footerLinks }}
      userAccess
      _appBar={{
        onPressBackButton: handleBack,
      }}
      facilitator={{
        ...authUser,
        program_faciltators: authUser?.user_roles?.[0],
      }}
    >
      <VStack p="4" space={4}>
        {dataArray?.map((pItem) => (
          <HStack space={"6%"} key={pItem}>
            {pItem.map((item) => {
              return (
                <FeatureCard
                  imageUrl={item?.imageUrl}
                  onClick={() => handleCardClick(item?.listLink)}
                  height={"180px"}
                  width={"47%"}
                  title={item?.title}
                  key={item}
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
