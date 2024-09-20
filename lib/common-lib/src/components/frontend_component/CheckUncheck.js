import React from 'react'
import { HStack, Text } from 'native-base'
import { useTranslation } from 'react-i18next'
import CustomRadio from './CustomRadio'
import PropTypes from 'prop-types'

// select between 2 values radio button (yes or no)
export default function CheckUncheck({ required, schema, value, onChange }) {
  const { label, readOnly } = schema || {}
  const { t } = useTranslation()

  const checkboxIcons = [
    {
      name: 'CheckboxCircleLineIcon',
      activeName: 'CheckboxCircleFillIcon',
      activeColor: '#038400',
      px: '0',
      py: '0',
      _icon: { size: '25', activeColor: '#038400', color: '#484848' }
    },
    {
      name: 'CloseCircleLineIcon',
      activeName: 'CloseCircleFillIcon',
      activeColor: '#d53546',
      px: '0',
      py: '0',
      _icon: { size: '25', activeColor: '#d53546', color: '#484848' }
    }
  ]
  return (
    <HStack space={2} alignItems='center'>
      {required && <Text color={'danger.500'}>*</Text>}
      <CustomRadio
        options={{
          enumOptions: [{ value: '1' }, { value: '0' }]
        }}
        schema={{
          _subHstack: { space: readOnly ? 0 : 2 },
          icons: readOnly
            ? checkboxIcons.map((e) => {
                if (
                  (value === '1' && e.name === 'CloseCircleLineIcon') ||
                  (value === '0' && e.name === 'CheckboxCircleLineIcon')
                ) {
                  return {}
                }
                if (value === '1' || value === '0') {
                  return { ...e, name: e?.activeName }
                }
                return e
              })
            : checkboxIcons.map((e) => {
                if (
                  (value === '1' && e.name === 'CheckboxCircleLineIcon') ||
                  (value === '0' && e.name === 'CloseCircleLineIcon')
                ) {
                  return { ...e, name: e?.activeName }
                }
                return e
              }),
          _icon: { borderWidth: '0', style: {} },
          _box: { gap: '0', width: 'auto' },
          _pressable: { p: 0, px: '0', mb: 0, borderWidth: 0, style: {} }
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

CheckUncheck.propTypes = {
  required: PropTypes.bool,
  schema: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func
}
