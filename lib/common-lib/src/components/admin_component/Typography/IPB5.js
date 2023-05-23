import React from 'react'
import { Text } from 'native-base'

const IPB1 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='14px' fontWeight='400'>
      {children}
    </Text>
  )
}
export default React.memo(IPB1)
