import React from 'react'
import { Box } from 'native-base'

const BoxBlue = ({ children, ...props }) => {
  return (
    <Box
      {...props}
      width='279px'
      height='169px'
      borderWidth='4px'
      borderColor='#000'
      rounded='full'
    >
      {children}
    </Box>
  )
}
export default React.memo(BoxBlue)
