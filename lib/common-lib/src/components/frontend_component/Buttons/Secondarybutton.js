import React from 'react'
import { Button } from 'native-base'

const Secondarybutton = ({ children, ...props }) => {
  return (
    <Button
      {...props}
      background='#FFFFFF'
      variant='outline'
      shadow='RedOutlineShadow'
      borderRadius='100px'
    >
      {children}
    </Button>
  )
}
export default React.memo(Secondarybutton)
