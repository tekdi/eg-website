import { HStack, Input, VStack } from 'native-base'
import React from 'react'
import { H4 } from './layout/HeaderTags'

export default function CustomOTPBox({
  value,
  onChange,
  required,
  resendOTP,
  ...props
}) {
  const [otp, setOtp] = React.useState(new Array(6).fill(''))

  const [timer, setTimer] = React.useState(30)
  const timeOutCallback = React.useCallback(
    () => setTimer((currTimer) => currTimer - 1),
    []
  )

  React.useEffect(() => {
    timer > 0 && setTimeout(timeOutCallback, 1000)
  }, [timer, timeOutCallback])

  const resetTimer = () => {
    if (!timer) {
      setTimer(30)
    }
  }

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false
    const val = [...otp.map((d, idx) => (idx === index ? element.value : d))]
    setOtp(val)
    onChange(val.join(''))
    if (element.nextSibling) {
      element.nextSibling.nextSibling.focus()
    }
  }

  return (
    <VStack>
      <HStack justifyContent='space-between' space={2}>
        {otp.map((data, index) => {
          return (
            <Input
              type='data'
              name='otp'
              maxLength='1'
              key={index}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onFocus={(e) => e.target.select()}
              bg='white'
            />
          )
        })}
      </HStack>
      <HStack justifyContent='space-between' alignItems='center'>
        <H4>{`${'00:' + timer}`}</H4>
        <H4
          onPress={() => {
            resetTimer()
            resendOTP()
          }}
        >
          {timer <= 1 ? 'Resend OTP' : <React.Fragment />}
        </H4>
      </HStack>
    </VStack>
  )
}
