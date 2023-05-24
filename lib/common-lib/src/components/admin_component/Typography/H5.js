import React from 'react'
import { Text } from 'native-base'

const IPH2 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='16px' fontWeight='300'>
      {children}
    </Text>
  )
}
export default React.memo(IPH2)
