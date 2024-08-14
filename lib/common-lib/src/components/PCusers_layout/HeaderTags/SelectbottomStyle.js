import React from 'react'
import { Select } from 'native-base'

const SelectBottomStyle = ({ children, ...props }) => {
  return (
    <Select
      {...props}
      placeholderTextColor='textGreyColor.800'
      borderWidth='0px'
      borderBottomWidth='2px'
      borderRadius='0'
      borderColor='black'
      minWidth='200'
    >
      {children}
    </Select>
  )
}
export default React.memo(SelectBottomStyle)
