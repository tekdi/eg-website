import { H1, H3, H4, Layout, t } from '@shiksha/common-lib'
import React, { useState } from 'react'
import { Image, Text, VStack, HStack, Button, Modal, TextArea } from 'native-base';

const Agduplicate = () => {

    const [lang, setLang] = React.useState(localStorage.getItem("lang"));
    const [modalVisible, setModalVisible] = React.useState(false);
    const [addmodal, setaddmodal] = React.useState(false);

    const [firstname, setfirstname] = useState("Rachana Wagh")
    const [alreadyreg, setalreadyreg] = useState(true)
    const [regsuccess, setregsuccess] = useState(false)

    const [DOB, setDOB] = useState("10-11-1995")
    const [gender, setgender] = useState("Female")
    const [verify_id, setverify_id] = useState("xxxx xxxx 8880")

    const navToScreen = () => {
        console.log("reached ");

        if (alreadyreg) {
            console.log("reached here");
            setModalVisible(!modalVisible)

        } else {

            setModalVisible(false)

        }
    }

    return (
        <Layout
            _appBar={{
                lang,
                setLang,
                onPressBackButton: (e) => { },
                onlyIconsShow: ["backBtn", "userInfo"],

            }}
        >


            {
                alreadyreg && <VStack bg={"#FDC5C766"} alignItems={"center"} py={5}>
                    <HStack width={"90%"} mx={"auto"} alignItems={"center"}>

                        <Image
                            source={{
                                uri: "/error.png",
                            }}
                            alt=""
                            width="15px"
                            height="15px"
                        />
                        <VStack>
                            <Text ml={3}>{t("AG_LEARNER_ALREADY_IDENTIFIED")}</Text>
                            <Text ml={3} fontSize={10} width={"80%"}>{t("AG_LEARNER_ALREADY_IDENTIFIED_DES")}</Text>
                        </VStack>

                    </HStack>


                </VStack>
            }

            {
                regsuccess && <HStack bg={"#E6E6E6"} alignItems={"center"} py={5}>
                    <HStack width={"90%"} mx={"auto"} alignItems={"center"}>
                        <Image
                            source={{
                                uri: "/check.svg",
                            }}
                            alt=""
                            width="15px"
                            height="15px"
                        />
                        <Text ml={3}>{t("AADHAAR_VERIFICATION_SUCCESSFUL")}</Text>
                    </HStack>
                </HStack>
            }


            <VStack alignItems={"center"} mt={5}>

                <VStack rounded={5} bg={"#AFB1B6"} width={150} height={150}>

                    <Image
                        source={{
                            uri: "",
                        }}
                        alt=""
                        width="15px"
                        height="15px"
                    />
                </VStack>

                <VStack width={"80%"} mt={10}>
                    <HStack width={"100%"} alignItems={"center"} justifyContent={"space-between"}>
                        <H3>{t("FULL_NAME")}</H3>
                        <H3>{firstname}</H3>
                    </HStack>
                    <HStack width={"100%"} alignItems={"center"} justifyContent={"space-between"}>
                        <H3>{t("GENDER")}</H3>
                        <H3>{gender}</H3>
                    </HStack>
                    <HStack width={"100%"} alignItems={"center"} justifyContent={"space-between"}>
                        <H3>{t("DATE_OF_BIRTH")}</H3>
                        <H3>{DOB}</H3>
                    </HStack>
                    <HStack width={"100%"} alignItems={"center"} justifyContent={"space-between"}>
                        <H3>{t("VERIFICATION_ID_NUMBER")}</H3>
                        <H3>{verify_id}</H3>
                    </HStack>
                    <HStack justifyContent={"end"}>
                        <Button variant={"primary"} bg={"#666666"} width={180} marginTop={"1em"} >
                            <Text color={"white"} >{t("ADD_DETAILS")}</Text>
                        </Button>
                    </HStack>
                    <HStack justifyContent={"end"}>
                        <Button variant={"primary"} bg={"#E6E6E6"} width={"100%"} marginTop={"1em"} >
                            <Text color={"black"} >{t("DOCUMENTS_CHECKLIST")}</Text>
                        </Button>
                    </HStack>
                </VStack>

                <Button variant={"primary"} width={250} marginTop={"10em"} onPress={() => navToScreen()}>
                    {t("NEXT")}
                </Button>

                <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} >
                    <Modal.Content>
                        <Modal.Body py={10} alignItems={"center"}>
                            <VStack alignItems={"center"} pb={2}>
                                <HStack mx={"auto"} alignItems={"center"}>

                                    <Image
                                        source={{
                                            uri: "/error.png",
                                        }}
                                        alt=""
                                        width="15px"
                                        height="15px"
                                    />
                                    <VStack>
                                        <Text ml={3} fontSize={16}>{t("AG_LEARNER_ALREADY_IDENTIFIED")}</Text>
                                    </VStack>
                                </HStack>
                            </VStack>
                            <Text ml={3} fontSize={12} >{t("AG_LEARNER_ALREADY_IDENTIFIED_DES")}</Text>
                            <Button variant={"primary"} bg={"#666666"} width={250} marginTop={"2em"} onPress={() => { setaddmodal(!addmodal); setModalVisible(!modalVisible) }}>
                                {t("CONTINUE_ADDING")}
                            </Button>
                            <Button variant={"primary"} bg={"#E6E6E6"} width={250} marginTop={"1em"} onPress={() => setModalVisible(!modalVisible)}>
                                <Text color={"#000000"}>{t("CANCEL_AND_GO_BACK")}</Text>
                            </Button>
                        </Modal.Body>

                    </Modal.Content>
                </Modal>

                <Modal isOpen={addmodal} onClose={() => setaddmodal(false)} >
                    <Modal.Content>
                        <Modal.Body py={10} alignItems={"center"}>
                            <VStack alignItems={"center"} pb={2}>
                                <VStack mx={"auto"} alignItems={"center"}>
                                    <Image
                                        source={{
                                            uri: "/check.svg",
                                        }}
                                        alt=""
                                        width="50px"
                                        height="50px"
                                    />
                                    <VStack>
                                        <Text mt={3} fontSize={16}>{t("AG_ADDED_SUCCESSFULLY")}</Text>
                                        <TextArea placeholder='Explain your claim of the AG Learner*'></TextArea>
                                    </VStack>
                                </VStack>
                            </VStack>

                            <Button variant={"primary"} bg={"#E6E6E6"} width={250} marginTop={"1em"} onPress={() => setaddmodal(!addmodal)}>
                                <Text color={"#000000"}>{t("SEND")}</Text>
                            </Button>
                        </Modal.Body>

                    </Modal.Content>
                </Modal>

            </VStack>







        </Layout>
    )
}

export default Agduplicate