import React from 'react'
import { Button, ChevronRightIcon } from 'native-base'

const Successbutton = ({ icon, children, ...props }) => {
  return (
    <Button
      {...props}
      background='success.500'
      shadow='BlueOutlineShadow'
      borderRadius='full'
      borderWidth='1px'
      borderColor='success.700'
      _text={{ color: 'white', fontSize: '12px', fontWeight: '600' }}
      rightIcon={icon || <ChevronRightIcon size='sm' color='white' />}
    >
      {children}
    </Button>
  )
}
export default React.memo(Successbutton)
