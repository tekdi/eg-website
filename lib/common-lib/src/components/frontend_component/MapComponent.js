import React from 'react'
import { HStack } from 'native-base'
import PropTypes from 'prop-types'

export function MapComponent({ latitude, longitude, _hstack, _iframe }) {
  // Create the Google Maps embed URL
  const embedURL = `https://www.google.com/maps?q=${latitude},${longitude}&hl=es;z%3D14&amp&output=embed`

  return (
    <HStack className='map-embed' {..._hstack}>
      <iframe
        title='Embedded Google Map'
        width='250px'
        height='250px'
        style={{ border: 0 }}
        src={embedURL}
        allowFullScreen
        loading='lazy'
        {..._iframe}
      ></iframe>
    </HStack>
  )
}

MapComponent.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  _hstack: PropTypes.object,
  _iframe: PropTypes.object
}
