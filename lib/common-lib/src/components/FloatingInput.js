import { FormControl, HStack, Input, Text } from 'native-base'
import React from 'react'
import { t } from 'i18next'

export default function FloatingInput({
  schema,
  options,
  value,
  onChange,
  required
}) {
  const [isFocus, setIsfocus] = React.useState(false)
  const { title, help } = schema
  return (
    <FormControl>
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
            {required && <Text color={'danger.500'}>*</Text>}
          </Text>
        </FormControl.Label>
      )}
      <Input
        key={title}
        onFocus={(e) => setIsfocus(true)}
        onBlur={(e) => setIsfocus(false)}
        bg={isFocus || value ? 'white' : ''}
        value={value ? value : ''}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={t(title)}
      />
      {help && <FormControl.HelperText>{t(help)}</FormControl.HelperText>}
    </FormControl>
  )
}
