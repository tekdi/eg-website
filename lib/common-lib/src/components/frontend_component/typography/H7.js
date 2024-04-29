import React from 'react'
import { Text } from 'native-base'

const H7 = ({ children, _fontWeight, ...props }) => {
  return (
    <Text fontWeight='100' {...props} fontSize='6px' {..._fontWeight}>
      {children}
    </Text>
  )
}

export default React.memo(H7)
