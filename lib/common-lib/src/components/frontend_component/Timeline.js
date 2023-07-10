import React from 'react'
import { Alert, HStack, Box, VStack } from 'native-base'
const Timeline = ({ children, status, ...props }) => {
  const [item, setItem] = React.useState({})

  React.useEffect(() => {
    switch (status && status?.toLowerCase()) {
      case 'approved':
        setItem({
          status: 'approved',
          bg: 'dividerColor',
          color: 'textGreyColor.800',
          borderColor: 'successColor'
        })
        break
      case 'dropped_out':
        setItem({
          status: 'dropped_out',
          bg: 'dividerColor',
          color: 'textGreyColor.800',
          borderColor: 'dangerColor'
        })
        break
      case 'rejected':
        setItem({
          status: 'rejected',
          bg: 'dividerColor',
          color: 'textGreyColor.800',
          borderColor: 'dangerColor'
        })
        break
      case 'rejoined':
        setItem({
          status: 'rejoined',
          bg: 'blueText.350',
          color: 'textGreyColor.800',
          borderColor: 'blueText.450'
        })
        break
      case 'enrolled':
        setItem({
          status: 'enrolled',
          bg: 'dividerColor',
          color: 'textGreyColor.800',
          borderColor: 'blueText.450'
        })
        break
      case 'documented':
        setItem({
          status: 'documented',
          bg: 'dividerColor',
          color: 'textGreyColor.800',
          borderColor: 'warningColor'
        })
        break
      case 'identified':
        setItem({
          status: 'identified',
          bg: 'dividerColor',
          color: 'textGreyColor.800',
          borderColor: ' textGreyColor.200'
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
      ></Box>
      <Alert
        pl='3'
        py='5'
        pr='5'
        mb='3'
        borderLeftWidth='5px'
        {...item}
        {...props}
        width='100%'
        alignItems='flex-start'
      >
        <VStack>{children}</VStack>
      </Alert>
    </HStack>
  )
}
export default React.memo(Timeline)
