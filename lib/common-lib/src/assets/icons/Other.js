import { Box } from 'native-base'
import React from 'react'

export default function Other({ size, ...props }) {
  const newSize = size ? parseInt(size) : 30
  return (
    <Box {...props}>
      <svg
        width={newSize * 0.44}
        height={newSize}
        viewBox={`0 0 ${
          !Number.isNaN(newSize * 0.44) ? newSize * 0.44 : newSize
        } ${newSize}`}
        fill='white'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M8.19554 9.81952L8.19885 9.83035L8.20251 9.84107L11.7715 20.3H8.25H7.55V21V29.3H3.7V18.75V18.05H3H1.45V10.5C1.45 9.2366 2.4866 8.2 3.75 8.2L6 8.2L6.00173 8.2C6.49278 8.19879 6.97119 8.35559 7.36626 8.64723C7.76132 8.93888 8.05207 9.34989 8.19554 9.81952ZM6 0.7C6.61 0.7 7.19501 0.942321 7.62635 1.37365C8.05768 1.80499 8.3 2.39 8.3 3C8.3 3.61 8.05768 4.19501 7.62635 4.62635C7.19501 5.05768 6.61 5.3 6 5.3C4.7216 5.3 3.7 4.2784 3.7 3C3.7 1.72388 4.73432 0.7 6 0.7Z'
          stroke={props?.color || '#D53546'}
          strokeWidth='1.4'
        />
      </svg>
    </Box>
  )
}
