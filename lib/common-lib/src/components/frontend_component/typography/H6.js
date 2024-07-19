import React from 'react'
import { Text } from 'native-base'

const H6 = ({ children, ...props }) => {
  return (
    <Text fontWeight='200' {...props} fontSize='8px'>
      {children}
    </Text>
  )
}

export default React.memo(H6)
