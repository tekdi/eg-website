import React from 'react'
import { Text } from 'native-base'
import PropTypes from 'prop-types'

H3.propTypes = {
  children: PropTypes.any
}

const H3 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='16px' fontWeight='500'>
      {children}
    </Text>
  )
}
export default React.memo(H3)
