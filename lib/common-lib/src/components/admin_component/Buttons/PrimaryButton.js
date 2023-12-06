import React from 'react'
import { Button, ChevronRightIcon } from 'native-base'
import { useTranslation } from 'react-i18next'

const PrimaryButton = ({ icon, children, ...props }) => {
  const { t } = useTranslation()
  return (
    <Button
      isLoadingText={t('SUBMITTING')}
      {...props}
      background='PrimaryIpcolor.400'
      shadow='BlueFillShadow'
      borderRadius='100px'
      color='white'
      _text={{ color: '#ffffff', fontSize: '12px', fontWeight: '700' }}
      rightIcon={icon || <ChevronRightIcon size='sm' />}
    >
      {children}
    </Button>
  )
}
export default React.memo(PrimaryButton)
