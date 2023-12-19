import React from 'react'
import {
  Pressable,
  Text,
  VStack,
  Stack,
  FormControl,
  HStack
} from 'native-base'
import { useTranslation } from 'react-i18next'
import IconByName from '../IconByName'
import { chunk } from '../helper'

export default function CustomRadio({
  options,
  value,
  onChange,
  schema,
  required,
  ...props
}) {
  const { t } = useTranslation()
  const {
    _hstack,
    _subHstack,
    icons,
    _stackIcon,
    _pressable,
    grid,
    label,
    _box,
    format,
    readOnly
  } = schema || {}
  const { enumOptions } = options || {}
  let items = [enumOptions]
  if (grid && enumOptions?.constructor.name === 'Array') {
    items = chunk(enumOptions, grid)
  }

  return (
    <FormControl gap='6' {..._box}>
      {label && !format && (
        <FormControl.Label>
          <H2 color='textMaroonColor.400'>{t(label)}</H2>
          {required && <H2 color='textMaroonColor.400'>*</H2>}
        </FormControl.Label>
      )}
      <Stack flexDirection={grid ? 'column' : ''} {...(_hstack || {})}>
        {items?.map((subItem, subKey) => (
          <HStack
            space='2'
            key={subKey || ''}
            flexDirection='row'
            flexWrap='wrap'
            {..._subHstack}
          >
            {subItem?.map((item, key) => {
              const isSelected = value === item?.value
              const pressableStyle = {
                background: isSelected
                  ? 'linear-gradient(91deg, rgb(255 0 0) -31.46%, rgb(255, 255, 255) -31.44%, rgb(255 0 0 / 18%) -10.63%, rgba(0, 0, 0, 0) 26.75%, rgb(255, 255, 255) 70.75%, rgb(255 0 0 / 14%) 108.28%, rgba(8, 75, 130, 0) 127.93%)'
                  : '#FAFAFA'
              }

              const pressableBorderWidth = isSelected ? '2' : '1'
              const pressableBorderColor = isSelected ? 'red.500' : 'gray.400'

              return (
                <Pressable
                  key={key || ''}
                  style={pressableStyle}
                  flexDirection='row'
                  alignItems='center'
                  flex={grid ? '1' : ''}
                  p='4'
                  rounded={5}
                  borderWidth={pressableBorderWidth}
                  borderColor={pressableBorderColor}
                  mb='2'
                  {...(icons?.[key]?.['_pressable'] || _pressable || {})}
                  onPress={() => (!readOnly ? onChange(item?.value) : {})}
                >
                  <VStack
                    alignItems='center'
                    space='3'
                    flex='1'
                    {..._stackIcon}
                  >
                    {icons?.[subKey + key]?.name && (
                      <IconByName
                        {...icons[subKey + key]}
                        color={
                          isSelected
                            ? icons?.[subKey + key]?.activeColor || 'red.500'
                            : icons?.[subKey + key]?.color || 'gray.500'
                        }
                        _icon={{
                          ...(icons?.[subKey + key]?.['_icon']
                            ? icons?.[subKey + key]?.['_icon']
                            : {})
                        }}
                      />
                    )}
                    {item?.label && (
                      <Text
                        textAlign='center'
                        color={isSelected ? 'red' : 'gray'}
                      >
                        {t(item?.label)}
                      </Text>
                    )}
                  </VStack>
                </Pressable>
              )
            })}
          </HStack>
        ))}
      </Stack>
    </FormControl>
  )
}

// export default React.memo(CustomRadio)
