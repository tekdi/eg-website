import React from 'react'
import { Text } from 'native-base'

const TableText = ({ children, ...props }) => {
  return (
    <Text {...props} color={'textGreyColor.100'} fontSize={'13px'}>
      {children}
    </Text>
  )
}
export default React.memo(TableText)
