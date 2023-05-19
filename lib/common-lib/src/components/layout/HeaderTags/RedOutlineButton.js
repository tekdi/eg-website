import React from 'react'
import { Button } from 'native-base'

const RedOutlineButton = ({ children, ...props }) => {
  return (
    <Button {...props} border='1px solid #790000'  borderRadius='10px' padding='50px'>
      {children}
    </Button>
  )
}
export default React.memo(RedOutlineButton)
