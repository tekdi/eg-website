import React from 'react'
import { Box } from 'native-base'

const BoxBlue = ({ children, ...props }) => {
  return (
    <Box
      {...props}
      width='279px'
      height='169px'
      shadow='BlueBoxShadow'
      borderColor='PrimaryIpcolor.400'
      borderWidth='2px'
      rounded='10px'
    >
      {children}
    </Box>
  )
}
export default React.memo(BoxBlue)
