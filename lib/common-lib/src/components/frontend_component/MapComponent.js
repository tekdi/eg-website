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
    <div className='map-embed'>
      <iframe
        title='Embedded Google Map'
        width='600'
        height='300'
        frameBorder='0'
        style={{ border: 0 }}
        src={embedURL}
        allowFullScreen
      ></iframe>
    </div>
  )
}
