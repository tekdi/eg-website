import React from 'react'
import { Text } from 'native-base'

const IPA2 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='10px' fontWeight='300'>
      {children}
    </Text>
  )
}
export default React.memo(IPA2)
