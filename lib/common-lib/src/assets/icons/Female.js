import { Box } from 'native-base'
import React from 'react'

export default function Female({ size, ...props }) {
  const newSize = size ? parseInt(size) : 30
  return (
    <Box {...props}>
      <svg
        width={newSize * 0.5}
        height={newSize}
        viewBox={`0 0 ${
          !Number.isNaN(newSize * 0.5) ? newSize * 0.5 : newSize
        } ${newSize}`}
        fill='white'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M5.7 21V20.3H5H1.53193L5.7388 9.7278C5.73905 9.72719 5.7393 9.72657 5.73955 9.72595C6.11337 8.80524 7.01188 8.2 8 8.2C8.9881 8.2 9.88659 8.80521 10.2604 9.72589C10.2607 9.72653 10.2609 9.72717 10.2612 9.7278L14.4681 20.3H11H10.3V21V29.3H5.7V21ZM10.3 3C10.3 4.27026 9.27026 5.3 8 5.3C6.72975 5.3 5.7 4.27025 5.7 3C5.7 1.72974 6.72974 0.7 8 0.7C9.27026 0.7 10.3 1.72974 10.3 3Z'
          stroke={props?.color || '#D53546'}
          strokeWidth='1.4'
        />
      </svg>
    </Box>
  )
}
