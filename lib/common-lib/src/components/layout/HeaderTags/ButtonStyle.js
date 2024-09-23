import React from 'react'
import { Button } from 'native-base'
import PropTypes from 'prop-types'

const ButtonStyle = ({ children, ...props }) => {
  return (
    <Button
      {...props}
      color='#fff'
      fontSize='18px'
      fontWeight='700'
      background='#2D142C'
      borderRadius='100px'
    >
      {children}
    </Button>
  )
}
export default React.memo(ButtonStyle)

ButtonStyle.propTypes = {
  children: PropTypes.any
}