import { Alert, HStack, Text } from 'native-base'
import React from 'react'
import IconByName from '../IconByName'

const CustomAlert = ({ _hstack, title, status, children }) => {
  return (
    <Alert
      shadow={'AlertShadow'}
      borderRadius={'10px'}
      colorScheme={`customAlert${status || 'info'}`}
      alignItems={'start'}
      mb='3'
      status={status}
      {..._hstack}
      mt='4'
    >
      {children || (
        <HStack alignItems='center' space='2'>
          <IconByName _icon={{ size: '14px' }} name='InformationLineIcon' />
          <Text
            fontSize={'10px'}
            lineHeight={'15px'}
            fontWeight={'400'}
            letterSpacing={'0.3px'}
          >
            {title}
          </Text>
        </HStack>
      )}
    </Alert>
  )
}

export default CustomAlert
