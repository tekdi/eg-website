import React from 'react'
import { Text } from 'native-base'

const PC2 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='10px' fontWeight='400'>
      {children}
    </Text>
  )
}

export default React.memo(PC2)
