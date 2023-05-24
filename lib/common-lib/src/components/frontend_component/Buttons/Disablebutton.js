import React from 'react'
import { Button } from 'native-base'

const Disablebutton = ({ children, ...props }) => {
  return (
    <Button
      {...props}
      background='Darkmaroonsecondarybutton.400'
      border=' 10px solid #790000'
      shadow='redOutlineBtn'
      borderRadius='100px'
      isFocused
    >
      {children}
    </Button>
  )
}
export default React.memo(Disablebutton)
