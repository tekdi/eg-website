import React from 'react'
import { HStack, VStack } from 'native-base'
import IconByName from '../IconByName'
import ImageView from '../ImageView'
import Chip from './Chip'
import PropTypes from 'prop-types'

export function UserCard({
  item,
  title,
  subTitle,
  image,
  isIdtag,
  rightElement,
  leftElement,
  _hstack,
  _vstack,
  _image
}) {
  return (
    <HStack
      p='4'
      space='4'
      borderRadius='10px'
      borderWidth='1px'
      bg='white'
      borderColor='appliedColor'
      alignItems={'center'}
      {..._hstack}
    >
      {leftElement}
      {image ? (
        <ImageView
          source={image}
          urlObject={image?.urlObject || {}}
          {..._image}
        />
      ) : isIdtag ? (
        <Chip>{isIdtag}</Chip>
      ) : (
        <IconByName
          isDisabled
          name='AccountCircleLineIcon'
          color='gray.300'
          {..._image}
          _icon={{ size: '35', ..._image }}
        />
      )}

      <VStack
        flex='2'
        wordWrap='break-word'
        whiteSpace='normal'
        overflow='hidden'
        textOverflow='ellipsis'
        {..._vstack}
      >
        {title}
        {subTitle}
      </VStack>
      {rightElement}
    </HStack>
  )
}
export default React.memo(UserCard)

UserCard.propTypes = {
  item: PropTypes.object,
  title: PropTypes.any,
  subTitle: PropTypes.any,
  image: PropTypes.object,
  isIdtag: PropTypes.bool,
  rightElement: PropTypes.any,
  leftElement: PropTypes.any,
  _hstack: PropTypes.object,
  _vstack: PropTypes.object,
  _image: PropTypes.object
}
