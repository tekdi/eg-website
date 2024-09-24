import { HStack, Text, VStack } from 'native-base'
import React from 'react'
import {
  OtpPrimaryInput,
  Primarybutton,
  Secondarybutton
} from './frontend_component'
import { PrimaryButton, StatusButton } from './admin_component'

export default function CheatSheet() {
  return (
    <HStack p='5'>
      <VStack space='15px'>
        <Text> OtpPrimaryInput</Text>
        <OtpPrimaryInput />

        <Text> Primarybutton</Text>
        <Primarybutton>Next</Primarybutton>

        <Text> Disablebutton</Text>
        <Primarybutton isDisabled>Next</Primarybutton>

        <Text> Secondarybutton</Text>
        <Secondarybutton>Next</Secondarybutton>

        <Text>PrimaryButton</Text>
        <PrimaryButton>Next</PrimaryButton>

        <Text>Secondarybutton</Text>
        <Secondarybutton>Next</Secondarybutton>

        <Text>Success </Text>
        <StatusButton status='success'>Application Approved</StatusButton>

        <Text>Warning</Text>
        <StatusButton status='warning'>Review Later</StatusButton>

        <Text>Danger</Text>
        <StatusButton status='error'>Reject Application</StatusButton>

        <Text>Info</Text>
        <StatusButton>Schedule Interview</StatusButton>
      </VStack>
    </HStack>
  )
}
