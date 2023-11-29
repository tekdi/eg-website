import React from 'react'
import { Button } from 'native-base'

const DefaultButton = ({
  background,
  borderColor,
  textColor,
  children,
  icon,
  ...props
}) => {
  let style = {}
  if (props?.isDisabled) {
    style = {
      background: background || 'white',
      border: borderColor || '10px solid #790000',
      shadow: 'BlackOutlineShadow',
      borderWidth: '1',
      rounded: 'full',
      color: 'white'
    }
  } else {
    style = {
      background: background || 'white',
      shadow: 'BlackOutlineShadow',
      borderColor: 'textMaroonColor.400',
      borderWidth: '1',
      rounded: 'full',
      py: '10px'
    }
  }
  return (
    <Button
      {...props}
      {...style}
      _text={{
        fontSize: '18px',
        fontWeight: '700',
        color: textColor || 'white'
      }}
      rightIcon={icon || ''}
    >
      {children}
    </Button>
  )
}
export default React.memo(DefaultButton)
