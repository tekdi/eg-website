import React from 'react'
import { Select } from 'native-base'

const SelectStyle = ({ children, ...props }) => {
  return (
    <Select
      {...props}
      placeholderTextColor='textMaroonColor.400'
      fontSize='14px'
      borderColor='textMaroonColor.400'
      fontWeight='500'
      background='#FFFFFF'
      borderWidth='2px'
      borderRadius='30px'
      shadow="RedOutlineShadow"
      _icon={{color:"textMaroonColor.400"}}
    >
      {children}
    </Select>
  )
}
export default React.memo(SelectStyle)
