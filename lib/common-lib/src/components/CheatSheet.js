import { HStack, Text, VStack } from 'native-base'
import React from 'react'
import {
  POtpPrimaryInput,
  PPrimarybutton,
  PSecondarybutton
} from './frontend_component'
import {
  IPPrimaryButton,
  IPSecondarybutton,
  IPStatusButton
} from './admin_component'

export default function CheatSheet() {
  return (
    <HStack p='5'>
      <VStack space='15px'>
        <Text> POtpPrimaryInput</Text>
        <POtpPrimaryInput />

        <Text> PPrimarybutton</Text>
        <PPrimarybutton children='Next' />

        <Text> PDisablebutton</Text>
        <PPrimarybutton isDisabled>Next</PPrimarybutton>

        <Text> PSecondarybutton</Text>
        <PSecondarybutton children='Next' />

        <Text>IPPrimaryButton</Text>
        <IPPrimaryButton children='Next' />

        <Text>IPSecondarybutton</Text>
        <IPSecondarybutton children='Next' />

        <Text>IPStatusButton</Text>
        <IPStatusButton status='success' />

        <Text>IPReviewlaterButton</Text>
        <IPStatusButton status='warning' />

        <Text>IPRejectButton</Text>
        <IPStatusButton status='error'>asd</IPStatusButton>

        <Text>IPScheduleInterviewButton</Text>
        <IPStatusButton>Schedule Interview</IPStatusButton>
      </VStack>
    </HStack>
  )
}
