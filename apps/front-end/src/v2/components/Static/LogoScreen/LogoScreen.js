import { VStack, Image } from "native-base";
import React from "react";
import Logo from "../../../assets/Images/Logo/Logo.png";
export default function LogoScreen() {
  return (
    <Image
      source={{
        uri: Logo,
      }}
      alt="Educate Girls"
      size={"2xl"}
      resizeMode="contain"
    />
  );
}
