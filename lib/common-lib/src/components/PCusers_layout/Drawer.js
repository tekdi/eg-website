import {
  ChevronRightIcon,
  HStack,
  Pressable,
  SmallCloseIcon,
  Stack,
  VStack
} from 'native-base'
import React, { useState } from 'react'
import IconByName from '../IconByName'

import Drawer from 'react-modern-drawer'
import ImageView from '../ImageView'
import { FrontEndTypo } from '../..'

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function App({ isOpen, setIsOpen, facilitator }) {
  const { t } = useTranslation()
  const profile_url = localStorage.getItem('profile_url')
  const id = localStorage.getItem('id')

  const navigate = useNavigate()

  const headerName = localStorage.getItem('fullName')
    ? localStorage.getItem('fullName')
    : ''
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState)
  }

  return (
    <Drawer
      open={isOpen}
      onClose={toggleDrawer}
      direction='left'
      size='285px'
      // style={{ zIndex: 99999 }}
    >
      <Stack space={4}>
        <VStack space={4}>
          <SmallCloseIcon
            size='sm'
            position='absolute'
            right='0'
            onClick={toggleDrawer}
          />
          <VStack alignItems='Center' display='flex'>
            {profile_url && profile_url !== 'undefined' ? (
              <ImageView
                source={{
                  uri: profile_url
                }}
                alt='Image not found'
                width={'132px'}
                height={'132px'}
              />
            ) : (
              <IconByName
                name='AccountCircleLineIcon'
                color='textGreyColor.600'
                _icon={{ size: '132' }}
              />
            )}
            <FrontEndTypo.H1 pt='15px' color='textMaroonColor.400'>
              {headerName}
            </FrontEndTypo.H1>
            <FrontEndTypo.H3 pt='15px'>
              {t('ID')}: {id}
            </FrontEndTypo.H3>
          </VStack>
        </VStack>

        <VStack space={4} p='4'>
          <VStack space={2}>
            <Pressable
              onPress={(e) => {
                navigate('/profile')
              }}
              flex='1'
            >
              <HStack justifyContent='space-between' alignItems='center'>
                <HStack alignItems='Center' space='4'>
                  <IconByName name='UserLineIcon' size='20px' />
                  <FrontEndTypo.H2 ml='19px'>{t('PROFILE')}</FrontEndTypo.H2>
                </HStack>
                <ChevronRightIcon size='sm' />
              </HStack>
            </Pressable>
          </VStack>
        </VStack>
      </Stack>
    </Drawer>
  )
}
