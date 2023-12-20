import React from 'react'
import { HStack, VStack, Box, Progress, Divider } from 'native-base'
import { useTranslation } from 'react-i18next'
import IconByName from '../IconByName'
import ImageView from '../ImageView'
import * as FrontEndTypo from '../frontend_component'
import { arrList } from '../helper'

export function CardComponent({
  title,
  format,
  arr,
  label,
  item,
  onEdit,
  onDelete,
  isHideProgressBar,
  icon,
  children,
  isHideDivider,
  _header,
  _body,
  _hstack,
  _vstack
}) {
  const { t } = useTranslation()
  return (
    <VStack
      space='5'
      borderWidth='1px'
      bg='white'
      borderColor='appliedColor'
      rounded='10px'
      {..._vstack}
    >
      {(onEdit || onDelete || title) && (
        <HStack
          justifyContent='space-between'
          alignItems='Center'
          px='2'
          pt='4'
          bg='white'
          roundedTop={'10px'}
          {..._header}
        >
          {React.isValidElement(title)
            ? title
            : title && (
                <FrontEndTypo.H3 bold color='textGreyColor.800'>
                  {title}
                </FrontEndTypo.H3>
              )}
          {(onEdit || onDelete) && (
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
          )}
        </HStack>
      )}
      <VStack px='5' pb='4' roundedBottom={'10px'} {..._body}>
        {!isHideProgressBar && item ? (
          <Box paddingTop='2'>
            <Progress
              value={arrList(item, arr)}
              size='xs'
              colorScheme='warning'
            />
          </Box>
        ) : (
          title && !isHideDivider && <Divider />
        )}
        {children || (
          <VStack space='2' paddingTop={title ? '4' : '0'}>
            {arr?.map((key, index) => {
              return (
                <HStack
                  key={key}
                  alignItems='Center'
                  justifyContent='space-between'
                  borderBottomWidth='1px'
                  borderBottomColor='appliedColor'
                  {..._hstack}
                >
                  <FrontEndTypo.H3
                    color='textGreyColor.50'
                    fontWeight='400'
                    flex='3'
                    {...(label?.[key]?._text || {})}
                  >
                    {t(label?.[key]?.label || label?.[index] || key)}
                  </FrontEndTypo.H3>
                  <HStack justifyContent='space-between' flex='4'>
                    <FrontEndTypo.H3 color='textGreyColor.800' fontWeight='400'>
                      {['FileUpload', 'file', 'img', 'Image'].includes(
                        format?.[key]
                      ) || key === 'document_id' ? (
                        <ImageView
                          source={{ document_id: item?.[key] }}
                          urlObject={item?.[key]}
                          _button={{ p: 0 }}
                          text={
                            <HStack space={'2'}>
                              {t('LINK')}
                              <IconByName
                                name='ExternalLinkLineIcon'
                                isDisabled
                              />
                            </HStack>
                          }
                        />
                      ) : item?.[key] ? (
                        item?.[key]
                      ) : (
                        '-'
                      )}
                    </FrontEndTypo.H3>
                    {icon?.[index] && <IconByName {...icon?.[index]} />}
                  </HStack>
                </HStack>
              )
            })}
          </VStack>
        )}
      </VStack>
    </VStack>
  )
}

export default React.memo(CardComponent)
