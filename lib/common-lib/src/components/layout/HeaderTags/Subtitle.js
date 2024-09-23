import React from 'react'
import { Text } from 'native-base'
import PropTypes from 'prop-types'

Subtitle.propTypes = {
  children: PropTypes.any
}

const Subtitle = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize='12px' fontWeight='500'>
      {children}
    </Text>
  )
}
export default React.memo(Subtitle)
