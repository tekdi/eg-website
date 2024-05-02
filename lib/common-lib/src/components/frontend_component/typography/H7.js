import React from 'react'
import { Text } from 'native-base'

const H7 = ({ children, ...props }) => {
  return (
    <Text fontWeight='100' {...props} fontSize='6px'>
      {children}
    </Text>
  )
}

export default React.memo(H7)
