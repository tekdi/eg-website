import React from 'react'
import { Alert, HStack, Text } from 'native-base'
import IconByName from '../IconByName'
import PropTypes from 'prop-types'

const CustomAlert = ({ _hstack, title, status, children }) => {
  return (
    <Alert
      shadow={'AlertShadow'}
      borderRadius={'10px'}
      colorScheme={`customAlert${status || 'info'}`}
      alignItems={'start'}
      mb='3'
      status={status}
      mt='4'
      {..._hstack}
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

CustomAlert.propTypes = {
  _hstack: PropTypes.object,
  title: PropTypes.string,
  status: PropTypes.oneOf(['error', 'success', 'info']),
  children: PropTypes.any
}
