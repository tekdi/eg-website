import {
  Box,
  HStack,
  Modal,
  Pressable,
  Progress,
  SmallCloseIcon,
  Stack,
  Text,
  VStack
} from 'native-base'
import React, { memo, useEffect, useState, Fragment } from 'react'
import IconByName from '../IconByName'
import { changeLanguage } from 'i18next'
import { useTranslation } from 'react-i18next'
import Drawer from 'react-modern-drawer'
import { useNavigate } from 'react-router-dom'
import { authRegistryService, FrontEndTypo, useLocationData } from '../..'
import ImageView from '../ImageView'
import { ChipStatus } from '../frontend_component/Chip'
import { arrList, logout, objProps } from '../helper'
import { BodyLarge } from './HeaderTags'
import PropTypes from 'prop-types'

export default function App({
  isOpen,
  setIsOpen,
  facilitator,
  onlyIconsShow,
  exceptIconsShow,
  overlayMarginTop,
  isHideProgress,
  chipComp,
  ...props
}) {
  const { t } = useTranslation()
  const profile_url = localStorage.getItem('profile_url')
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const navigate = useNavigate()
  const [modal, setModal] = useState(false)
  const [latData = null, longData = null] = useLocationData() || []
  const token = localStorage.getItem('token')

  useEffect(() => {
    const dLang = localStorage.getItem('lang')
    changeLanguage(dLang || 'en')
  }, [])

  useEffect(() => {
    const currentStatus = localStorage.getItem('status')
    setStatus(currentStatus)
  }, [localStorage.getItem('status')])

  const changeMenu = async (e) => {
    if (e === 'logout') {
      try {
        let data = new URLSearchParams()
        const credentials = JSON.parse(localStorage.getItem('loginData')) || {}
        const logoutCredentials = {
          ...credentials,
          lat: latData,
          long: longData
        }
        if (Object.keys(logoutCredentials).length) {
          for (let param in logoutCredentials) {
            data.append(param, logoutCredentials[param])
          }
        }
        const result = await authRegistryService.logout(data)
        if (result?.success) {
          logout()
          navigate('/login')
          window.location.reload()
        }
      } catch (error) {
        console.log('logout error', error)
      }
    } else {
      localStorage.setItem('lang', e)
      changeLanguage(e)
    }
  }

  const headerName = localStorage.getItem('fullName')
    ? localStorage.getItem('fullName')
    : ''
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState)
  }

  React.useEffect(() => {
    const fetchData = () => {
      const res = objProps(facilitator)
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
    }
    if (!isHideProgress) {
      fetchData()
    }
  }, [facilitator])

  // add default value
  const isShow = (item, defaultBoolean = true) => {
    if (!onlyIconsShow && !exceptIconsShow) {
      return defaultBoolean
    }
    return (
      (!onlyIconsShow || onlyIconsShow.includes(item)) &&
      (!exceptIconsShow || !exceptIconsShow.includes(item))
    )
  }

  const handleInstallPWA = () => {
    let installButton = null
    try {
      installButton = document.getElementById('install')
    } catch (error) {
      console.log('catch')
    }
    if (installButton) {
      installButton.click()
    } else {
      alert('Unable to install PWA.')
    }
  }

  const getCohurtDetails = () => {
    const programDetails = JSON.parse(localStorage.getItem('program'))
    const academicYear = JSON.parse(localStorage.getItem('academic_year'))
    if (programDetails && academicYear) {
      return `${programDetails?.program_name}, ${academicYear?.academic_year_name}`
    }
  }

  return (
    <Drawer
      style={{
        overlay: { marginTop: overlayMarginTop },
        overflowY: 'scroll',
        overflowX: 'hidden',
        height: `100%`
      }}
      open={isOpen}
      onClose={toggleDrawer}
      direction='right'
      size='285px'
    >
      <Stack space={4}>
        <VStack space={4}>
          <Text
            marginTop={'6'}
            marginLeft={'6'}
            fontSize={'22px'}
            lineHeight={'28px'}
            fontWeight={'400'}
            color={'textGreyColor.850'}
          >
            {t('MENU')}
          </Text>

          <SmallCloseIcon
            size='lg'
            position='absolute'
            style={{ zIndex: 99999 }}
            right='6'
            top='6'
            onClick={toggleDrawer}
          />

          <HStack alignItems='Center' space={2} display='flex' px={'5'}>
            <Stack>
              {profile_url && profile_url !== 'undefined' ? (
                <ImageView
                  source={{
                    uri: profile_url
                  }}
                  alt='Image not found'
                  width={'72px'}
                  height={'72px'}
                />
              ) : (
                <IconByName
                  name='AccountCircleLineIcon'
                  color='textGreyColor.600'
                  _icon={{ size: '72' }}
                />
              )}
            </Stack>
            <VStack>
              <FrontEndTypo.H3 color='textGreyColor.850'>
                {headerName}
              </FrontEndTypo.H3>
              {chipComp || (
                <ChipStatus
                  status={
                    status ||
                    facilitator?.user_roles?.[0]?.status ||
                    'under_review'
                  }
                />
              )}
              <FrontEndTypo.H3>
                {t('ID')}: {facilitator?.id}
              </FrontEndTypo.H3>
            </VStack>
          </HStack>
        </VStack>

        <VStack space={4} p='7'>
          {!isHideProgress && (
            <Fragment>
              <FrontEndTypo.H3 color='textGreyColor.850' bold='16px'>
                {progress !== 100
                  ? t('COMPLETE_YOUR_PROFILE')
                  : t('PROFILE_COMPLETED')}
              </FrontEndTypo.H3>
              <Progress value={progress} size='sm' colorScheme='red' />

              <FrontEndTypo.H3>
                {(progress !== 100 && status === 'screened') ||
                (progress !== 100 && status === 'applied') ||
                (progress !== 100 && status !== 'shortlisted_for_orientation')
                  ? t('COMPLETE_THIS_BEFORE_ORIENTATION')
                  : ''}
              </FrontEndTypo.H3>
            </Fragment>
          )}
          <VStack space={6}>
            <Pressable
              onPress={(e) => {
                navigate('/profile')
              }}
              flex='1'
            >
              <HStack justifyContent='space-between' alignItems='center'>
                <HStack alignItems='Center' space='4'>
                  <IconByName name='UserLineIcon' size='20px' />
                  <FrontEndTypo.H3 ml='11px'>{t('PROFILE')}</FrontEndTypo.H3>
                </HStack>
              </HStack>
            </Pressable>
            {isShow('resultsBtn') && (
              <Pressable
                onPress={(e) => {
                  navigate('/results')
                }}
                flex='1'
              >
                <HStack justifyContent='space-between' alignItems='center'>
                  <HStack alignItems='Center' space='sm'>
                    <IconByName name='ArticleLineIcon' size='20px' />
                    <FrontEndTypo.H3 ml='11px'>{t('RESULTS')}</FrontEndTypo.H3>
                  </HStack>
                </HStack>
              </Pressable>
            )}

            <SubMenu
              name={t('CHANGE_LANGUAGE')}
              icon={'EarthFillIcon'}
              menus={[
                { name: 'En', onPress: () => changeMenu('en') },
                { name: 'हिं', onPress: () => changeMenu('hi') }
              ]}
            />

            {isShow('helpBtn') && (
              <Box>
                <Pressable onPress={() => setModal('bottom')} flex='1'>
                  <HStack justifyContent='space-between' alignItems='center'>
                    <HStack alignItems='Center' space='sm'>
                      <IconByName name='QuestionLineIcon' size='20px' />
                      <FrontEndTypo.H3 ml='11px'>{t('HELP')}</FrontEndTypo.H3>
                    </HStack>
                  </HStack>
                </Pressable>

                <Modal
                  isOpen={modal}
                  onClose={() => setModal(false)}
                  size='xl'
                  avoidKeyboard
                  justifyContent='flex-end'
                  bottom='4'
                >
                  <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header p='5' fontSize='16' borderBottomWidth='0'>
                      {t('NEED_HELP')}
                    </Modal.Header>
                    <Modal.Body p='5' pb='10' overflowX='auto'>
                      <HStack space='3' align-items='stretch'>
                        {[
                          {
                            icon: 'MessageLineIcon',
                            name: 'FREQUENTLY_ASKED_QUESTION'
                          },
                          {
                            icon: 'CustomerService2LineIcon',
                            name: 'CALL_SUPPORT'
                          },
                          { icon: 'CellphoneLineIcon', name: 'CALL_MY_IP' }
                        ].map((item) => (
                          <Box
                            key={item?.name}
                            p='4'
                            flex='1'
                            borderWidth='1'
                            borderColor='coolGray.500'
                            rounded='lg'
                            bg='textGreyColor.400'
                            alignItems='center'
                            gap='10px'
                          >
                            <IconByName
                              color='coolGray.500'
                              name={item?.icon}
                              isDisabled
                            />
                            <BodyLarge color='coolGray.500' textAlign='center'>
                              {t(item?.name)}
                            </BodyLarge>
                          </Box>
                        ))}
                      </HStack>
                    </Modal.Body>
                  </Modal.Content>
                </Modal>
              </Box>
            )}
            {isShow('pwaBtn') && localStorage.getItem('pwa') === 'yes' && (
              <Box>
                <Pressable onPress={handleInstallPWA} flex='1'>
                  <HStack justifyContent='space-between' alignItems='center'>
                    <HStack alignItems='Center' space='sm'>
                      <IconByName name='ArticleLineIcon' size='20px' />
                      <FrontEndTypo.H3 ml='11px'>
                        {t('INSTALL')}
                      </FrontEndTypo.H3>
                    </HStack>
                  </HStack>
                </Pressable>
              </Box>
            )}
            {isShow('loginBtn') && (
              <Box>
                {token ? (
                  <HStack>
                    <Pressable onPress={(e) => changeMenu('logout')} flex='1'>
                      <HStack
                        justifyContent='space-between'
                        alignItems='center'
                      >
                        <HStack alignItems='Center' space='sm'>
                          <IconByName name='ShutDownLineIcon' size='20px' />
                          <FrontEndTypo.H3 ml='11px'>
                            {t('LOGOUT')}
                          </FrontEndTypo.H3>
                        </HStack>
                      </HStack>
                    </Pressable>
                  </HStack>
                ) : (
                  <HStack space={2}>
                    <Pressable onPress={(e) => navigate('/login')} flex='1'>
                      <HStack
                        justifyContent='space-between'
                        alignItems='center'
                      >
                        <HStack alignItems='Center' space='sm'>
                          <IconByName name='ArticleLineIcon' size='20px' />
                          <FrontEndTypo.H3 ml='11px'>
                            {t('LOGIN')}
                          </FrontEndTypo.H3>
                        </HStack>
                      </HStack>
                    </Pressable>
                  </HStack>
                )}
              </Box>
            )}
          </VStack>
        </VStack>
        <FrontEndTypo.H4 textAlign='center'>V2.4.6</FrontEndTypo.H4>
        <FrontEndTypo.H4 textAlign='center'>
          {getCohurtDetails()}
        </FrontEndTypo.H4>
      </Stack>
    </Drawer>
  )
}

App.propTypes = {
  isOpen: PropTypes.object,
  setIsOpen: PropTypes.func,
  facilitator: PropTypes.object,
  onlyIconsShow: PropTypes.array,
  exceptIconsShow: PropTypes.array,
  overlayMarginTop: PropTypes.number,
  isHideProgress: PropTypes.bool,
  chipComp: PropTypes.any
}

const EGMenuItem = memo(({ name, icon, ...props }) => {
  const { t } = useTranslation()
  return (
    <Pressable flex='1' {...props}>
      <HStack justifyContent='space-between' alignItems='center'>
        <HStack alignItems='Center' space='sm'>
          <IconByName
            name={icon}
            size='20px'
            {...(!icon ? { style: { visibility: 'hidden' } } : {})}
          />
          <FrontEndTypo.H3 ml='11px'>{t(name)}</FrontEndTypo.H3>
        </HStack>
      </HStack>
    </Pressable>
  )
})

EGMenuItem.propTypes = {
  name: PropTypes.any,
  icon: PropTypes.any
}

const SubMenu = memo(({ menus, ...props }) => {
  const [open, setOpen] = useState(false)
  return (
    <VStack space={4}>
      <EGMenuItem {...props} onPress={(e) => setOpen(!open)} />
      {open && menus?.map((item) => <EGMenuItem key={item.name} {...item} />)}
    </VStack>
  )
})

SubMenu.propTypes = {
  menus: PropTypes.any
}
