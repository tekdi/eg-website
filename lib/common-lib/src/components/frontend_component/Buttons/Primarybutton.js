import React, { memo, forwardRef } from 'react'
import { Button } from 'native-base'
import { useTranslation } from 'react-i18next'

const Primarybutton = ({ children, ...props }, ref) => {
  const { t } = useTranslation()
  let style = {}
  if (props?.isDisabled) {
    style = {
      background: 'textRed.400',
      border: '10px solid #790000',
      shadow: 'redOutlineBtn',
      rounded: 'full',
      color: 'white'
    }
  } else {
    style = {
      background: 'textRed.350',
      rounded: 'full',
      py: '10px'
    }
  }
  return (
    <Button
      ref={ref}
      isLoadingText={t('lOADING_TEXT')}
      {...props}
      {...style}
      _text={{ fontSize: '15px', fontWeight: '700', color: 'white' }}
    >
      {children}
    </Button>
  )
}
export default memo(forwardRef(Primarybutton))
