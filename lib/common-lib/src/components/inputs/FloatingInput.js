import { FormControl, HStack, Input, Text } from 'native-base'
import React from 'react'
import { t } from 'i18next'
import IconByName from '../IconByName'

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
  const { title, help } = schema ? schema : {}

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
        key={title}
        onFocus={(e) => setIsfocus(true)}
        onBlur={(e) => setIsfocus(false)}
        bg={isFocus ? 'white' : ''}
        {...{ value }}
        onChange={(e) => onChange(e.target.value)}
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
