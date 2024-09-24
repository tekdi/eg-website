import React from 'react'
import { Text } from 'native-base'
import PropTypes from 'prop-types'

const BodySmall = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='12px' fontWeight='400'>
      {children}
    </Text>
  )
}
export default React.memo(BodySmall)

BodySmall.propTypes = {
  children: PropTypes.any
}
