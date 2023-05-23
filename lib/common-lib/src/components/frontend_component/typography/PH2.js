import React from 'react'
import { Text } from 'native-base'

const PH2 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='18px' fontWeight='500'>
      {children}
    </Text>
  )
}

export default React.memo(PH2)
