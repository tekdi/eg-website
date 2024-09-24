import React from 'react'
import { Text } from 'native-base'
import PropTypes from 'prop-types'

const BodyLarge = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='14px' fontWeight='500'>
      {children}
    </Text>
  )
}
export default React.memo(BodyLarge)

BodyLarge.propTypes = {
  children: PropTypes.any
}
