import React from 'react'
import { Button } from 'native-base'

const ButtonStyle = ({ children, ...props }) => {
  return (
    <Button {...props}  color='#fff' fontSize='18px' fontWeight='700' background='#2D142C'  borderRadius='100px'>
      {children}
    </Button>
  )
}
export default React.memo(ButtonStyle)
