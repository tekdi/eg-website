import React from 'react'
import { Text } from 'native-base'

const H1 = ({ children, _fontWeight, ...props }) => {
  return (
    <Text fontWeight='700' {...props} fontSize='18px' {..._fontWeight}>
      {children}
    </Text>
  )
}

export default React.memo(H1)
