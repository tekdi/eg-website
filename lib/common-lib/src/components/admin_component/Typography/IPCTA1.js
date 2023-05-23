import React from 'react'
import { Text } from 'native-base'

const IPCTA1 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='18px' fontWeight='700'>
      {children}
    </Text>
  )
}
export default React.memo(IPCTA1)
