import {
  useWindowSize,
  IconByName,
  FrontEndTypo,
  authRegistryService,
} from "@shiksha/common-lib";
import { Box, VStack, HStack, Center } from "native-base";
import React from "react";
import QrReader from "react-qr-reader";
import { useTranslation } from "react-i18next";

const App = ({ setOtpFailedPopup, setPage, setError, id, setAttempt }) => {
  const [selected, setSelected] = React.useState(false);
  const [startScan, setStartScan] = React.useState(true);
  const [loadingScan, setLoadingScan] = React.useState(false);
  const [data, setData] = React.useState("");
  const { t } = useTranslation();
  const [width, height] = useWindowSize();
  const topElement = React.useRef(null);
  const bottomElement = React.useRef(null);
  const [cameraHeight, setCameraHeight] = React.useState();
  const [cameraWidth, setCameraWidth] = React.useState();
  const [torch, setTorch] = React.useState(false);

  const handleScan = async (scanData) => {
    setLoadingScan(true);
    if (scanData && scanData !== "") {
      setData(scanData);
      const result = await authRegistryService.aadhaarQr({
        qr_data: scanData?.text ? scanData?.text : scanData,
      });
      if (result?.error) {
        setError({
          top: `QR code ${result?.error}`,
        });
        setPage();
        setOtpFailedPopup(false);
        setAttempt("addhar-qr");
      } else {
        setError();
        const aadhaarResult = await authRegistryService.aadhaarKyc({
          id,
          aadhar_verified: "yes",
          aadhaar_verification_mode: "qr",
        });
        if (aadhaarResult?.error) {
          setError({
            top: `QR code ${aadhaarResult?.error}`,
          });
          setPage();
          setOtpFailedPopup(false);
        } else {
          setPage("aadhaarSuccess");
          setOtpFailedPopup(false);
        }
      }
      setStartScan(false);
      setLoadingScan(false);
    }
  };
  const handleError = (err) => {
    console.error(err);
  };

  React.useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      let newHeight =
        height -
        ((topElement?.current?.clientHeight
          ? topElement?.current?.clientHeight
          : 0) +
          (bottomElement?.current?.clientHeight
            ? bottomElement?.current?.clientHeight
            : 0));
      if (isMounted) {
        const w = topElement?.current?.clientWidth;
        const h = newHeight;
        if (w < h) {
          setCameraWidth(w);
          setCameraHeight(w);
        } else {
          setCameraWidth(h);
          setCameraHeight(h);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  });
  return (
    <Box alignItems={"center"}>
      <Box position="fixed" {...{ width, height }} bg="gray.900">
        <Box p="20px" ref={topElement}>
          <HStack
            space={4}
            justifyContent="space-between"
            flex={1}
            alignItems="center"
          >
            <IconByName
              isDisabled
              color={"gray.900"}
              _icon={{
                size: "0px",
              }}
            />
            <IconByName
              name="CloseCircleLineIcon"
              color={"white"}
              _icon={{
                size: "30px",
              }}
              onPress={(e) => {
                setPage();
                setOtpFailedPopup(true);
              }}
            />
          </HStack>
        </Box>
        {startScan && (
          <Center>
            <QrReader
              key={cameraHeight + cameraWidth}
              facingMode={selected ? "environment" : "user"}
              torch={torch}
              constraints={{
                facingMode: selected ? "environment" : "user",
                torch,
              }}
              style={{
                height: cameraHeight,
                width: cameraWidth,
              }}
              delay={2000}
              onError={handleError}
              onScan={handleScan}
            />
          </Center>
        )}

        <Box py="30px" px="20px" ref={bottomElement}>
          <HStack
            space={4}
            justifyContent="space-between"
            flex={1}
            alignItems="center"
          >
            {startScan && (
              <IconByName
                name="FlashlightLineIcon"
                color={"white"}
                _icon={{
                  size: "30px",
                }}
                onPress={(e) => setTorch(!torch)}
              />
            )}
            {startScan && (
              <IconByName
                name="CameraSwitchLineIcon"
                color={"white"}
                _icon={{
                  size: "30px",
                }}
                onPress={(e) => setSelected(!selected)}
              />
            )}
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};

export default App;
