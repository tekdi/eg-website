import React from 'react'
import { Text } from 'native-base'
import PropTypes from 'prop-types'

const H1 = ({ children, ...props }) => {
  return (
    <Text fontWeight='700' {...props} fontSize='20px'>
      {children}
    </Text>
  )
}

export default React.memo(H1)

H1.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
}
