import React from 'react'
import { Text } from 'native-base'

const H1 = ({ children, ...props }) => {
  return (
    <Text fontWeight='700' {...props} fontSize='20px'>
      {children}
    </Text>
  )
}

export default React.memo(H1)
