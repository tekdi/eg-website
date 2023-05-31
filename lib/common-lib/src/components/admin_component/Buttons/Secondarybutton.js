import React from 'react'
import { Button, ChevronRightIcon } from 'native-base'

const Secondarybutton = ({ icon,children, ...props }) => {
  return (
    <Button
      {...props}
      background='white'
      shadow='BlueOutlineShadow'
      borderRadius='full'
      _text={{ color: 'blueText.400', fontSize: '18px', fontWeight: '700' }}
      rightIcon={icon ? icon : <ChevronRightIcon size='sm' color='black' />}
    >
      {children}
    </Button>
  )
}
export default React.memo(Secondarybutton)
