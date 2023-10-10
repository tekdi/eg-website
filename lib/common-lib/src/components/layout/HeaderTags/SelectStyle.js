import React from 'react'
import { Select } from 'native-base'

const SelectStyle = ({ children, ...props }) => {
  return (
    <Select
      {...props}
      placeholderTextColor='textMaroonColor.400'
      borderColor='textMaroonColor.400'
      bg='#FFFFFF'
      borderWidth='2px'
      p='2'
      px='3'
      minH='30px'
      rounded={'full'}
    >
      {children}
    </Select>
  )
}
export default React.memo(SelectStyle)
