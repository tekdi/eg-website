import React from 'react'
import { Text } from 'native-base'

const PSH1 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='12px' fontWeight='500'>
      {children}
    </Text>
  )
}

export default React.memo(PSH1)
