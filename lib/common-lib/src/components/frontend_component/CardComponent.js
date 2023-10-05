import React from 'react'
import { HStack, VStack, Box, Progress } from 'native-base'
import { useTranslation } from 'react-i18next'
import IconByName from '../IconByName'
import ImageView from '../ImageView'
import * as FrontEndTypo from '../frontend_component'
import { arrList } from '../helper'

export default function CardComponent({
  title,
  schema,
  index,
  arr,
  label,
  item,
  onEdit,
  onDelete
}) {
  const { type } = item
  const { t } = useTranslation()
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
        {title ? (
          <FrontEndTypo.H3 fontWeight='700' bold color='textGreyColor.800'>
            {title}
          </FrontEndTypo.H3>
        ) : (
          <FrontEndTypo.H3 fontWeight='700' bold color='textGreyColor.800'>
            {index && `${index}. `}
            {type === 'vo_experience'
              ? t('VOLUNTEER_EXPERIENCE')
              : t('JOB_EXPERIENCE')}
          </FrontEndTypo.H3>
        )}
        <HStack alignItems='center'>
          {onEdit && (
            <IconByName
              name='EditBoxLineIcon'
              color='iconColor.100'
              onPress={(e) => onEdit(item)}
            />
          )}
          {onDelete && (
            <IconByName
              color='textMaroonColor.400'
              name='DeleteBinLineIcon'
              onPress={(e) => onDelete(item)}
            />
          )}
        </HStack>
      </HStack>
      <Box paddingTop='2'>
        <Progress value={arrList(item, arr)} size='xs' colorScheme='info' />
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
              {t(label?.[index] || key)}
            </FrontEndTypo.H3>

            <FrontEndTypo.H3
              color='textGreyColor.800'
              fontWeight='400'
              flex='0.4'
            >
              {schema?.properties?.[key]?.format === 'FileUpload' ||
              key === 'document_id' ? (
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
