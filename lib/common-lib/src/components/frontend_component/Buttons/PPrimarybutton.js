import React from 'react'
import { Button } from 'native-base'

const PPrimarybutton = ({ children, ...props }) => {
  let style = {}
  if (props?.isDisabled) {
    style = {
      background: 'Darkmaroonsecondarybutton.400',
      border: '10px solid #790000',
      boxShadow: '2px 3px  #8B7171',
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
export default React.memo(PPrimarybutton)
