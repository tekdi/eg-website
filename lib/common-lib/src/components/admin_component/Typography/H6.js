import React from 'react'
import { Text } from 'native-base'

const H6 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='14px' fontWeight='200'>
      {children}
    </Text>
  )
}
export default React.memo(H6)
