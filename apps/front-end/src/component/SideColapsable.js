import React, { useState } from "react";
import { IconByName } from "@shiksha/common-lib";
import { Box, HStack, Stack, VStack } from "native-base";
import PropTypes from "prop-types";

export default function SideColapsable({ sideCompoent, children, isActive }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleOpenButtonClick = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };
  return (
    <HStack ml="-1">
      <Stack style={{ position: "relative", overflowX: "hidden" }}>
        <Stack
          style={{
            position: "absolute",
            top: 0,
            left: "0",
            transition: "left 0.3s ease",
            width: "250px",
            height: "100%",
            background: "white",
            zIndex: 1,
          }}
        >
          <Box
            flex={[2, 2, 1]}
            style={{
              borderRightColor: "dividerColor",
              borderRightWidth: "2px",
            }}
          >
            {sideCompoent}
          </Box>
        </Stack>

        <Stack
          style={{
            marginLeft: isDrawerOpen ? "250px" : "0",
            transition: "margin-left 0.3s ease",
          }}
        />
      </Stack>

      <Box flex={[5, 5, 4]}>
        <VStack
          zIndex={11}
          position="absolute"
          rounded={"xs"}
          height={"50px"}
          bg={isActive ? "textRed.400" : "#E0E0E0"}
          justifyContent="center"
          onClick={handleOpenButtonClick}
        >
          <IconByName
            name={isDrawerOpen ? "ArrowLeftSLineIcon" : "FilterLineIcon"}
            color={isActive ? "white" : "black"}
            _icon={{ size: "30px" }}
          />
        </VStack>
        {children}
      </Box>
    </HStack>
  );
}

SideColapsable.propTypes = {
  sideCompoent: PropTypes.node,
  children: PropTypes.node,
  isActive: PropTypes.bool,
};
