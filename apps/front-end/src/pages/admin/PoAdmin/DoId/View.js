import React, { useState } from "react";
import {
  AdminTypo,
  PoAdminLayout,
  CardComponent,
  IconByName,
  Breadcrumb
} from "@shiksha/common-lib";
import { HStack, Menu, Stack, VStack } from "native-base";
import Chip, { ChipStatus } from "component/Chip";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useLocation } from "react-router-dom";


function View() {
  const { t } = useTranslation();
  const { id } = useParams();
  const location = useLocation();
  const [event, setEvent] = useState(location.state?.eventData || undefined);
  
  const navigate = useNavigate();

  const handleEditButton = () => {
    const step = "edit";
    navigate(`/poadmin/do-id/${id}/edit`,{
      state: { eventData: event },
    });
  };
  return (
    <PoAdminLayout>
      <VStack flex={1} pt="3" space={4} p="2">
        <Breadcrumb
          drawer={<IconByName size="sm" name="ArrowRightSLineIcon" />}
          data={[
            {
              title: (
                <HStack>
                  <IconByName name="GroupLineIcon" size="md" />
                  <AdminTypo.H4 bold color="Activatedcolor.400">
                    {t("ALL_DO_IDS")}
                  </AdminTypo.H4>
                </HStack>
              ),
              link: "/poadmin/do-ids",
              icon: "GroupLineIcon",
            },

            <Chip
              textAlign="center"
              lineHeight="15px"
              label={id}
            />,
          ]}
        />
        <HStack space={4}>
          <CardComponent
            _header={{ bg: "light.100" }}
            _vstack={{ space: 0, flex: 1, bg: "light.100" }}
            _hstack={{ borderBottomWidth: 0, p: 1 }}
            buttonText={<AdminTypo.H5>{t("EDIT")}</AdminTypo.H5>}
            onButtonClick={handleEditButton}
            item={{
              ...event
            }}
            title={t("BASIC_DETAILS")}
            label={[
              "ID",
              "DO_ID",
              "EVENT_TYPE",
              "STATUS"
            ]}
            arr={[
              "id",
              "do_id",
              "event_type",
              "status"
            ]}
          />
        </HStack>
      </VStack>
    </PoAdminLayout>
  );
}



export default View;
