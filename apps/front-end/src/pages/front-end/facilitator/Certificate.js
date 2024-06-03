import {
  AdminTypo,
  CardComponent,
  FrontEndTypo,
  IconByName,
  Layout,
  facilitatorRegistryService,
  testRegistryService,
  tableCustomStyles,
} from "@shiksha/common-lib";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button, HStack, Modal, ScrollView, VStack } from "native-base";
import React from "react";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const columns = (t, certificateDownload) => [
  {
    name: t("EVENT_ID"),
    selector: (row) => row.context_id,
  },
  {
    name: t("NAME"),
    selector: (row) => (row?.events?.[0]?.name ? row?.events?.[0]?.name : "-"),
    attr: "name",
    wrap: true,
  },
  {
    name: t("SCORE"),
    selector: (row) => {
      const score = row?.score;
      const roundedScore = typeof score === "number" ? score.toFixed(2) : "-";
      return roundedScore;
    },
    attr: "name",
    wrap: true,
  },
  {
    name: t("STATUS"),
    selector: (row) =>
      row.certificate_status === true ? (
        <AdminTypo.Secondarybutton
          my="3"
          onPress={() => certificateDownload(row)}
        >
          {t("VIEW_CERTIFICATE")}
        </AdminTypo.Secondarybutton>
      ) : row.certificate_status === false ? (
        <AdminTypo.H6 color="red.500">{t("FAILED")}</AdminTypo.H6>
      ) : (
        <AdminTypo.H6>{t("PENDING")}</AdminTypo.H6>
      ),
  },
];

export default function Profile({ userTokenInfo, footerLinks }) {
  const { id } = userTokenInfo?.authUser || [];
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(true);
  const [certificateData, setCertificateData] = React.useState();
  const [downloadCertificate, setDownloadCertificate] = React.useState();
  const reportTemplateRef = React.useRef(null);

  React.useEffect(async () => {
    const getCertificate = await testRegistryService.getCertificate({
      id,
    });
    setCertificateData(getCertificate?.data);
    setLoading(false);
  }, []);

  const handleGeneratePdf = async () => {
    const doc = new jsPDF({
      format: "a4",
      unit: "px",
    });

    // Adding the fonts.
    doc.setFont("Inter-Regular", "normal");

    doc.html(reportTemplateRef.current, {
      async callback(doc) {
        await doc.save("document");
      },
    });

    const input = reportTemplateRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l");
      pdf.addImage(imgData, "PNG", 0, 0, 297, 210); // Adjust the width and height as needed
      pdf.output("dataurlnewwindow");
      pdf.save("download.pdf");
    });
  };

  const certificateDownload = async (data) => {
    const result = await testRegistryService.postCertificates(data);
    setDownloadCertificate(result?.data?.[0]?.certificate_html);
  };

  const columnsMemoized = React.useMemo(
    () => columns(t, certificateDownload),
    [t, certificateDownload]
  );

  return (
    <Layout
      loading={loading}
      _appBar={{
        onPressBackButton: (e) => navigate(-1),
        onlyIconsShow: ["backBtn", "loginBtn", "langBtn"],
        leftIcon: <FrontEndTypo.H2>{t("CERTIFICATE")}</FrontEndTypo.H2>,
      }}
      _footer={{ menues: footerLinks }}
      _page={{ _scollView: { bg: "formBg.500" } }}
      analyticsPageTitle={"FACILITATOR_CERTIFICATE"}
      pageTitle={t("CERTIFICATE")}
    >
      <VStack space={4}>
        <VStack paddingLeft="16px" paddingRight="16px" py={4} space="4">
          <VStack alignItems={"center"}>
            <FrontEndTypo.H1 color="textMaroonColor.400">
              {t("CERTIFICATE_ISSUED_FOR")}
            </FrontEndTypo.H1>
          </VStack>

          <TableCard columns={columnsMemoized} data={certificateData} />
        </VStack>
      </VStack>
      <Modal isOpen={downloadCertificate} size="xl">
        <Modal.Content>
          <Modal.Header>
            <HStack
              alignItems={"center"}
              justifyContent={"space-between"}
              pr="2"
            >
              <AdminTypo.H3>{t("CERTIFICATION")}</AdminTypo.H3>
              <Button small bordered onPress={() => handleGeneratePdf()}>
                {t("DOWNLOAD")}
              </Button>
              <IconByName
                name="CloseCircleLineIcon"
                onPress={(e) => setDownloadCertificate()}
              />
            </HStack>
          </Modal.Header>
          <ScrollView horizontal={true} mb="2">
            <div className="certificae-parent">
              <Modal.Body>
                <div ref={reportTemplateRef} className="certificae-height">
                  <div
                    dangerouslySetInnerHTML={{ __html: downloadCertificate }}
                  />
                </div>
              </Modal.Body>
            </div>
          </ScrollView>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}

const TableCard = ({ data, columns }) => {
  const { t } = useTranslation();

  const setData = (item) => {
    let jsonData = {};
    columns.forEach((e, key) => {
      jsonData = { ...jsonData, [key]: e?.selector(item) || "" };
    });
    return jsonData;
  };
  return (
    <VStack alignItems={"center"} space="5">
      {data?.map((item) => (
        <CardComponent
          key={item}
          _body={{ bg: "white", p: 4 }}
          _subHstack={{ flex: 1, space: 2 }}
          _hstack={{ space: 2 }}
          _vstack={{
            width: "100%",
            space: 0,
          }}
          item={setData(item)}
          arr={columns?.map((e, key) => key) || []}
          label={
            columns?.map((e) => ({
              label: e?.name,
            })) || []
          }
          isHideProgressBar
        />
      ))}
    </VStack>
  );
};
