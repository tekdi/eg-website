import React from 'react'
import { Text } from 'native-base'

const IPB2 = ({ children, ...props }) => {
  return (
    <Text {...props}  fontSize='16px' fontWeight='400'>
      {children}
    </Text>
  )
}
export default React.memo(IPB2)
