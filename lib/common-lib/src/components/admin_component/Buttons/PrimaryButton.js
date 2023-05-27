import React from 'react'
import { Button, ChevronRightIcon } from 'native-base'

const PrimaryButton = ({ icon, children, ...props }) => {
  return (
    <Button
      {...props}
      background='PrimaryIpcolor.400'
      shadow='BlueFillShadow'
      borderRadius=' 100px'
      _text={{ color: '#ffffff', fontSize: '14px', fontWeight: '700' }}
      rightIcon={icon ? icon : <ChevronRightIcon size='sm' />}
    >
      {children}
    </Button>
  )
}
export default React.memo(PrimaryButton)
