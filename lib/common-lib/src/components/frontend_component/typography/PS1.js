import React from 'react'
import { Text } from 'native-base'

const PS1 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='8px' fontWeight='400'>
      {children}
    </Text>
  )
}

export default React.memo(PS1)
