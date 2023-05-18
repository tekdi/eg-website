import React from 'react'
import { Button } from 'native-base'

const BlueFillButton = ({ children, ...props }) => {
  return (
    <Button {...props} color='#ffffff' borderWidth='1px' borderColor='#14242D' background='#14242D' borderRadius='30px'>
      {children}
    </Button>
  )
}
export default React.memo(BlueFillButton)
