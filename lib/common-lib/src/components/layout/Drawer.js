import {
  Box,
  ChevronRightIcon,
  Divider,
  HStack,
  Pressable,
  Progress,
  SmallCloseIcon,
  Stack,
  VStack
} from 'native-base'
import React, { useState } from 'react'
import IconByName from '../IconByName'

import Drawer from 'react-modern-drawer'
import ImageView from '../ImageView'
import { FrontEndTypo } from '../..'
import { ChipStatus } from '../frontend_component/Chip'
import { objProps, arrList } from '../helper'
import { useTranslation } from 'react-i18next'

export default function App({ isOpen, setIsOpen, facilitator }) {
  const { t } = useTranslation()
  const profile_url = localStorage.getItem('profile_url')
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = React.useState('')

  const headerName = localStorage.getItem('fullName')
    ? localStorage.getItem('fullName')
    : ''
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState)
  }

  const res = objProps(facilitator)

  React.useEffect(() => {
    setProgress(
      arrList(
        {
          ...res,
          qua_name: facilitator?.qualifications?.qualification_master?.name
        },
        [
          'device_ownership',
          'mobile',
          'device_type',
          'gender',
          'marital_status',
          'social_category',
          'name',
          'contact_number',
          'availability',
          'aadhar_no',
          'aadhaar_verification_mode',
          'aadhar_verified',
          'qualification_ids',
          'qua_name'
        ]
      )
    )
    setStatus(facilitator?.status)
  }, [])

  return (
    <Box>
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction='left'
        size='285px'
        style={{ zIndex: 99999 }}
      >
        <Stack>
          <Box>
            <VStack paddingTop='10px' paddingRight='5'>
              <SmallCloseIcon
                size='sm'
                paddingLeft='250px'
                onClick={toggleDrawer}
              />

              <VStack alignItems='Center' display='flex'>
                {profile_url ? (
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
                <ChipStatus
                  status={facilitator ? facilitator?.status : 'under_review'}
                />
              </VStack>
            </VStack>
          </Box>

          <Box pt='20px' gap='15px' pl='16px'>
            <FrontEndTypo.H2 bold='16px'>
              {progress !== 100
                ? t('COMPLETE_YOUR_PROFILE')
                : t('PROFILE_COMPLETED')}
            </FrontEndTypo.H2>
            <Box marginRight='10'>
              <Progress value={progress} size='xs' colorScheme='info' />
            </Box>
            <FrontEndTypo.H3>
              {(progress !== 100 && status === 'screened') ||
              (progress !== 100 && status === 'applied') ||
              (progress !== 100 && status !== 'shortlisted_for_orientation')
                ? t('COMPLETE_THIS_BEFORE_ORIENTATION')
                : ''}
            </FrontEndTypo.H3>
            {/* </Pressable> */}

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
              <Divider
                orientation='horizontal'
                background='dividerColor'
                width='268px'
                thickness='2'
              />
              <Pressable
                onPress={(e) => {
                  navigate('/certificate')
                }}
                flex='1'
              >
                <HStack justifyContent='space-between' alignItems='center'>
                  <HStack alignItems='Center' space='sm'>
                    <IconByName name='ArticleLineIcon' size='20px' />
                    <FrontEndTypo.H2 ml='19px'>
                      {t('CERTIFICATE')}
                    </FrontEndTypo.H2>
                  </HStack>
                  <ChevronRightIcon size='sm' />
                </HStack>
              </Pressable>
              {/* <Divider
                          orientation='horizontal'
                          background='dividerColor'
                          width='268px'
                          thickness='1'
                        />
                        <HStack
                          alignItems='Center'
                          justifyContent='space-between'
                        >
                          <HStack alignItems='Center' space='sm'>
                            <IconByName
                              mt='5px'
                              size='20px'
                              name='Chat4LineIcon'
                            />
                            <FrontEndTypo.H2 ml='19px'>
                              {t('FAQS')}
                            </FrontEndTypo.H2>
                          </HStack>
                          <ChevronRightIcon size='sm' />
                        </HStack>
                        <Divider
                          orientation='horizontal'
                          background='dividerColor'
                          width='268px'
                          thickness='1'
                        />
                        <HStack
                          alignItems='Center'
                          justifyContent='space-between'
                        >
                          <HStack alignItems='Center' space='sm'>
                            <IconByName name='PhoneLineIcon' size='20px' />
                            <FrontEndTypo.H2 ml='19px'>
                              {t('CALL_SUPPORT')}
                            </FrontEndTypo.H2>
                          </HStack>
                          <ChevronRightIcon size='sm' />
                        </HStack>
                        <Divider
                          orientation='horizontal'
                          background='dividerColor'
                          width='268px'
                          thickness='1'
                        />
                        <HStack
                          alignItems='Center'
                          justifyContent='space-between'
                        >
                          <HStack alignItems='Center' space='sm'>
                            <IconByName name='GroupLineIcon' size='20px' />
                            <FrontEndTypo.H2 ml='19px'>
                              {t('PRERAK_COMMUNITY')}
                            </FrontEndTypo.H2>
                          </HStack>
                          <ChevronRightIcon size='sm' />
                        </HStack>
                        <Divider
                          orientation='horizontal'
                          background='dividerColor'
                          width='268px'
                          thickness='1'
                        />
                        <HStack
                          alignItems='Center'
                          justifyContent='space-between'
                        >
                          <HStack alignItems='Center' space='sm'>
                            <IconByName name='Settings4LineIcon' size='20px' />
                            <FrontEndTypo.H2 ml='19px'>
                              {t('SETTINGS')}
                            </FrontEndTypo.H2>
                          </HStack>
                          <ChevronRightIcon ml='52%' size='sm' />
                        </HStack>
                        <Divider
                          orientation='horizontal'
                          background='dividerColor'
                          width='268px'
                          thickness='1'
                        /> */}
            </VStack>
          </Box>
        </Stack>
      </Drawer>
    </Box>
  )
}
