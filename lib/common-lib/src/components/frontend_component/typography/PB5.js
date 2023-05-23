import React from 'react'
import { Text } from 'native-base'

const PB5 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='12px' fontWeight='300'>
      {children}
    </Text>
  )
}

export default React.memo(PB5)
