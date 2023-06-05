import React from 'react'
import { Button } from 'native-base'

const DisableOutlinebutton = ({ children, ...props }) => {
  return (
    <Button
      {...props}
      background='white'
      borderWidth='1'
      borderColor='textGreyColor.200'
      borderRadius='10px'
      shadow='redOutlineBtn'
      _text={{color:'textGreyColor.150', fontSize:'16px', fontWeight:'bold'}}
    >
      {children}
    </Button>
  )
}
export default React.memo(DisableOutlinebutton)
