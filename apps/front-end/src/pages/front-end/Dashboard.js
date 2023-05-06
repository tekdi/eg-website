import {
  BodySmall,
  facilitatorRegistryService,
  H2,
  IconByName,
  Layout,
  t,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/Chip";
import { HStack, Pressable, VStack } from "native-base";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ userTokenInfo }) {
  const [facilitator, setFacilitator] = React.useState({});
  const navigate = useNavigate();
  const { form_step_number } = facilitator;

  React.useEffect(async () => {
    if (userTokenInfo) {
      const fa_id = localStorage.getItem("id");
      const fa_data = await facilitatorRegistryService.getOne({ id: fa_id });
      setFacilitator(fa_data);
    }
  }, []);
  return (
    <Layout>
      <VStack space="5">
        <HStack
          p="5"
          space="5"
          borderBottomWidth="1"
          borderBottomColor={"gray.300"}
        >
          <IconByName
            isDisabled
            name="FileCopyLineIcon"
            _icon={{ size: "40px" }}
          />
          <VStack>
            <H2>{t("APPLICATION_UNDER_REVIEW")}</H2>
            <BodySmall>{t("MEANWHILE_PROFILE")}</BodySmall>
          </VStack>
        </HStack>
        <VStack p="5" space="5">
          {!form_step_number ||
          (form_step_number && parseInt(form_step_number) < 13) ? (
            <Pressable onPress={(e) => navigate("/form")}>
              <HStack
                borderWidth="1"
                p="5"
                rounded="full"
                justifyContent="center"
              >
                <H2>{t("COMPLETE_FORM")}</H2>
              </HStack>
            </Pressable>
          ) : (
            <React.Fragment />
          )}
          <ChipStatus
            status={facilitator?.status}
            flex="1"
            py="5"
            rounded="full"
            _text={{ textAlign: "center", textTransform: "capitalize" }}
            justifyContent="center"
          />
        </VStack>
      </VStack>
    </Layout>
  );
}
