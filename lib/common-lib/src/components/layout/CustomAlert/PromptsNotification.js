import React from 'react'
import { Alert, HStack, VStack } from 'native-base'
import IconByName from '../../IconByName'

const PromptsNotification = ({ children, ...props }) => {
  return (
    <Alert {...props}  background=" linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)" borderRadius="10px" shadow="AlertShadow"  color="#212121" fontSize="12px" lineHeight="15px">
      <HStack alignItems="center" justifyContent="space-between">
      <IconByName name="CheckboxCircleLineIcon" width="40px"></IconByName>
        <VStack>
          {children}
        </VStack>          
      </HStack>
   </Alert>
  )
}
export default React.memo(PromptsNotification)
