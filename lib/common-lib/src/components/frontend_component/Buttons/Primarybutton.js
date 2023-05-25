import React from 'react'
import { Button } from 'native-base'

const Primarybutton = ({ children, ...props }) => {
  let style = {}
  if (props?.isDisabled) {
    style = {
      background: 'Darkmaroonsecondarybutton.400',
      border: '10px solid #790000',
      shadow: 'redOutlineBtn',
      rounded: 'full',
      color:'white',
    }
  } else {
    style = {
      background: 'Darkmaroonprimarybutton.400',
      shadow: 'RedFillShadow',
      rounded: 'full',
      py:'15px'
    }
  }
  return (
    <Button {...props} {...style} _text={{fontSize:"18px", fontWeight:"700"}}>
      {children}
    </Button>
  )
}
export default React.memo(Primarybutton)
