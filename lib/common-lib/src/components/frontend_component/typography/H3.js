import React from 'react'
import { Text } from 'native-base'

const H3 = ({ children, _fontWeight, ...props }) => {
  return (
    <Text fontWeight='400' {...props} fontSize='14px' {..._fontWeight}>
      {children}
    </Text>
  )
}

export default React.memo(H3)
