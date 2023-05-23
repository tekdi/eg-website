import React from 'react'
import { Text } from 'native-base'

const IPB1 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='16px' fontWeight='600'>
      {children}
    </Text>
  )
}
export default React.memo(IPB1)
