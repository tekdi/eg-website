import React from 'react'
import { Alert, HStack } from 'native-base'
import IconByName from '../../IconByName'
const Prompts = ({ children, status, ...props }) => {
  const [item, setItem] = React.useState({})

  React.useEffect(() => {
    switch (status && status?.toLowerCase()) {
      case 'success':
        setItem({
          status: 'success',
          bg: 'ApprovedColor',
          color: 'textGreyColor.800'
        })
        break
      case 'danger':
        setItem({
          status: 'danger',
          bg: 'textMaroonColor.100',
          color: 'textGreyColor.800'
        })
        break
      case 'warning':
        setItem({
          status: 'warning',
          bg: 'badgeColor.450',
          color: 'textGreyColor.800'
        })
        break
      case 'info':
        setItem({
          status: 'info',
          bg: 'EnrolledColor',
          color: 'textGreyColor.800'
        })
        break
    }
  }, [status])

  return (
    <Alert
      {...props}
      {...item}
      maxW='400'
      shadow='AlertShadow'
      borderRadius='10px'
      fontSize='12px'
      lineHeight='15px'
    >
      <HStack alignItems='center' justifyContent='space-between'>
        <IconByName name='CheckboxCircleLineIcon' width='40px'></IconByName>
        {children}
      </HStack>
    </Alert>
  )
}
export default React.memo(Prompts)
