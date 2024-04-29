import React from 'react'
import { Text } from 'native-base'

const H5 = ({ children, _fontWeight, ...props }) => {
  return (
    <Text fontWeight='300' {...props} fontSize='10px' {..._fontWeight}>
      {children}
    </Text>
  )
}

export default React.memo(H5)
