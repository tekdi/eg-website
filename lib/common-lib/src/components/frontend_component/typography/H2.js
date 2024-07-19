import React from 'react'
import { Text } from 'native-base'

const H2 = ({ children, ...props }) => {
  return (
    <Text fontWeight='600' {...props} fontSize='16px'>
      {children}
    </Text>
  )
}

export default React.memo(H2)
