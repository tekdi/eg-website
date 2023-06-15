import React from 'react'
import { Button, HStack, Input, VStack } from 'native-base'
import * as FrontEndTypo from '../components/frontend_component'
import { t, changeLanguage } from 'i18next'

export default function CustomOTPBox({
  value,
  onChange,
  required,
  schema,
  resendOTP,
  isHideResendOtp,
  otpCount,
  ...props
}) {
  const { onClickResendOtp } = schema ? schema : {}
  const [otp, setOtp] = React.useState(
    new Array(otpCount ? +otpCount : 6).fill('')
  )
  const [timer, setTimer] = React.useState(30)
  const timeOutCallback = React.useCallback(
    () => setTimer((currTimer) => currTimer - 1),
    []
  )
  React.useEffect(() => {
    let setTime = ''
    if (timer > 0 && !isHideResendOtp) {
      setTime = setTimeout(timeOutCallback, 1000)
    }
    return (e) => {
      clearTimeout(setTime)
    }
  }, [timer, timeOutCallback])

  const resetTimer = () => {
    if (!timer) {
      setTimer(30)
    }
  }

  const handleChange = (e, index) => {
    const element = e.target
    if (isNaN(element.value)) return false
    const val = [...otp.map((d, idx) => (idx === index ? element.value : d))]
    setOtp(val)
    onChange(val.join(''))
    if (element.nextSibling) {
      element.nextSibling.nextSibling.focus()
    }
  }

  const handleResendOtp = async (mobile) => {
    console.log('reached')
    if (!isHideResendOtp) {
      const sendotpBody = {
        mobile: mobile?.toString(),
        reason: 'verify_mobile'
      }
      const datas = await authRegistryService.sendOtp(sendotpBody)
      localStorage.setItem('hash', datas?.data?.hash)
    }
  }

  return (
    <VStack space={1}>
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
              onChange={(e) => handleChange(e, index)}
              onFocus={(e) => e.target.select()}
            />
          )
        })}
      </HStack>
      {!isHideResendOtp && (
        <HStack justifyContent='space-between' alignItems='center'>
          <FrontEndTypo.H4>{`${'00:' + timer}`} </FrontEndTypo.H4>
          <Button
            variant='link'
            mt='1'
            isDisabled={timer > 1}
            onPress={() => {
              resetTimer()
              setOtp(new Array(otpCount ? +otpCount : 6).fill(''))
              if (onClickResendOtp) {
                onClickResendOtp()
              } else {
                handleResendOtp(props?.schema?.mobile)
              }
            }}
          >
            {t('RESEND_OTP')}
          </Button>
        </HStack>
      )}
    </VStack>
  )
}
