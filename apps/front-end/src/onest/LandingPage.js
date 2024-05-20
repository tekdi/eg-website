import { Heading, Image, VStack } from "native-base";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { dataConfig } from "./card";

const LandingPage = ({ userTokenInfo }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  const handleBack = () => {
    navigate(`/`);
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton: handleBack,
      }}
    >
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

export default LandingPage;
