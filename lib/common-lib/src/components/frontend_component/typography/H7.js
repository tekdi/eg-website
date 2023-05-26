import React from 'react'
import { Text } from 'native-base'

const H7 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='6px' fontWeight='100'>
      {children}
    </Text>
  )
}

export default React.memo(H7)
