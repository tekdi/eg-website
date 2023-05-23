import React from 'react'
import { Text } from 'native-base'

const PB2 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='12px' fontWeight='600'>
      {children}
    </Text>
  )
}

export default React.memo(PB2)
