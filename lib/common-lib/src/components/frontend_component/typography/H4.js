import React from 'react'
import { Text } from 'native-base'

const H4 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='12px' fontWeight='400'>
      {children}
    </Text>
  )
}

export default React.memo(H4)
