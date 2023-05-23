import React from 'react'
import { Text } from 'native-base'

const PB3 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='12px' fontWeight='500'>
      {children}
    </Text>
  )
}

export default React.memo(PB3)
