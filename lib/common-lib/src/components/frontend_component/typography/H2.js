import React from 'react'
import { Text } from 'native-base'
import PropTypes from 'prop-types'

const H2 = ({ children, ...props }) => {
  return (
    <Text fontWeight='600' {...props} fontSize='16px'>
      {children}
    </Text>
  )
}

export default React.memo(H2)

H2.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
}
