import React, { useEffect, useState } from 'react'
import { HStack, VStack, Box, Progress, Divider, Text } from 'native-base'
import { useTranslation } from 'react-i18next'
import IconByName from '../IconByName'
import ImageView from '../ImageView'
import * as FrontEndTypo from '../frontend_component'
import { arrList, chunk } from '../helper'
import PropTypes from 'prop-types'
import FilePreview from '../FilePreview'

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
  _subHstack,
  _vstack,
  onButtonClick,
  buttonText,
  _buttonStyle,
  _buttonTextStyle,
  footerComponent,
  grid
}) {
  //console.log('item', item)
  const { t } = useTranslation()
  const [labelMap, setLabelMap] = useState()
  const [arrayMap, setArrayMap] = useState()

  useEffect((e) => {
    setArrayMap(
      arr ? chunk(arr, grid || 1) : chunk(Object.keys(item) || [], grid || 1)
    )
    setLabelMap(
      label
        ? chunk(label, grid || 1)
        : chunk(Object.keys(item) || [], grid || 1)
    )
  }, [])

  return (
    <VStack
      space='5'
      borderWidth='1px'
      bg='white'
      borderColor='appliedColor'
      rounded='10px'
      {..._vstack}
    >
      {(onEdit || onDelete || title || onButtonClick) && (
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
          {(onEdit || onDelete || onButtonClick) && (
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
              {onButtonClick && (
                <FrontEndTypo.DefaultButton
                  onPress={() => onButtonClick()}
                  {..._buttonStyle}
                >
                  <Text {..._buttonTextStyle}>{buttonText}</Text>
                </FrontEndTypo.DefaultButton>
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
          <VStack
            space='2'
            paddingTop={title ? '4' : '0'}
            divider={
              <Box borderBottomWidth='1px' borderBottomColor='appliedColor' />
            }
          >
            {arrayMap?.map((arrData, parentIndex) => (
              <HStack
                key={arrData}
                alignItems='Center'
                justifyContent='space-between'
                {..._hstack}
              >
                {arrData?.map((key, index) => {
                  return (
                    <HStack
                      key={key}
                      alignItems='Center'
                      justifyContent='space-between'
                      flex='1'
                      {..._subHstack}
                    >
                      <FrontEndTypo.H3
                        color='textGreyColor.50'
                        fontWeight='400'
                        flex='3'
                        {...(labelMap?.[parentIndex]?.[key]?._text || {})}
                      >
                        {t(
                          labelMap?.[parentIndex]?.[key]?.label ||
                            labelMap?.[parentIndex]?.[index] ||
                            key
                        )}
                      </FrontEndTypo.H3>
                      <HStack justifyContent='space-between' flex='4'>
                        <FrontEndTypo.H3
                          color='textGreyColor.800'
                          fontWeight='400'
                        >
                          {['FileUpload', 'file', 'img', 'Image'].includes(
                            format?.[key]
                          ) || key === 'document_id' ? (
                            <FilePreview
                              base64={
                                item?.reference?.document_reference?.base64
                              }
                              /*source={{ document_id: item?.[key] }}
                          urlObject={item?.[key]?.fileUrl ? item?.[key] : null}*/
                              _button={{ p: 0 }}
                              text={
                                <HStack space={'2'}>
                                  {t('LINK')}
                                  <IconByName name='ExternalLinkFillIcon' />
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
              </HStack>
            ))}
          </VStack>
        )}
      </VStack>
      {footerComponent || ''}
    </VStack>
  )
}

export default React.memo(CardComponent)

CardComponent.PropTypes = {
  onButtonClick: PropTypes.any,
  buttonText: PropTypes.any
}
