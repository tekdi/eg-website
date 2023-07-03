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
  const [inputValue, setInputValue] = React.useState(value)
  const { title, help } = schema ? schema : {}

  React.useEffect(() => {
    setInputValue(value)
  }, [value])

  const handalChange = (e) => {
    const newValue = e.target.value
    const regex = /^\d{0,10}$/
    if (!newValue) {
      onChange('')
    }
    if (regex?.test(newValue)) {
      onChange(newValue)
    } else {
      onChange(inputValue)
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
        value={inputValue ? inputValue : ''}
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
