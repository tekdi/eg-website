import React from 'react'
import { Alert, HStack } from 'native-base'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

export default function Banner({ _alert }) {
  const { t } = useTranslation()
  if (process.env.REACT_APP_BANNER_MESSAGE) {
    return (
      <Alert status='warning' alignItems={'start'} mb='3' {..._alert}>
        <HStack alignItems='center' space='2'>
          <Alert.Icon />
          {t(process.env.REACT_APP_BANNER_MESSAGE)}
        </HStack>
      </Alert>
    )
  }
  return null
}

Banner.propTypes = {
  _alert: PropTypes.object
}
