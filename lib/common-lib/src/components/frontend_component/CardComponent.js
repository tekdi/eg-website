import { Box, Divider, HStack, Progress, Text, VStack } from 'native-base'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import FilePreview from '../FilePreview'
import IconByName from '../IconByName'
import * as FrontEndTypo from '../frontend_component'
import { arrList, chunk } from '../helper'
import ImageView from '../ImageView'

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

  useEffect(
    (e) => {
      if ((item && item?.constructor.name == 'Object') || !children) {
        // convert to chunk
        setArrayMap(
          arr && Array.isArray(arr)
            ? chunk(arr, grid || 1)
            : chunk(Object.keys(item || {}), grid || 1)
        )
        setLabelMap(
          label && Array.isArray(label)
            ? chunk(label, grid || 1)
            : chunk(Object.keys(item || {}), grid || 1)
        )
      }
    },
    [arr, grid, label, item]
  )

  return (
    <VStack {..._vstack}>
      {(onDelete || title || onButtonClick) && (
        <HStack
          justifyContent='space-between'
          alignItems='Center'
          px='1'
          py='10px'
          roundedTop={'10px'}
          {..._header}
        >
          {React.isValidElement(title)
            ? title
            : title && (
                <FrontEndTypo.H3 fontWeight='600' color='textGreyColor.750'>
                  {title}
                </FrontEndTypo.H3>
              )}
          {onEdit && (
            <HStack>
              <IconByName
                name='PencilLineIcon'
                color='iconColor.200'
                _icon={{ size: '20' }}
                onPress={(e) => onEdit(item)}
              />
            </HStack>
          )}
        </HStack>
      )}
      <VStack
        px='23px'
        pt='10px'
        pb={'23px'}
        borderWidth='1px'
        bg='white'
        borderColor='garyTitleCardBorder'
        shadow={'CardComponentShadow'}
        rounded='5px'
        {..._body}
      >
        {isHideProgressBar === false && item ? (
          <Box paddingTop='2'>
            <Progress
              value={arrList(item, arr)}
              size='xs'
              colorScheme='warning'
            />
          </Box>
        ) : (
          title && isHideDivider === false && <Divider />
        )}
        {children || (
          <VStack space='6'>
            {arrayMap?.map((arrData, parentIndex) => (
              <HStack
                key={arrData}
                alignItems='Center'
                justifyContent='space-between'
                {..._hstack}
              >
                {arrData?.map((key, index) => {
                  return (
                    <VStack key={key} flex='1' {..._subHstack}>
                      <FrontEndTypo.H4
                        color='floatingLabelColor.500'
                        fontWeight='600'
                        letterSpacing='0.5px'
                        flex='3'
                        {...(labelMap?.[parentIndex]?.[index]?._text || {})}
                        {...(labelMap?.[parentIndex]?.[key]?._text || {})}
                      >
                        {t(
                          labelMap?.[parentIndex]?.[key]?.label ||
                            labelMap?.[parentIndex]?.[index]?.label ||
                            labelMap?.[parentIndex]?.[key]?.title ||
                            labelMap?.[parentIndex]?.[index]?.title ||
                            labelMap?.[parentIndex]?.[index] ||
                            key
                        )}
                      </FrontEndTypo.H4>
                      <HStack
                        justifyContent='space-between'
                        flex='4'
                        {...(labelMap?.[parentIndex]?.[index]?._value || {})}
                        {...(labelMap?.[parentIndex]?.[key]?._value || {})}
                      >
                        <FrontEndTypo.H3
                          color='inputValueColor.500'
                          letterSpacing='0.5px'
                          // style={{ wordBreak: 'break-all' }}
                        >
                          {['FileUpload', 'file', 'img', 'Image'].includes(
                            format?.[key]
                          ) || key === 'document_id' ? (
                            <ImageView
                              source={{ document_id: item?.[key] }}
                              text='Link'
                            />
                          ) : item?.[key] ? (
                            item?.[key]
                          ) : (
                            '-'
                          )}
                        </FrontEndTypo.H3>
                        {icon?.[index] && <IconByName {...icon?.[index]} />}
                      </HStack>
                    </VStack>
                  )
                })}
              </HStack>
            ))}
            {(onDelete || onButtonClick || onEdit) && (
              <HStack space={4} alignItems='center' justifyContent={'center'}>
                {onDelete && (
                  <FrontEndTypo.Secondarybutton onPress={(e) => onDelete(item)}>
                    <FrontEndTypo.H3
                      lineHeight='20px'
                      letterSpacing='0.1px'
                      fontWeight='500'
                      color='textRed.350'
                    >
                      {t('DELETE')}
                    </FrontEndTypo.H3>
                  </FrontEndTypo.Secondarybutton>
                )}

                {/* {onEdit && (
                  <FrontEndTypo.Primarybutton onPress={(e) => onEdit(item)}>
                    <FrontEndTypo.H3
                      lineHeight='20px'
                      letterSpacing='0.1px'
                      fontWeight='500'
                      color='white'
                    >
                      {t('EDIT')}
                    </FrontEndTypo.H3>
                  </FrontEndTypo.Primarybutton>
                )} */}
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
          </VStack>
        )}
        {footerComponent || <React.Fragment />}
      </VStack>
    </VStack>
  )
}

export default React.memo(CardComponent)

CardComponent.PropTypes = {
  onButtonClick: PropTypes.any,
  buttonText: PropTypes.any
}
