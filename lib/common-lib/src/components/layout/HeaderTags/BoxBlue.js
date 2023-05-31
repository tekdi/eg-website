import React from 'react'
import { Box } from 'native-base'

const BoxBlue = ({ children, ...props }) => {
  return (
    <Box
      {...props}
      width='279px'
      height='169px'
      rounded='8px'
      borderWidth='1px'
      borderColor='PrimaryIpcolor.400'
      shadow='BlueBoxShadow'
    >
      {children}
    </Box>
  )
}
export default React.memo(BoxBlue)
