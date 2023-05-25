import React from 'react'
import { Text } from 'native-base'

const H5 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='16px' fontWeight='300'>
      {children}
    </Text>
  )
}
export default React.memo(H5)
