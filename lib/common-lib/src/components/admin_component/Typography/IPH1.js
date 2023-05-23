import React from 'react'
import { Text } from 'native-base'

const IPH1 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='24px' fontWeight='700'>
      {children}
    </Text>
  )
}
export default React.memo(IPH1)
