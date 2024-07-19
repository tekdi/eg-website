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
    _text,
    _icon,
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
  let keyCount = -1

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
            justifyContent={'flex-start'}
            flexDirection='row'
            flexWrap='wrap'
            {..._subHstack}
          >
            {subItem?.map((item, key) => {
              const isSelected = value === item?.value
              const pressableStyle = {
                backgroundColor: isSelected ? '#D53546' : '#FAFAFA'
              }

              // const pressableBorderWidth = isSelected ? '2' : '1'
              // const pressableBorderColor = isSelected ? 'red.500' : 'gray.400'
              keyCount++
              return (
                <Pressable
                  key={key || ''}
                  flexDirection='row'
                  alignItems='center'
                  height={'initial'}
                  flex={grid ? '1' : ''}
                  mb='2'
                  {...(icons?.[keyCount]?.name
                    ? {}
                    : {
                        style: pressableStyle,
                        py: '10px',
                        px: '47px',
                        height: 'initial',
                        rounded: 20,
                        borderWidth: '1',
                        borderColor: 'garyTitleCardBorder'
                      })}
                  {...(icons?.[keyCount]?.['_pressable'] || _pressable || {})}
                  onPress={() => (!readOnly ? onChange(item?.value) : {})}
                >
                  <VStack
                    alignItems='center'
                    space='3'
                    flex='1'
                    {..._stackIcon}
                  >
                    {icons?.[keyCount]?.name && (
                      <IconByName
                        color={
                          isSelected
                            ? icons?.[keyCount]?.activeColor || 'white'
                            : icons?.[keyCount]?.color || 'textRed.350'
                        }
                        style={pressableStyle}
                        py={'10px'}
                        px={'47px'}
                        height={'initial'}
                        rounded={20}
                        borderWidth={'1'}
                        borderColor={'garyTitleCardBorder'}
                        {..._icon}
                        {...icons[keyCount]}
                        _icon={{
                          ...icons[keyCount]?._icon,
                          color: isSelected
                            ? icons[keyCount]?._icon?.activeColor ||
                              icons[keyCount]?._icon?.color
                            : icons[keyCount]?._icon?.color ||
                              icons[keyCount]?._icon?.activeColor
                        }}
                      />
                    )}
                    {item?.label && (
                      <Text
                        textAlign='center'
                        color={
                          isSelected && !icons?.[keyCount]?.name
                            ? 'white'
                            : 'textGreyColor.900'
                        }
                        {..._text}
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
