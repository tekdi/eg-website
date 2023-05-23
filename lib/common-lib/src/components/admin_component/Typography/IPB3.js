import React from 'react'
import { Text } from 'native-base'

const IPB3 = ({ children, ...props }) => {
  return (
    <Text {...props}  fontSize='14px' fontWeight='700'>
      {children}
    </Text>
  )
}
export default React.memo(IPB3)
