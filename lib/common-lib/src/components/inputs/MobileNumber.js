import { FormControl, HStack, Input, Text } from 'native-base'
import React from 'react'
import { t } from 'i18next'
import IconByName from '../IconByName'

export default function MobileNumber({
  schema,
  options,
  value,
  onChange,
  required,
  placeholder,
  isInvalid
}) {
  const [isFocus, setIsfocus] = React.useState(false)
  const { title, help,type } = schema ? schema : {}

  const handalChange = (e) => {
    const newValue = e.target.value
    const regex = /^\d{0,10}$/
    if (regex.test(newValue)) {
      if (e?.target?.value) {
        onChange(e.target.value)
      } else {
        if (type.constructor.name === "Array") {
          if (type?.includes("string")) {
            onChange("")
          } else if (type?.includes("number")) {
            onChange("")
          }
        } else if (type.constructor.name === "String") {
          if (type?.toLowerCase() === "string") {
            onChange("")
          } else if (type?.toLowerCase()  === "number") {
            onChange("")
            console.log("number")
          }
        }
      }
    }
  }

  return (
    <FormControl isInvalid={isInvalid ? isInvalid : false}>
      {title && (
        <FormControl.Label
          rounded='sm'
          position='absolute'
          left='1rem'
          bg='white'
          px='1'
          m='0'
          height={'1px'}
          alignItems='center'
          style={{
            ...(isFocus || value
              ? {
                  top: '0',
                  opacity: 1,
                  zIndex: 5,
                  transition: 'all 0.3s ease'
                }
              : {
                  top: '0.5rem',
                  zIndex: -2,
                  opacity: 0,
                  transition: 'all 0.2s ease-in-out'
                })
          }}
        >
          <Text fontSize='12' fontWeight='400'>
            {t(title)}
            {required ? (
              <Text color={'danger.500'}>*</Text>
            ) : (
              <Text fontWeight='300' color={'#9E9E9E'}>
                ({t('OPTIONAL')})
              </Text>
            )}
          </Text>
        </FormControl.Label>
      )}
      <Input
        type='number'
        keyboardType='numeric'
        key={title}
        InputLeftElement={<Text ml='2'>+91</Text>}
        InputRightElement={
          <IconByName name='PhoneLineIcon' isDisabled={true} mr='2' />
        }
        onFocus={(e) => setIsfocus(true)}
        onBlur={(e) => setIsfocus(false)}
        bg={isFocus ? 'white' : ''}
        {...{ value }}
        onChange={handalChange}
        placeholder={placeholder ? t(placeholder) : t(title)}
      />
      {help && isInvalid ? (
        <FormControl.ErrorMessage>{t(help)}</FormControl.ErrorMessage>
      ) : (
        help && <FormControl.HelperText>{t(help)}</FormControl.HelperText>
      )}
    </FormControl>
  )
}
