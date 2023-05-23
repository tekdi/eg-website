import React from 'react'
import { Text } from 'native-base'

const PH3 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='16px' fontWeight='600'>
      {children}
    </Text>
  )
}

export default React.memo(PH3)
