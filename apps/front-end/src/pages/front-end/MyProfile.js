import React from "react";

import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "../parts/schema.js";
import {
  Alert,
  Box,
  Button,
  Center,
  HStack,
  Image,
  Modal,
  Radio,
  Stack,
  VStack,Text,Divider
} from "native-base";
import CustomRadio from "../../component/CustomRadio";
import Steper from "../../component/Steper";
import {
  facilitatorRegistryService,
  geolocationRegistryService,
  Camera,
  Layout,
  H1,
  t,
  login,
  H3,
  IconByName,
  BodySmall,
  filtersByObject,
  H2,
  getBase64,
  BodyMedium,
  changeLanguage
} from "@shiksha/common-lib";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Clipboard from "component/Clipboard.js";
import {
  TitleFieldTemplate,
  DescriptionFieldTemplate,
  FieldTemplate,
  ObjectFieldTemplate,
  ArrayFieldTitleTemplate,
} from "../../component/BaseInput";





export default function MyProfile ()
{
  const navigate = useNavigate();
return (
  
    <>
    <Box >
    <VStack alignItems="Center" display="flex" paddingTop="5">
        <IconByName name="AccountCircleLineIcon" 
         color="#666666" 
         _icon={{ size: "60" }}  />
        <Text color="#666666" fontFamily="Inter" fontStyle="normal">Rachana Wagh</Text>

        </VStack>
        <HStack justifyContent="space-between" display="flex" paddingLeft="18" paddingRight="18" paddingTop="5">
            <VStack>
                <Box >
                <Text fontSize="16px" color="#666666" fontWeight="500" fontFamily="Inter" fontStyle="normal">Complete Your Profile</Text>
                <Text fontSize="10px" color="#666666" fontWeight="400" fontFamily="Inter" fontStyle="normal">Need to complete this before orientation</Text>
                </Box>
                </VStack>
            <Button display="flex" flexDirection="row" fontWeight="400" color="#222222" fontFamily="Inter" fontStyle="normal" onPress={() => {
                  navigate(`/myprofile/myprofiledashboard`);
                }}>Edit</Button>
                
            
        </HStack>
        <Box paddingTop="5" paddingLeft="18" paddingRight="18" paddingBottom="10">
        <Divider orientation="horizontal"  bg="#666666" thickness="1"></Divider>
        </Box>
        </Box>
        <VStack alignItems="Center" paddingTop="5" space="4"  >
          <Text fontSize="16px" color="#666666" fontWeight="500" fontFamily="Inter" fontStyle="normal">My IP</Text>
        <Text fontSize="16px" color="#666666" fontWeight="500" fontFamily="Inter" fontStyle="normal">About Pragati</Text>
        <Text fontSize="16px" color="#666666" fontWeight="500" fontFamily="Inter" fontStyle="normal">Prerak Community</Text>
        <Text fontSize="16px" color="#666666" fontWeight="500" fontFamily="Inter" fontStyle="normal">Change Language</Text>
        <Text fontSize="16px" color="#666666" fontWeight="500" fontFamily="Inter" fontStyle="normal">Settings</Text>
        </VStack>
        </>
)
}

