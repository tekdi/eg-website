import React from 'react'
import { Button } from 'native-base'
import PropTypes from 'prop-types'

const Disablebutton = ({ children, ...props }) => {
  return (
    <Button
      {...props}
      background='Disablecolor.400'
      borderRadius='10px'
      _text={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}
      isFocused
    >
      {children}
    </Button>
  )
}
export default React.memo(Disablebutton)

Disablebutton.propTypes = {
  children: PropTypes.any
}
