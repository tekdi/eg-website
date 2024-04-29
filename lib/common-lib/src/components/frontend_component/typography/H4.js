import React from 'react'
import { Text } from 'native-base'

const H4 = ({ children, _fontWeight, ...props }) => {
  return (
    <Text fontWeight='400' {...props} fontSize='12px' {..._fontWeight}>
      {children}
    </Text>
  )
}

export default React.memo(H4)
