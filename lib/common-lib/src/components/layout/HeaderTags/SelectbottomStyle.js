import React from 'react'
import { Select } from 'native-base'
import PropTypes from 'prop-types'

const SelectBottomStyle = ({ children, ...props }) => {
  return (
    <Select
      {...props}
      placeholderTextColor='textGreyColor.800'
      borderWidth='0px'
      borderBottomWidth='2px'
      borderRadius='0'
      borderColor='black'
      minWidth='200'
    >
      {children}
    </Select>
  )
}
export default React.memo(SelectBottomStyle)

SelectBottomStyle.propTypes = {
  children: PropTypes.any
}
