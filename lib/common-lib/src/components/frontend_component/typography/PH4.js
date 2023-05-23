import React from 'react'
import { Text } from 'native-base'

const PH4 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='16px' fontWeight='500'>
      {children}
    </Text>
  )
}

export default React.memo(PH4)
