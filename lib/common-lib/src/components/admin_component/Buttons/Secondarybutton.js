import React from 'react'
import { Button, ChevronRightIcon } from 'native-base'

const Secondarybutton = ({ icon, children, ...props }) => {
  return (
    <Button
      {...props}
      shadow='RedOutlineShadow'
      rounded='full'
      borderWidth='1px'
      borderColor='blueText.400'
      height='51px'
      _text={{ fontWeight: '700', fontSize: '18px', color: 'blueText.400' }}
      rightIcon={icon ? icon : <ChevronRightIcon size='sm' />}
    >
      {children}
    </Button>
  )
}
export default React.memo(Secondarybutton)
