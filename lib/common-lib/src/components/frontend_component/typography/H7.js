import React from 'react'
import { Text } from 'native-base'
import PropTypes from 'prop-types'

const H7 = ({ children, ...props }) => {
  return (
    <Text fontWeight='100' {...props} fontSize='6px'>
      {children}
    </Text>
  )
}

export default React.memo(H7)

H7.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
}
