import { HStack } from 'native-base'
import React from 'react'
export function MapComponent({ latitude, longitude }) {
  // Create the Google Maps embed URL
  // console.log("latitude", latitude);
  const embedURL =
    'https://maps.google.com/maps?q=' +
    latitude +
    ',' +
    longitude +
    '&t=&z=15&ie=UTF8&iwloc=&output=embed'
  return (
    <HStack className='map-embed'>
      <iframe
        title='Embedded Google Map'
        width='250px'
        height='250px'
        style={{ border: 0 }}
        src={embedURL}
        allowFullScreen
      ></iframe>
    </HStack>
  )
}
