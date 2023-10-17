import React from 'react'
import { HStack, VStack, Box, Progress, Divider } from 'native-base'
import { useTranslation } from 'react-i18next'
import IconByName from '../IconByName'
import ImageView from '../ImageView'
import * as FrontEndTypo from '.'
import { arrList } from '../helper'

export function UserCard({
  title,
  subTitle,
  image,
  rightElement,
  leftElement,
  _hstack
}) {
  const { t } = useTranslation()
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
      {leftElement || <React.Fragment />}
      <ImageView source={image} />
      <VStack flex='2'>
        {title || <React.Fragment />}
        {subTitle || <React.Fragment />}
      </VStack>
      {rightElement || <React.Fragment />}
    </HStack>
  )
}

export default React.memo(UserCard)
