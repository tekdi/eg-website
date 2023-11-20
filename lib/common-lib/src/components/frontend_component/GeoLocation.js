import React from 'react'

function GeoLocation({ getLocation }) {
  React.useEffect(() => {
    getLocation(getLocationData())
  }, [])
  return <React.Fragment />
}

export default GeoLocation

export const useLocationData = () => {
  const [latLongData, setLatLongData] = React.useState([
    null,
    null,
    'Geolocation is not available in this browser.'
  ])

  React.useEffect(() => {
    if ('geolocation' in navigator) {
      let data = navigator?.geolocation
      data?.getCurrentPosition(showPosition, showError)
    }
  }, [navigator])

  const showPosition = (position) => {
    const { latitude, longitude } = position.coords
    setLatLongData([`${latitude}`, `${longitude}`])
    // return [latitude, longitude]
  }
  function showError(error) {
    let re = [null, null]
    switch (error.code) {
      case error.PERMISSION_DENIED:
        re = [null, null, 'GEO_USER_DENIED_THE_REQUEST_FOR_GEOLOCATION']
        break
      case error.POSITION_UNAVAILABLE:
        re = [null, null, 'GEO_LOCATION_INFORMATION_IS_UNAVAILABLE']
        break
      case error.TIMEOUT:
        re = [null, null, 'GEO_THE_REQUEST_TO_GET_USER_LOCATION_TIMED_OUT']
        break
      case error.UNKNOWN_ERROR:
        re = [null, null, 'GEO_AN_UNKNOWN_ERROR_OCCURRED']
        break
    }

    setLatLongData(re)
  }
  return latLongData
}
