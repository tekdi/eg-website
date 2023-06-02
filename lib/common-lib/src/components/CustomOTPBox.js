import React from 'react'
import { HStack, Input, VStack } from 'native-base'
import * as FrontEndTypo from '../components/frontend_component'
import { t, changeLanguage } from 'i18next'

export default function CustomOTPBox({
  value,
  onChange,
  required,
  schema,
  resendOTP,
  ...props
}) {
  const { onClickResendOtp } = schema ? schema : {}
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

  const handleResendOtp = async (mobile) => {
    const sendotpBody = {
      mobile: mobile?.toString(),
      reason: 'verify_mobile'
    }
    const datas = await authRegistryService.sendOtp(sendotpBody)
    localStorage.setItem('hash', datas?.data?.hash)
  }
  console.log(schema)
  return (
    <VStack>
      <HStack space={2}>
        {otp.map((data, index) => {
          return (
            <Input
              textAlign={'center'}
              type='data'
              name='otp'
              maxLength='1'
              key={index}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onFocus={(e) => e.target.select()}
            />
          )
        })}
      </HStack>
      <HStack justifyContent='space-between' alignItems='center'>
        <FrontEndTypo.H4>{`${'00:' + timer}`} </FrontEndTypo.H4>
        <FrontEndTypo.H4
          mt='1'
          isDisabled={timer > 1}
          onPress={() => {
            resetTimer()
            if (onClickResendOtp) {
              onClickResendOtp()
            } else {
              handleResendOtp(props?.schema?.mobile)
            }
          }}
        >
          {t('RESEND_OTP')}
        </FrontEndTypo.H4>
      </HStack>
    </VStack>
  )
}
