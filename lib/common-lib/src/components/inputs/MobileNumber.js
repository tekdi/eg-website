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
    <FormControl isInvalid={isInvalid || false}>
      {title && (
        <FormControl.Label
          rounded='sm'
          position='absolute'
          left='1rem'
          bg='white'
          mx='1'
          m='0'
          height={'2px'}
          alignItems='center'
          style={{
            top: '-1px',
            opacity: 1,
            zIndex: 5,
            transition: 'all 0.3s ease'
          }}
        >
          <Text
            bg={'white'}
            fontSize='12'
            px={'5px'}
            fontWeight='400'
            color={'floatingLabelColor.500'}
          >
            {t(title)}
            {required ? <Text color={'danger.500'}>*</Text> : ''}
          </Text>
        </FormControl.Label>
      )}
      <Input
        _focus={{
          bg: 'transparent',
          borderColor: 'floatingLabelColor.500'
        }}
        shadow={'none'}
        minH={'56px'}
        fontSize={'16px'}
        lineHeight={'24px'}
        letterSpacing={'0.5px'}
        fontWeight={'400'}
        color={'inputValueColor.500'}
        borderColor={value ? 'floatingLabelColor.500' : 'inputBorderColor.500'}
        borderWidth={value ? '2px' : '1px'}
        focusOutlineColor={''}
        borderRadius={'4px'}
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
