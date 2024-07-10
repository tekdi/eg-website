import {
  FrontEndTypo,
  Layout,
  Loading,
  UserCard,
  benificiaryRegistoryService,
  campService,
} from "@shiksha/common-lib";
import { CheckIcon, HStack, Modal, Select, VStack } from "native-base";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { getIpUserInfo, setIpUserInfo } from "v2/utils/SyncHelper/SyncHelper";

const scores = ["a+", "a", "b", "c", "d", "e"];

export default function CampLearnerScores({ footerLinks, userTokenInfo }) {
  const { t } = useTranslation();
  const params = useParams();
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fa_id = localStorage.getItem("id");
  const [facilitator, setFacilitator] = useState();
  const [showModal, setShowModal] = useState(false);

  const programDetails = JSON.parse(localStorage.getItem("program"));

  const getStudentsData = async () => {
    try {
      const result = await campService.getCampLearnerScores({
        camp_id: params?.id,
        assessment_type: params?.type,
      });
      setStudentsData(result?.data?.learners);
    } catch (error) {
      console.error("Error fetching students data:", error);
    }
  };

  const getPageTitle = () => {
    switch (params.type) {
      case "base-line":
        return t("PCR_INITIAL_LEVEL");
      case "end-line":
        return t("PCR_FINAL_EVALUATON");
      default:
        return t("PCR_INITIAL_LEVEL");
    }
  };

  useEffect(async () => {
    await getStudentsData();
    if (userTokenInfo) {
      const IpUserInfo = await getIpUserInfo(fa_id);
      let ipUserData = IpUserInfo;
      if (!IpUserInfo) {
        ipUserData = await setIpUserInfo(fa_id);
      }

      setFacilitator(ipUserData);
    }
    setLoading(false);
  }, []);

  const checkSubmissionStatus = () => {
    const key =
      params.type === "base-line"
        ? "baseline_learning_level"
        : "endline_learning_level";

    const canSubmit = studentsData?.every((item) => {
      return scores.includes(item?.pcr_scores?.[0]?.[key]);
    });

    navigate(-1);

    // if (canSubmit) {
    //   navigate(-1);
    // } else {
    //   setShowModal(true);
    // }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Layout
      _appBar={{
        name:
          params.type === "base-line"
            ? t("PCR_INITIAL_LEVEL")
            : t("PCR_FINAL_EVALUATON"),
        onPressBackButton: () =>
          navigate(`/camps/${params?.id}/campexecution/activities`),
        onlyIconsShow: ["backBtn", "langBtn"],
        leftIcon: <FrontEndTypo.H2>{t("SESSION_LIST")}</FrontEndTypo.H2>,
        _box: { bg: "white", shadow: "appBarShadow" },
      }}
      facilitator={facilitator}
      _page={{ _scollView: { bg: "bgGreyColor.200" } }}
      // _footer={{ menues: footerLinks }}
    >
      <VStack p="4" space={4}>
        <FrontEndTypo.H2 color="textMaroonColor.400">
          {getPageTitle()}
        </FrontEndTypo.H2>
        {studentsData?.map((student) => (
          <StudentCard
            key={student?.user_id}
            student={student}
            program_id={programDetails?.program_id}
          />
        ))}
        <HStack justifyContent={"center"}>
          <FrontEndTypo.Primarybutton onPress={checkSubmissionStatus}>
            {t("SUBMIT")}
          </FrontEndTypo.Primarybutton>
        </HStack>
      </VStack>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header textAlign={"center"}>{t("WARNING")}</Modal.Header>
          <Modal.Body>
            <FrontEndTypo.H2>{t("SCORES_SUBMIT_WARNING")}</FrontEndTypo.H2>
          </Modal.Body>
          <Modal.Footer justifyContent={"space-evenly"}>
            <FrontEndTypo.Secondarybutton onPress={() => setShowModal(false)}>
              {t("CANCEL")}
            </FrontEndTypo.Secondarybutton>
            <FrontEndTypo.Primarybutton
              onPress={() => {
                setShowModal(false);
                navigate(-1);
              }}
            >
              {t("CONTINUE")}
            </FrontEndTypo.Primarybutton>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}

const StudentCard = ({ student, program_id }) => {
  const [data, setData] = useState(student);
  const params = useParams();

  const updateValue = async (key, value) => {
    setData((prevData) => {
      const newPcrScores = prevData.pcr_scores.map((score) => {
        if (params.type === "base-line") {
          return { ...score, baseline_learning_level: value };
        } else {
          return { ...score, endline_learning_level: value };
        }
      });
      return { ...prevData, pcr_scores: newPcrScores };
    });

    await benificiaryRegistoryService.createPCRScores({
      user_id: data?.id,
      [key]: value,
    });
  };

  return (
    <UserCard
      key={data?.id}
      _hstack={{
        p: 2,
        space: 1,
        flex: 1,
        bg: "green.100",
      }}
      _vstack={{ py: 2 }}
      _image={{ size: 45, color: "gray" }}
      rightElement={
        <Select
          accessibilityLabel="Choose Score"
          selectedValue={
            data?.pcr_scores?.[0]?.[
              params.type === "base-line"
                ? "baseline_learning_level"
                : "endline_learning_level"
            ]
          }
          placeholder="Choose Score"
          width={100}
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="2" />,
          }}
          onValueChange={(itemValue) =>
            updateValue(
              params.type === "base-line"
                ? "baseline_learning_level"
                : "endline_learning_level",
              itemValue
            )
          }
        >
          {scores.map((score, index) => (
            <Select.Item
              key={index}
              label={score.toUpperCase()}
              value={score}
            />
          ))}
        </Select>
      }
      title={[
        data?.program_beneficiaries[0]?.enrollment_first_name,
        data?.program_beneficiaries[0]?.enrollment_middle_name,
        data?.program_beneficiaries[0]?.enrollment_last_name,
      ]
        .filter((e) => e)
        .join(" ")}
      isIdtag={data?.id}
    />
  );
};
