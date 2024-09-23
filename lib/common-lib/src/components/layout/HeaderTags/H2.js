import React from 'react'
import { Text } from 'native-base'
import PropTypes from 'prop-types'

H2.propTypes = {
  children: PropTypes.any
}

const H2 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='16px' fontWeight='600'>
      {children}
    </Text>
  )
}
export default React.memo(H2)
