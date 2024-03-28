import React, { useState } from 'react'
import { Button, HStack, Input, VStack } from 'native-base'
import * as FrontEndTypo from '../components/frontend_component'
import { t } from 'i18next'
import * as authRegistryService from '../services/authRegistryService'

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
  const { onClickResendOtp } = schema || {}
  const [otp, setOtp] = React.useState(new Array(otpCount || 6).fill(''))
  const [timer, setTimer] = React.useState(30)
  const timeOutCallback = React.useCallback(
    () => setTimer((currTimer) => currTimer - 1),
    []
  )

  React.useEffect(() => {
    if (value) {
      const newValue = `${value}`
      const val = [...otp.map((d, idx) => (newValue[idx] ? newValue[idx] : d))]
      setOtp(val)
      onChange(val.join(''))
    }
  }, [value])

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
    const nextElement = element?.parentElement?.nextSibling
    if (nextElement) {
      nextElement.nextSibling.querySelector('input').focus()
    }
  }

  const handleBackspace = (e, index) => {
    if (e.key === 'Backspace') {
      const prevInput = e.target.parentElement.previousSibling
      if (prevInput) {
        prevInput.previousSibling.querySelector('input').focus()
        const val = [...otp]
        val[index] = '' // Clear the current input
        setOtp(val)
      }
    }
  }

  const handleResendOtp = async (mobile) => {
    if (!isHideResendOtp) {
      const sendotpBody = {
        mobile: mobile?.toString(),
        reason: 'verify_mobile'
      }
      const datas = await authRegistryService.sendOtp(sendotpBody)
      localStorage.setItem('hash', datas?.data?.hash)
    }
  }

  const [currentIndex, setCurrentIndex] = useState()

  return (
    <VStack space={1}>
      <HStack space={2}>
        {otp.map((data, index) => {
          return (
            <Input
              _focus={{
                bg: 'transparent',
                borderColor: 'floatingLabelColor.500',
                borderWidth: '2px'
              }}
              flex='1'
              minH={'56px'}
              fontSize={'16px'}
              lineHeight={'24px'}
              letterSpacing={'0.5px'}
              fontWeight={'400'}
              color={'inputValueColor.500'}
              shadow={'none'}
              borderColor={
                value ? 'floatingLabelColor.500' : 'inputBorderColor.500'
              }
              borderWidth={data || value === currentIndex ? '2px' : '1px'}
              borderRadius={'4px'}
              focusOutlineColor={'floatingLabelColor.500'}
              keyboardType='numeric'
              textAlign={'center'}
              type='data'
              name='otp'
              maxLength='1'
              key={index}
              value={data}
              onChange={(e) => handleChange(e, index)}
              onFocus={(e) => {
                setCurrentIndex(index) // Set the current index onFocus
                e.target.select()
              }}
              onKeyUp={(e) => {
                handleBackspace(e, index)
              }}
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
