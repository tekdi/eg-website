import React from 'react'
import { Button, ChevronRightIcon } from 'native-base'

const IPSecondarybutton = ({ children, ...props }) => {
  return (
    <Button
      {...props}
      background='#FFFFFF'
      variant='outline'
      shadow='RedOutlineShadow'
      borderRadius=' 100px'
      rightIcon={<ChevronRightIcon size='sm' color='black' />}
    >
      {children}
    </Button>
  )
}
export default React.memo(IPSecondarybutton)
