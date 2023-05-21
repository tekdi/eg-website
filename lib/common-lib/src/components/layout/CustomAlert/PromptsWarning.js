import React from 'react'
import { Alert, HStack } from 'native-base'
import IconByName from '../../IconByName'

const PromptsWarning = ({ children, ...props }) => {
  return (
    <Alert {...props} maxW="400" shadow="AlertShadow" borderRadius="10px" background="#FFEFAF" color="#212121" status="success" fontSize="12px" lineHeight="15px">
      <HStack alignItems="center" justifyContent="space-between">
      <IconByName name="CheckboxCircleLineIcon" width="40px"></IconByName>
        {children}
      </HStack>
   </Alert>
  )
}
export default React.memo(PromptsWarning)
