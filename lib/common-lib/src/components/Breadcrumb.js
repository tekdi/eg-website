import { HStack, Pressable, Text } from 'native-base'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Breadcrumb({
  data,
  drawer,
  _hstack,
  _box,
  _text,
  _link
}) {
  const navigate = useNavigate()
  if (Array.isArray(data)) {
    return (
      <HStack space={2} {..._hstack}>
        {data.map((item, index) => (
          <HStack space={2} alignItems='center' {..._box} key={index || ''}>
            {React.isValidElement(item) ? (
              item
            ) : typeof item === 'string' ? (
              <Text {..._text}>{item}</Text>
            ) : item?.link ? (
              <Pressable onPress={(e) => navigate(item?.link)} {..._link}>
                <Text color={'primary'} {..._text}>
                  {item?.label ? item?.label : item?.title ? item?.title : ''}
                </Text>
              </Pressable>
            ) : (
              <Text {..._text}>
                {item?.label ? item?.label : item?.title ? item?.title : ''}
              </Text>
            )}
            {data.length > index + 1 && (drawer || <Text>/</Text>)}
          </HStack>
        ))}
      </HStack>
    )
  } else {
    return <Text>{`data ${typeof data} expected array`}</Text>
  }
}
