import React from 'react'
import { Text } from 'native-base'

const H4 = ({ children, ...props }) => {
  return (
    <Text fontWeight='400' {...props} fontSize='12px'>
      {children}
    </Text>
  )
}

export default React.memo(H4)
