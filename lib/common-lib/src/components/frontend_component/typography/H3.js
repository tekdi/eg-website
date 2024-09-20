import React from 'react'
import { Text } from 'native-base'
import PropTypes from 'prop-types'

const H3 = ({ children, ...props }) => {
  return (
    <Text fontWeight='400' {...props} fontSize='14px'>
      {children}
    </Text>
  )
}

export default React.memo(H3)

H3.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
}
