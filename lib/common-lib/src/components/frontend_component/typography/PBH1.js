import React from 'react'
import { Text } from 'native-base'

const PBH1 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='22px' fontWeight='700'>
      {children}
    </Text>
  )
}

export default React.memo(PBH1)
