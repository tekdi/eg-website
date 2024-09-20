import React from 'react'
import { Button, ChevronRightIcon } from 'native-base'
import PropTypes from 'prop-types'

const Dangerbutton = ({ icon, children, ...props }) => {
  return (
    <Button
      {...props}
      background='dangerColor'
      shadow='BlueOutlineShadow'
      borderRadius='full'
      borderWidth='1px'
      borderColor='red.700'
      _text={{ color: 'white', fontSize: '12px', fontWeight: '600' }}
      rightIcon={icon || <ChevronRightIcon size='sm' color='white' />}
    >
      {children}
    </Button>
  )
}
export default React.memo(Dangerbutton)

Dangerbutton.propTypes = {
  icon: PropTypes.element,
  children: PropTypes.any
}
