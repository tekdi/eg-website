import React from 'react'
import { Text } from 'native-base'

const PC1 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='10px' fontWeight='600'>
      {children}
    </Text>
  )
}

export default React.memo(PC1)
