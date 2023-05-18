import React from 'react'
import { Button } from 'native-base'

const BlueOutlineButton = ({ children, ...props }) => {
  return (
    <Button {...props} color='#084B82' borderWidth='1px' borderColor='#084B82' background='#fff' borderRadius='30px'>
      {children}
    </Button>
  )
}
export default React.memo(BlueOutlineButton)
