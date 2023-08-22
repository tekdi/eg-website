import React from 'react'
import { Button, ChevronRightIcon } from 'native-base'

const Dangerbutton = ({ icon, children, ...props }) => {
  return (
    <Button
      {...props}
      background='dangerColor'
      shadow='BlueOutlineShadow'
      borderRadius='full'
      borderWidth='1px'
      borderColor='#084B82'
      _text={{ color: 'white', fontSize: '12px', fontWeight: '600' }}
      rightIcon={icon || <ChevronRightIcon size='sm' color='white' />}
    >
      {children}
    </Button>
  )
}
export default React.memo(Dangerbutton)
