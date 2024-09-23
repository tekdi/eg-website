import React from 'react'
import { Text } from 'native-base'
import PropTypes from 'prop-types'

Caption.propTypes = {
  children: PropTypes.any
}

const Caption = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='10px' fontWeight='500'>
      {children}
    </Text>
  )
}
export default React.memo(Caption)
