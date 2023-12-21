import React from 'react'
import { Button } from 'native-base'
import { useTranslation } from 'react-i18next'

const Primarybutton = ({ children, ...props }) => {
  const { t } = useTranslation()
  let style = {}
  if (props?.isDisabled) {
    style = {
      background: 'Darkmaroonsecondarybutton.400',
      border: '10px solid #790000',
      shadow: 'redOutlineBtn',
      rounded: 'full',
      color: 'white'
    }
  } else {
    style = {
      background: 'Darkmaroonprimarybutton.400',
      shadow: 'RedFillShadow',
      rounded: 'full',
      py: '10px'
    }
  }
  return (
    <Button
      isLoadingText={t('lOADING_TEXT')}
      {...props}
      {...style}
      _text={{ fontSize: '15px', fontWeight: '700', color: 'white' }}
    >
      {children}
    </Button>
  )
}
export default React.memo(Primarybutton)
