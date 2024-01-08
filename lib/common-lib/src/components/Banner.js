import { Alert, HStack } from 'native-base'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function Banner({ _alert }) {
  const { t } = useTranslation()
  if (process.env.REACT_APP_BANNER_MESSAGE) {
    return (
      <Alert status='warning' alignItems={'start'} mb='3' {..._alert}>
        <HStack alignItems='center' space='2' color>
          <Alert.Icon />
          {t(process.env.REACT_APP_BANNER_MESSAGE)}
        </HStack>
      </Alert>
    )
  }
  return <React.Fragment />
}
