import React from 'react'
import { Button } from 'native-base'

const Secondarysmallbutton = ({ children, ...props }) => {
  return (
    <Button
      {...props}
      background='#FFFFFF'
      border='1px solid #790000'
      variant='outline'
      shadow='RedOutlineShadow'
      borderRadius=' 100px'
    >
      {children}
    </Button>
  )
}

export default React.memo(Secondarysmallbutton)
