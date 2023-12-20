import React from 'react'
import { Select } from 'native-base'

const SelectStyle = ({ children, ...props }) => {
  return (
    <Select
      {...props}
      placeholderTextColor='textBlack.500'
      borderColor='textMaroonColor.500'
      bg='#FFFFFF'
      borderWidth='2px'
      p='2'
      minH='30px'
      rounded={'full'}
    >
      {children}
    </Select>
  )
}
export default React.memo(SelectStyle)
