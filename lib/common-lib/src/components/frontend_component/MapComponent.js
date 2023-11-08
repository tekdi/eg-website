import { HStack } from 'native-base'
import React from 'react'
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
        {..._iframe}
      ></iframe>
    </HStack>
  )
}
