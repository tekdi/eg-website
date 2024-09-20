import React from 'react'
import { Text } from 'native-base'
import PropTypes from 'prop-types'

const H6 = ({ children, ...props }) => {
  return (
    <Text fontWeight='200' {...props} fontSize='8px'>
      {children}
    </Text>
  )
}

export default React.memo(H6)

H6.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
}
