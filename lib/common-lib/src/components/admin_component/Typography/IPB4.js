import React from 'react'
import { Text } from 'native-base'

const IPB4 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='14px' fontWeight='500'>
      {children}
    </Text>
  )
}
export default React.memo(IPB4)
