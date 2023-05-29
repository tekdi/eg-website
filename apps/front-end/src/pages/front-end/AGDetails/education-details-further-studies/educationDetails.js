import React from 'react'
import Form from "./educationForm";
import { useParams } from "react-router-dom";
import { IconByName } from '@shiksha/common-lib';
import { VStack } from 'native-base';


export default function basicDetails() {
    const [page, setPage] = React.useState("SplashScreen");
    const [facilitator, setFacilitator] = React.useState({});
    const [ip, setIp] = React.useState({});
    const { id } = useParams();

    return (
        <VStack>
            <Form {...{ ip, facilitator }} onClick={(e) => setPage(e)} />

        </VStack>
    )
}