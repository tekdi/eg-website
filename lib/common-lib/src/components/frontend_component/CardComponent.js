import React from 'react'
import {
  HStack,
  VStack,
  Box,
  Progress,
  Divider,
  Text,
  Stack
} from 'native-base'
import { useTranslation } from 'react-i18next'
import IconByName from '../IconByName'
import ImageView from '../ImageView'
import * as FrontEndTypo from '../frontend_component'
import { arrList } from '../helper'
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
  _vstack,
  onButtonClick,
  buttonText,
  _buttonStyle,
  _buttonTextStyle
}) {
  //console.log('item', item)
  const { t } = useTranslation()
  return (
    <VStack>
      <VStack mb={3}>
        {React.isValidElement(title)
          ? title
          : title && (
              <FrontEndTypo.H3 bold color='textGreyColor.750'>
                {title}
              </FrontEndTypo.H3>
            )}
      </VStack>
      <VStack
        space='5'
        shadow={'CardComponentShadow'}
        borderWidth='1px'
        bg='white'
        borderColor='garyTitleCardBorder'
        rounded='5px'
        {..._vstack}
      >
        <VStack px='5' py={2} {..._body}>
          {/* {!isHideProgressBar && item ? (
          <Box paddingTop='2'>
            <Progress
              value={arrList(item, arr)}
              size='xs'
              colorScheme='warning'
            />
          </Box>
        ) : (
          title && !isHideDivider && <Divider />
        )} */}
          {children || (
            <VStack space='2' paddingTop={title ? '4' : '0'}>
              {arr?.map((key, index) => {
                return (
                  <Stack key={key} {..._hstack}>
                    <FrontEndTypo.H4
                      color='floatingLabelColor.500'
                      bold
                      flex='3'
                      {...(label?.[key]?._text || {})}
                    >
                      {t(label?.[key]?.label || label?.[index] || key)}
                    </FrontEndTypo.H4>
                    <HStack justifyContent='space-between' flex='4'>
                      <FrontEndTypo.H4
                        color='textGreyColor.800'
                        fontWeight='400'
                      >
                        {['FileUpload', 'file', 'img', 'Image'].includes(
                          format?.[key]
                        ) || key === 'document_id' ? (
                          <FilePreview
                            base64={item?.reference?.document_reference?.base64}
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
                      </FrontEndTypo.H4>
                      {icon?.[index] && <IconByName {...icon?.[index]} />}
                    </HStack>
                  </Stack>
                )
              })}
            </VStack>
          )}
          {(onEdit || onDelete || onButtonClick) && (
            <HStack
              alignItems='center'
              justifyContent={'center'}
              mt={'25px'}
              space={5}
            >
              {onDelete && (
                <FrontEndTypo.Secondarybutton
                  px={6}
                  onPress={(e) => onDelete(item)}
                >
                  {t('DELETE')}
                </FrontEndTypo.Secondarybutton>
              )}
              {onEdit && (
                // <IconByName
                //   name='EditBoxLineIcon'
                //   color='iconColor.100'
                //   onPress={(e) => onEdit(item)}
                // />
                <FrontEndTypo.Primarybutton
                  px={6}
                  onPress={(e) => onEdit(item)}
                >
                  {t('EDIT')}
                </FrontEndTypo.Primarybutton>
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
        </VStack>
      </VStack>
    </VStack>
  )
}

export default React.memo(CardComponent)

CardComponent.PropTypes = {
  onButtonClick: PropTypes.any,
  buttonText: PropTypes.any
}
