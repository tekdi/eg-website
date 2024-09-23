import React from 'react'
import { Text } from 'native-base'
import PropTypes from 'prop-types'

const H1 = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='24px' fontWeight='700'>
      {children}
    </Text>
  )
}
export default React.memo(H1)

H1.propTypes = {
  children: PropTypes.any
}
