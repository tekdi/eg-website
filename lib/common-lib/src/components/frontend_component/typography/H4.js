import React from 'react'
import { Text } from 'native-base'
import PropTypes from 'prop-types'

const H4 = ({ children, ...props }) => {
  return (
    <Text fontWeight='400' {...props} fontSize='12px'>
      {children}
    </Text>
  )
}

export default React.memo(H4)

H4.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
}
