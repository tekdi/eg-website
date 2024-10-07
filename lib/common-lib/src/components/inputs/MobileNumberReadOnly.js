import React, { useState, useEffect } from 'react'
import { FormControl, Input, Text } from 'native-base'
import { t } from 'i18next'
import IconByName from '../IconByName'
import PropTypes from 'prop-types'

export default function MobileNumberReadOnly({
  schema,
  value,
  onChange,
  required,
  placeholder,
  isInvalid
}) {
  const [isFocus, setIsFocus] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const { title, help } = schema || {}

  useEffect(() => {
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
            ...(isFocus || value
              ? {
                  top: '-1px',
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
          bg: 'transparent'
        }}
        minH={'56px'}
        fontSize={'16px'}
        lineHeight={'24px'}
        borderRadius={'4px'}
        letterSpacing={'0.5px'}
        fontWeight={'400'}
        color={'inputValueColor.500'}
        focusOutlineColor={''}
        borderColor={'floatingLabelColor.500'}
        borderWidth={'2px'}
        type='number'
        keyboardType='numeric'
        key={title}
        InputLeftElement={<Text ml='2'>+91</Text>}
        InputRightElement={
          <IconByName name='PhoneLineIcon' isDisabled={true} mr='2' />
        }
        onFocus={(e) => setIsFocus(true)}
        onBlur={(e) => setIsFocus(false)}
        bg={isFocus ? 'white' : ''}
        value={inputValue || ''}
        onChange={handalChange}
        placeholder={placeholder ? t(placeholder) : t(title)}
        isReadOnly
      />
      {help && isInvalid ? (
        <FormControl.ErrorMessage>{t(help)}</FormControl.ErrorMessage>
      ) : (
        help && <FormControl.HelperText>{t(help)}</FormControl.HelperText>
      )}
    </FormControl>
  )
}

MobileNumberReadOnly.propTypes = {
  schema: PropTypes.object,
  value: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  isInvalid: PropTypes.bool
}
