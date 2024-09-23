import React from 'react'
import { Select } from 'native-base'
import PropTypes from 'prop-types'

const SelectStyle = ({ children, ...props }) => {
  return (
    <Select
      {...props}
      placeholderTextColor='textBlack.500'
      borderColor='SelectBorderColor.500'
      bg='#FFFFFF'
      borderWidth='1px'
      py='3'
      px='2'
      minH='46px'
    >
      {children}
    </Select>
  )
}
export default React.memo(SelectStyle)

SelectStyle.propTypes = {
  children: PropTypes.any
}
