import React from 'react'
import { Text } from 'native-base'
import PropTypes from 'prop-types'

const H5 = ({ children, ...props }) => {
  return (
    <Text fontWeight='300' {...props} fontSize='10px'>
      {children}
    </Text>
  )
}

export default React.memo(H5)

H5.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
}
