import React from 'react'
import { Text } from 'native-base'

const H3 = ({ children, ...props }) => {
  return (
    <Text fontWeight='400' {...props} fontSize='14px'>
      {children}
    </Text>
  )
}

export default React.memo(H3)
