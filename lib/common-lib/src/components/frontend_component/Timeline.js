import React from 'react'
import { Alert, HStack, Box, VStack } from 'native-base'
const Timeline = ({ children, status, ...props }) => {
  const [item, setItem] = React.useState({})
  React.useEffect(() => {
    switch (status && status?.toLowerCase()) {
      case 'approved':
        setItem({
          status: 'approved',
          bg: 'timeLineBg',
          color: 'textGreyColor.800',
          borderColor: 'successColor'
        })
        break
      case 'dropout':
        setItem({
          status: 'dropout',
          bg: 'timeLineBg',
          color: 'textGreyColor.800',
          borderColor: 'dangerColor'
        })
        break
      case 'rejected':
        setItem({
          status: 'rejected',
          bg: 'timeLineBg',
          color: 'textGreyColor.800',
          borderColor: 'dangerColor'
        })
        break
      case 'rejoined':
        setItem({
          status: 'rejoined',
          bg: 'timeLineBg',
          color: 'textGreyColor.800',
          borderColor: 'blueText.450'
        })
        break
      case 'enrolled':
        setItem({
          status: 'enrolled',
          bg: 'timeLineBg',
          color: 'textGreyColor.800',
          borderColor: 'blueText.450'
        })
        break
      case 'ready_to_enroll':
        setItem({
          status: 'ready_to_enroll',
          bg: 'timeLineBg',
          color: 'textGreyColor.800',
          borderColor: 'warningColor'
        })
        break
      case 'enrolled_ip_verified':
        setItem({
          status: 'enrolled_ip_verified',
          bg: 'timeLineBg',
          color: 'textGreyColor.800',
          borderColor: 'warningColor'
        })
        break
      case 'identified':
        setItem({
          status: 'identified',
          bg: 'timeLineBg',
          color: 'textGreyColor.800',
          borderColor: 'textGreyColor.200'
        })
        break
    }
  }, [status])

  return (
    <HStack
      borderColor='Disablecolor.400'
      borderLeftWidth='2px'
      mr='23px'
      alignItems='center'
      width='80%'
    >
      <Box
        bg='Disablecolor.400'
        width='15px'
        height='15px'
        rounded='full'
        mr='5'
        ml='-7px'
      />
      <Alert
        pl='3'
        py='5'
        pr='5'
        mb='3'
        borderLeftWidth='5px'
        {...props}
        {...item}
        width='100%'
        alignItems='flex-start'
      >
        <VStack>{children}</VStack>
      </Alert>
    </HStack>
  )
}
export default React.memo(Timeline)
