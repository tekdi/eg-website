import { Box } from 'native-base'
import React from 'react'

export default function Male({ size, ...props }) {
  const newSize = size ? parseInt(size) : 30
  return (
    <Box {...props}>
      <svg
        width={newSize * 0.4}
        height={newSize}
        viewBox={`0 0 ${
          !Number.isNaN(newSize * 0.4) ? newSize * 0.4 : newSize
        } ${newSize}`}
        fill='white'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M3.7 19.5V18.8H3H0.7V10.5C0.7 9.2366 1.7366 8.2 3 8.2H9C10.2634 8.2 11.3 9.2366 11.3 10.5V18.8H9H8.3V19.5V29.3H3.7V19.5ZM8.3 3C8.3 4.27025 7.27025 5.3 6 5.3C4.72975 5.3 3.7 4.27025 3.7 3C3.7 1.72974 4.72974 0.7 6 0.7C7.27026 0.7 8.3 1.72974 8.3 3Z'
          stroke={props?.color || '#D53546'}
          strokeWidth='1.4'
        />
      </svg>
    </Box>
  )
}
