import React from 'react'
import { Text } from 'native-base'

const IPH2 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='24px' fontWeight='600'>
      {children}
    </Text>
  )
}
export default React.memo(IPH2)
