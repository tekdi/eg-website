import React from 'react'
import { Text } from 'native-base'
import PropTypes from 'prop-types'

const TableText = ({ children, ...props }) => {
  return (
    <Text {...props} color={'textGreyColor.100'} fontSize={'13px'}>
      {children}
    </Text>
  )
}
export default React.memo(TableText)

TableText.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
}
