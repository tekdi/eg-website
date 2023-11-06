import { HStack, Text } from 'native-base'
import { useTranslation } from 'react-i18next'
import CustomRadio from './CustomRadio'
import React from 'react'

// select between 2 values radio button (yes or no)
export default function CheckUncheck({ required, schema, value, onChange }) {
  const { label } = schema || {}
  const { t } = useTranslation()

  const checkboxIcons = [
    { name: 'CheckboxCircleLineIcon', activeColor: 'success.500' },
    { name: 'CloseCircleLineIcon', activeColor: 'red.500' }
  ]

  return (
    <HStack space={2}>
      {required && <Text color={'danger.500'}>*</Text>}
      <CustomRadio
        options={{
          enumOptions: [{ value: '1' }, { value: '0' }]
        }}
        schema={{
          icons: checkboxIcons,
          _box: { gap: '0', width: 'auto' },
          _pressable: { p: 0, mb: 0, borderWidth: 0, style: {} }
        }}
        value={value}
        onChange={(e) => {
          onChange && onChange(e)
        }}
      />
      <Text flex='4'>{label ? t(label) : ''}</Text>
    </HStack>
  )
}

// export default React.memo(CheckUncheck)
