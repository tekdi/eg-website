import { HStack, VStack ,ArrowBackIcon,Text,Box,Progress,ChevronRightIcon,Divider,Button} from "native-base";
import React from "react";
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
import { useNavigate } from "react-router-dom";



 export default function MyProfileDashboard ()
{

    const navigate = useNavigate();

return (
    <VStack paddingLeft="18" paddingTop="10" paddingRight="18">
        <HStack space="4" alignItems="Center" > 
            <Button   backgroundColor="white" onPress={()=>{
                navigate(`/myprofile`);
            }}>
                
                <ArrowBackIcon color="#696767"  size="5" />
                </Button >
            <Text color="#666666" fontSize="14px" fontWeight="500" fontFamily="Inter" fontStyle="normal">Your Profile</Text>   
        </HStack>
        <Box paddingTop="3">
        <Divider orientation="horizontal"  bg="#666666" thickness="1"></Divider>
        </Box>
        <VStack alignItems="Center" display="flex" paddingTop="5">
        <IconByName name="AccountCircleLineIcon" 
         color="#666666" 
         _icon={{ size: "60" }}  />
        <Text color="#666666" fontFamily="Inter" fontStyle="normal">Rachana Wagh</Text>

        </VStack>
        <HStack justifyContent="space-between" display="flex" flexDirection="row"  paddingRight="2" paddingTop="2">
            <VStack>
                <Box >
                <Text fontSize="14px" color="#666666" fontFamily="Inter" fontStyle="normal">Complete Your Profile</Text>
                <Text fontSize="10px" color="#666666" fontFamily="Inter" fontStyle="normal">Increase your chances of getting selected</Text>
                </Box>
                </VStack>
              </HStack>
              
                <HStack alignItems="Center" justifyContent="space-between" paddingTop="10">
          <Text fontSize="16px" color="#666666" fontFamily="Inter" fontStyle="normal">Basic Details</Text>
          <Box w="50%" maxW="400">
          <Progress value={45} mx="4"  size="xs"/>
          </Box>
          <ChevronRightIcon size="5" />
          </HStack>
         
          <Divider orientation="horizontal"  bg="#666666" thickness="1"></Divider>
          <HStack alignItems="Center" justifyContent="space-between" paddingTop="5">
          <Text fontSize="16px" color="#666666" fontFamily="Inter" fontStyle="normal">Work Details</Text>
          <Box w="50%" maxW="400">
          <Progress value={45} mx="4"  size="xs"/>
          </Box>
          <ChevronRightIcon size="5" />
          </HStack>
          <Divider orientation="horizontal"  bg="#666666" thickness="1"></Divider>

          <HStack alignItems="Center" justifyContent="space-between" paddingTop="5">
          <Text fontSize="16px" color="#666666" fontFamily="Inter" fontStyle="normal">Other Details</Text>
          <Box w="50%" maxW="400">
          <Progress value={45} mx="4"  size="xs"/>
          </Box>
          <ChevronRightIcon size="5" />
          </HStack>
          <Divider orientation="horizontal"  bg="#666666" thickness="1"></Divider>

          <HStack alignItems="Center" justifyContent="space-between"paddingTop="5">
          <Text fontSize="16px" color="#666666" fontFamily="Inter" fontStyle="normal">Document Upload</Text>
          <Box w="50%" maxW="400"/>
          <ChevronRightIcon size="5" />
          </HStack>
          <Divider orientation="horizontal"  bg="#666666" thickness="1"></Divider>

        
        
    </VStack>
)
}