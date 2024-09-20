import React from 'react'
import { Text } from 'native-base'
import PropTypes from 'prop-types'

const H4 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='18px' fontWeight='400'>
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
