import React from 'react'
import { Text } from 'native-base'
import PropTypes from 'prop-types'

const H5 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='16px' fontWeight='300'>
      {children}
    </Text>
  )
}
export default React.memo(H5)

H5.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
}
