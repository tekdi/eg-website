import {
  AdminTypo,
  Alert,
  IconByName,
  benificiaryRegistoryService,
  generateUUID,
} from "@shiksha/common-lib";
import { HStack, Modal, Stack } from "native-base";
import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useWindowDimensions } from "react-native-web";

const Scholarship = ({ item, setItem, jsonData, setJsonData }) => {
  const { t } = useTranslation();
  // const width = useS;
  const { width, height } = useWindowDimensions();
  const [alert, setAlert] = useState();

  useEffect(() => {
    window.addEventListener(
      "message",
      (event) => {
        handleEvent(event);
      },
      false
    );

    return () => {
      window.removeEventListener("message", (val) => {});
    };
  }, []);

  const handleEvent = async (event) => {
    if (event?.data?.orderId) {
      setJsonData();
      const data = await benificiaryRegistoryService.updateScholarship({
        id: item.id,
        scholarship_order_id: event?.data?.orderId,
      });
      if (data.success) {
        setItem({
          ...item,
          core_beneficiaries: {
            ...item.core_beneficiaries,
            scholarship_order_id: event?.data?.orderId,
          },
        });
        setAlert({
          type: "success",
          title: t("SCHOLARSHIP_SUBMITTED_SUCCESSFULLY"),
        });
      } else {
        setAlert({
          type: "danger",
          title: data?.message,
        });
      }
    }
  };

  // useEffect(() => {
  //   const iframe = document.getElementById("preview");
  //   console.log(iframe);
  //   if (iframe) {
  //     iframe.onload = function () {
  //       const iframeDocument =
  //         iframe.contentDocument || iframe.contentWindow.document;
  //       const iframeBody = iframeDocument.body;
  //       console.log(iframeBody);
  //       // Apply CSS styles to the iframe content
  //       iframeBody.style.backgroundColor = "lightblue";
  //       iframeBody.style.color = "red";
  //     };
  //   }
  // }, [jsonData]);

  return (
    <Stack>
      <Alert {...{ alert, setAlert }} />
      {!item?.core_beneficiaries?.scholarship_order_id ||
      item?.core_beneficiaries?.scholarship_order_id === "" ? (
        <AdminTypo.Secondarybutton
          onPress={() => {
            setJsonData(
              btoa(
                JSON.stringify({
                  name: [item?.first_name, item?.middle_name, item?.last_name]
                    .filter((e) => e)
                    .join(" "),
                  gender: item?.gender == "male" ? "M" : "F",
                  date_of_birth: item?.dob || "",
                  mobile: item?.mobile || "",
                  email:
                    item?.email_id || `${item?.first_name || "demo"}@g.com`,
                  address: [
                    item?.state,
                    item?.district,
                    item?.block,
                    item?.village,
                    item?.grampanchayat,
                  ]
                    .filter((e) => e)
                    .join(", "),
                })
              )
            );
          }}
        >
          {t("APPLY_SCHOLARSHIP")}
        </AdminTypo.Secondarybutton>
      ) : (
        <AdminTypo.PrimaryButton
          onPress={(e) =>
            setAlert({
              type: "warning",
              title: t("ALREADY_APPLIED_SCHOLARSHIP"),
            })
          }
        >
          {t("ALREADY_APPLIED_SCHOLARSHIP")}
        </AdminTypo.PrimaryButton>
      )}
      <Modal isOpen={jsonData} avoidKeyboard size={"xl"}>
        <Modal.Body bg="white" p="0">
          <HStack alignItems={"center"} justifyContent={"space-between"}>
            <AdminTypo.H4 p="4">{t("APPLY_SCHOLARSHIP")}</AdminTypo.H4>
            <IconByName
              name="CloseCircleLineIcon"
              onPress={(e) => setJsonData()}
            />
          </HStack>
          {jsonData && (
            <iframe
              style={{ border: "none" }}
              title={t("APPLY_SCHOLARSHIP")}
              id="preview"
              {...{ width: width - 50, height: height - 80 }}
              src={`${
                process.env.REACT_APP_SCHOLARSHIP_URL
              }/${generateUUID()}?utm_source=educategirls&distributor-name=DISTRIBUTOR_NAME&agent-id=AGENT_ID&jsonData=${jsonData}`}
              allowFullScreen
            />
          )}
        </Modal.Body>
      </Modal>
    </Stack>
  );
};

export default memo(Scholarship);
