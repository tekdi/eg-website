import React from 'react'
import { Box } from 'native-base'

const BoxBlue = ({ children, ...props }) => {
  return (
    <Box {...props} width='279px' height='169px' border='2px solid #084B82' borderRadius='8px'>
      {children}
    </Box>
  )
}
export default React.memo(BoxBlue)
