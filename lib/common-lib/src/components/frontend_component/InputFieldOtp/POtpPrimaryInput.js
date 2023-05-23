import React from 'react'
import { Input, Text, Stack, HStack } from 'native-base'

const POtpPrimaryInput = () => {
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false
    const val = [...otp.map((d, idx) => (idx === index ? element.value : d))]
    setOtp(val)

    if (element.nextSibling) {
      element.nextSibling.nextSibling.focus()
    }
  }
  const [otp, setOtp] = React.useState(new Array(6).fill(''))
  return (
    <Stack width='328px'>
      <Text fontSize='12px' color='Defaultcolor.400'>
        Enter the 6 digit OTP sent on the number above
      </Text>
      <HStack space='6' justifyContent='space-between'>
        {otp.map((data, index) => {
          return (
            <Input
              type='data'
              name='otp'
              maxLength='1'
              borderRadius='10px'
              key={index}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onFocus={(e) => e.target.select()}
              bg='white'
            />
          )
        })}
      </HStack>
      <HStack justifyContent='space-between'>
        <Text fontSize='12px' color='Defaultcolor.400'>
          00:30
        </Text>
        <Text fontSize='12px' color='Defaultcolor.400'>
          Resend OTP
        </Text>
      </HStack>
    </Stack>
  )
}
export default React.memo(POtpPrimaryInput)
