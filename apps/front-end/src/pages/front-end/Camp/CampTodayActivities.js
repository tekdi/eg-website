import {
  CardComponent,
  IconByName,
  Layout,
  SearchLayout,
  t,
} from "@shiksha/common-lib";
import React from "react";
import {
  Box,
  Button,
  HStack,
  VStack,
  Text,
  Avatar,
  Modal,
  ScrollView,
  Stack,
  Radio,
  Switch,
  Badge,
} from "native-base";
import AppBar from "@shiksha/common-lib";
import Drawer from "react-modern-drawer";

export default function CampTodayActivities({ footerLinks }) {
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const toggleDrawer = () => {
    setOpenDrawer((prevState) => !prevState);
  };
  return (
    <Layout
      _appBar={{ name: t("Add today's activities") }}
      //   loading={loading}
      _footer={{ menues: footerLinks }}
    >
      <Box>
        <HStack>
          <CardComponent
            _vstack={{ space: 0, flex: 1 }}
            _hstack={{ borderBottomWidth: 0 }}
            isHideProgressBar={true}
            title={"Learning Activity"}
            arr={[]}
            icon={[{ name: "CellphoneLineIcon", color: "iconColor.100" }]}
            item={"hi"}
          />
          <CardComponent
            _vstack={{ space: 0, flex: 1 }}
            _hstack={{ borderBottomWidth: 0 }}
            isHideProgressBar={true}
            title={"Livelihood Awareness"}
            arr={[]}
            item={"hi"}
          />
        </HStack>
        <HStack>
          <CardComponent
            _vstack={{ space: 0, flex: 1 }}
            _hstack={{ borderBottomWidth: 0 }}
            isHideProgressBar={true}
            title={"Community Engagement"}
            // arr={["name"]}
            // icon={[{ name: "CellphoneLineIcon", color: "iconColor.100" }]}
            // item={"hi"}
          >
            <IconByName
              onPress={() => setOpenDrawer(true)}
              name={"CellphoneLineIcon"}
            />
            {/* <h1>sdf</h1> */}
          </CardComponent>
          <CardComponent
            _vstack={{ space: 0, flex: 1 }}
            _hstack={{ borderBottomWidth: 0 }}
            isHideProgressBar={true}
            title={"Open School/Government Activity"}
            arr={[]}
            item={"hi"}
          />
          <Drawer
            onClose={toggleDrawer}
            open={openDrawer}
            direction="bottom"
            zIndex="99999"
            // lockBackgroundScroll={true}
          ></Drawer>{" "}
        </HStack>
      </Box>
    </Layout>
  );
}
