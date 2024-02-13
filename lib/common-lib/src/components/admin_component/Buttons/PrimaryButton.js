import React from 'react'
import { Button, ChevronRightIcon } from 'native-base'
import { useTranslation } from 'react-i18next'

const PrimaryButton = ({ icon, children, ...props }) => {
  const { t } = useTranslation()
  return (
    <Button
      isLoadingText={t('SUBMITTING')}
      {...props}
      borderRadius='100px'
      background='Darkmaroonprimarybutton.400'
      shadow='RedFillShadow'
      rounded='full'
      py='10px'
      color='white'
      _text={{ color: '#ffffff', fontSize: '12px', fontWeight: '700' }}
      rightIcon={icon || <ChevronRightIcon size='sm' />}
    >
      {children}
    </Button>
  )
}
export default React.memo(PrimaryButton)
