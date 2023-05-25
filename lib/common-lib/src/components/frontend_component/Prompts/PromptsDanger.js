import React from 'react'
import { Alert, HStack } from 'native-base'
import IconByName from '../../IconByName'

const PromptsDanger = ({ children, ...props }) => {
  return (
    <Alert {...props}  shadow="AlertShadow" borderRadius="10px" background="#FFACAF" status="success" fontSize="12px" lineHeight="15px">
      <HStack alignItems="center" justifyContent="space-between">
      <IconByName _icon={{ color: "#DC2626" }} name="CheckboxCircleLineIcon" width="40px"></IconByName>
        {children}
      </HStack>
   </Alert>
  )
}
export default React.memo(PromptsDanger)
