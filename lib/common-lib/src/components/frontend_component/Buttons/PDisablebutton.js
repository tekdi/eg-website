import React from 'react'
import { Button } from 'native-base'

const PDisablebutton = ({ children, ...props }) => {
  return (
    <Button
      {...props}
      background='Darkmaroonsecondarybutton.400'
      border=' 10px solid #790000'
      boxShadow=' 2px 3px  #8B7171'
      borderRadius='100px'
      isFocused
    >
      {children}
    </Button>
  )
}
export default React.memo(PDisablebutton)
