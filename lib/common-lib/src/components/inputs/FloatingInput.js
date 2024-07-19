import { FormControl, Input, Text } from 'native-base'
import React from 'react'
import { t } from 'i18next'

export default function FloatingInput({
  schema,
  options,
  value,
  onChange,
  required,
  placeholder,
  isInvalid
}) {
  const [isFocus, setIsfocus] = React.useState(false)
  const { title, help, _input, regex, label, readOnly } = schema || {}
  const handalChange = (e) => {
    const newValue = e.target.value
    let newRegex = /^[\u0900-\u097F\s]+$/
    if (regex?.constructor?.name === 'RegExp') {
      if (!newValue) {
        // if input value not exist then we set empty value
        onChange()
      } else if (regex.test(newValue)) {
        // if schema have regex on that confition input value change
        onChange(newValue)
      } else if (value) {
        // if regex false then we set old value
        onChange(value)
      } else {
        // if value not exist then we set empty value
        onChange()
      }
    } else {
      if (!newValue) {
        // if input value not exist then we set empty value
        onChange()
      } else if (!newRegex?.test(newValue)) {
        // if default regex is true then input value change
        onChange(newValue)
      } else if (value) {
        // if default regex false then we set old value
        onChange(value)
      } else {
        // if value not exist then we set empty value
        onChange()
      }
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
          // style={{
          //   ...(isFocus || value
          //     ? {
          //         top: '-1px',
          //         opacity: 1,
          //         zIndex: 5,
          //         transition: 'all 0.3s ease'
          //       }
          //     : {
          //         top: '0.5rem',
          //         zIndex: -2,
          //         opacity: 0,
          //         transition: 'all 0.2s ease-in-out'
          //       })
          // }}
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
        key={title + schema}
        {...(readOnly ? { isReadOnly: true } : {})}
        onFocus={(e) => setIsfocus(true)}
        onBlur={(e) => setIsfocus(false)}
        bg={isFocus ? 'white' : ''}
        value={value || ''}
        onChange={handalChange}
        placeholder={placeholder ? t(placeholder) : label ? t(label) : t(title)}
        {..._input}
      />
      {help?.constructor?.name === 'String' && isInvalid ? (
        <FormControl.ErrorMessage>{t(help)}</FormControl.ErrorMessage>
      ) : help?.constructor?.name === 'String' ? (
        <FormControl.HelperText>{t(help)}</FormControl.HelperText>
      ) : (
        help
      )}
    </FormControl>
  )
}
