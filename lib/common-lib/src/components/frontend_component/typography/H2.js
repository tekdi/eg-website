import React from 'react'
import { Text } from 'native-base'

const H2 = ({ children, _fontWeight, ...props }) => {
  return (
    <Text fontWeight='600' {...props} fontSize='16px' {..._fontWeight}>
      {children}
    </Text>
  )
}

export default React.memo(H2)
