import React from 'react'
import { useTranslation } from 'react-i18next'

function GeoLocation({ getLocation }) {
  const { t } = useTranslation()

  React.useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(showPosition, showError)
    } else {
      getLocation(
        null,
        null,
        t('Geolocation is not available in this browser.')
      )
    }
  }, [])

  const showPosition = (position) => {
    const { latitude, longitude } = position.coords
    getLocation(latitude, longitude)
  }

  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        getLocation(
          null,
          null,
          t('GEO_USER_DENIED_THE_REQUEST_FOR_GEOLOCATION')
        )
        break
      case error.POSITION_UNAVAILABLE:
        getLocation(null, null, t('GEO_LOCATION_INFORMATION_IS_UNAVAILABLE'))
        break
      case error.TIMEOUT:
        getLocation(
          null,
          null,
          t('GEO_THE_REQUEST_TO_GET_USER_LOCATION_TIMED_OUT')
        )
        break
      case error.UNKNOWN_ERROR:
        getLocation(null, null, t('GEO_AN_UNKNOWN_ERROR_OCCURRED'))
        break
    }
  }

  return <React.Fragment />
}

export default GeoLocation
