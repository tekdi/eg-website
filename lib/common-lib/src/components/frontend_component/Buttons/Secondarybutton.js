import React from 'react'
import { Button } from 'native-base'
import { useTranslation } from 'react-i18next'

const Secondarybutton = ({ children, ...props }) => {
  let style = {}
  const { t } = useTranslation()
  style = {
    background: 'white',
    borderRadius: '100px',
    borderColor: 'textRed.350',
    borderWidth: '1',
    py: '10px',
    rounded: 'full'
  }
  return (
    <Button
      isLoadingText={t('lOADING_TEXT')}
      {...props}
      {...style}
      _text={{
        fontSize: '14px',
        fontWeight: '700',
        color: 'textRed.350'
      }}
    >
      {children}
    </Button>
  )
}
export default React.memo(Secondarybutton)
