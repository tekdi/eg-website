import React from 'react'
import { Text } from 'native-base'
import PropTypes from 'prop-types'

const BodyMedium = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='14px' fontWeight='400'>
      {children}
    </Text>
  )
}
export default React.memo(BodyMedium)

BodyMedium.propTypes = {
  children: PropTypes.any
}
