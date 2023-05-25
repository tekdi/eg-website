import React from 'react'
import { Button } from 'native-base'

const Primarybutton = ({ children, ...props }) => {
  let style = {}
  if (props?.isDisabled) {
    style = {
      background: 'Darkmaroonsecondarybutton.400',
      border: '10px solid #790000',
      shadow: 'redOutlineBtn',
      rounded: 'full'
    }
  } else {
    style = {
      background: 'Darkmaroonprimarybutton.400',
      shadow: 'RedFillShadow',
      rounded: 'full'
    }
  }
  return (
    <Button {...props} {...style}>
      {children}
    </Button>
  )
}
export default React.memo(Primarybutton)
