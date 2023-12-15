import { Box, HStack, Progress, VStack } from 'native-base'
import React from 'react'
import { useTranslation } from 'react-i18next'
import * as FrontEndTypo from './frontend_component'
import IconByName from './IconByName'
import { arrList } from './helper'
import ImageView from './ImageView'

export function ItemComponent({
  title,
  item,
  BenificiaryStatus,
  onlyField,
  onEdit,
  notShow,
  schema
}) {
  const { t } = useTranslation()
  let arr = Object.keys(schema?.properties ? schema?.properties : {})
  if (onlyField?.constructor.name === 'Array' && onlyField?.length) {
    arr = onlyField
  } else if (
    !onlyField &&
    notShow?.constructor.name === 'Array' &&
    notShow?.length
  ) {
    arr = arr.filter((e) => !notShow?.includes(e))
  }
  return (
    <VStack
      px='5'
      py='4'
      space='3'
      borderRadius='10px'
      borderWidth='1px'
      bg='white'
      borderColor='appliedColor'
    >
      <HStack justifyContent='space-between' alignItems='Center'>
        <FrontEndTypo.H3 fontWeight='700' bold color='textGreyColor.800'>
          {title}
        </FrontEndTypo.H3>
        {onEdit && (
          <HStack alignItems='center'>
            {BenificiaryStatus !== 'enrolled_ip_verified' && (
              <IconByName
                name='EditBoxLineIcon'
                color='iconColor.100'
                onPress={(e) => onEdit(item)}
              />
            )}
          </HStack>
        )}
      </HStack>
      <Box paddingTop='2'>
        <Progress value={arrList(item, arr)} size='xs' colorScheme='red' />
      </Box>
      <VStack space='2' paddingTop='5'>
        {arr?.map((key, index) => (
          <HStack
            key={key}
            alignItems='Center'
            justifyContent='space-between'
            borderBottomWidth='1px'
            borderBottomColor='appliedColor'
          >
            <FrontEndTypo.H3
              color='textGreyColor.50'
              fontWeight='400'
              flex='0.3'
            >
              {t(schema?.properties?.[key]?.label)}
            </FrontEndTypo.H3>

            <FrontEndTypo.H3
              color='textGreyColor.800'
              fontWeight='400'
              flex='0.4'
            >
              {schema?.properties?.[key]?.format === 'FileUpload' ? (
                <ImageView source={{ document_id: item?.[key] }} text='link' />
              ) : item?.[key] ? (
                item?.[key]
              ) : (
                '-'
              )}
            </FrontEndTypo.H3>
          </HStack>
        ))}
      </VStack>
    </VStack>
  )
}

export default React.memo(ItemComponent)
