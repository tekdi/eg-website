import React from 'react'
import { Text } from 'native-base'

const H2 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='22px' fontWeight='600'>
      {children}
    </Text>
  )
}
export default React.memo(H2)
