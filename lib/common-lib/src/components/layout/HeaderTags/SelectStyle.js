import React from 'react'
import { Select } from 'native-base'

const SelectStyle = ({ children, ...props }) => {
  return (
    <Select {...props}  placeholderTextColor='#790000'  fontSize='14px' borderColor='#790000' fontWeight='500' background='#FFFFFF' borderWidth='2px'  borderRadius='30px'  shadow='1px 2px 0px #8B7171'>
      {children}
    </Select>
  )
}
export default React.memo(SelectStyle)
