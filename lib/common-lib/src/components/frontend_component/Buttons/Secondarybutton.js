import React from 'react'
import { Button } from 'native-base'

const Secondarybutton = ({ children, ...props }) => {
  let style = {}
  style = {
    background: 'white',
    shadow: 'RedOutlineShadow',
    borderRadius: '100px',
    borderColor: 'textMaroonColor.400',
    borderWidth: '1',
    py: '10px',
    rounded: 'full'
  }
  return (
    <Button
      {...props}
      {...style}
      _text={{
        fontSize: '18px',
        fontWeight: '700',
        color: 'textMaroonColor.400'
      }}
    >
      {children}
    </Button>
  )
}
export default React.memo(Secondarybutton)
