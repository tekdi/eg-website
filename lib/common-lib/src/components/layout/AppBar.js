import React, { useState } from 'react'
import {
  HStack,
  Box,
  StatusBar,
  Pressable,
  Input,
  Menu,
  Stack,
  InputLeftAddon,
  InputGroup,
  InputRightAddon,
  Button,
  Modal,
  VStack,
  SmallCloseIcon,
  Progress,
  ChevronRightIcon,
  Image,
  Divider,
  Alert
  // Divider
} from 'native-base'
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { useNavigate } from 'react-router-dom'
import IconByName from '../IconByName'
import { BodyLarge } from './HeaderTags'
import { arrList, logout } from '../helper'
import { useTranslation } from 'react-i18next'
import ImageView from '../ImageView'
import * as FrontEndTypo from '../frontend_component'
import { ChipStatus } from '../frontend_component/Chip'
import { changeLanguage } from 'i18next'
import { objProps } from '../helper'

export default function AppBar({
  isEnableSearchBtn,
  setSearch,
  setSearchState,
  color,
  languages,
  onPressBackButton,
  rightIcon,
  leftIcon,
  onlyIconsShow,
  exceptIconsShow,
  name,
  lang,
  setLang,
  profile_url,
  _backBtn,
  _menuBtn,
  _hstack,
  facilitator,
  ...props
}) {
  const { t } = useTranslation()
  const [searchInput, setSearchInput] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = React.useState('')
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState)
  }

  const headerName = name
    ? name
    : localStorage.getItem('fullName')
    ? localStorage.getItem('fullName')
    : ''
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const [modal, setModal] = React.useState(false)
  const styles = {
    bottom: {
      marginBottom: 0,
      marginTop: 'auto',
      scroll: 'auto'
    }
  }
  const changeMenu = (e) => {
    if (e === 'logout') {
      logout()
      navigate('/login')
      navigate(0)
    } else {
      localStorage.setItem('lang', e)
      changeLanguage(e)
      setLang ? setLang(e) : navigate(0)
    }
  }
  const handleSeachState = (boolean) => {
    if (setSearchState) setSearchState(boolean)
    setSearchInput(boolean)
  }

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

  React.useEffect(() => {
    const dLang = localStorage.getItem('lang')
    changeLanguage(dLang ? dLang : 'en')
  }, [])

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
  const handleImagePress = () => {
    navigate('/')
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

  return (
    <Box borderBottomWidth='1' borderBottomColor={'gray.300'} {...props?._box}>
      <HStack
        justifyContent='space-between'
        bg='textMaroonColor.600'
        px='2'
        py='0'
      >
        <Pressable onPress={handleImagePress}>
          <Image
            alignSelf='center'
            source={{
              uri: '/images/logos/eg-logo.png'
            }}
            alt='Educate Girls'
            resizeMode='contain'
            size={70}
          />
        </Pressable>

        {process.env.REACT_APP_SERVER_NAME && (
          <Alert status='warning' alignItems={'center'}>
            <HStack alignItems='center' space='2'>
              <FrontEndTypo.H4>
                {t(`${process.env.REACT_APP_SERVER_NAME}_SERVER`)}
              </FrontEndTypo.H4>
            </HStack>
          </Alert>
        )}

        <HStack justifyContent={'flex-end'} space='2' pt='2' pr='2'>
          {/* <FrontEndTypo.Primarybutton onPress={handleInstallPwa}>Install</FrontEndTypo.Primarybutton> */}
          {isShow('helpBtn') ? (
            <Box>
              <Button
                py='1'
                px='2'
                variant='redOutlineBtn'
                _text={{
                  fontSize: '10px'
                }}
                onPress={() => setModal('bottom')}
              >
                {t('HELP')}
              </Button>
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
                      ].map((item, index) => (
                        <Box
                          key={index}
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
          ) : (
            <React.Fragment />
          )}
          {isShow('pwaBtn') && localStorage.getItem('pwa') === 'yes' ? (
            <Box>
              <Button
                py='1'
                px='2'
                bg={'red.600'}
                isHovered={false}
                variant='redOutlineBtn'
                _text={{
                  fontSize: '10px',
                  color: 'white'
                }}
                // id='install'
                onPress={handleInstallPWA}
              >
                {t('INSTALL')}
              </Button>
            </Box>
          ) : (
            <React.Fragment />
          )}
          {isShow('loginBtn') ? (
            <Box>
              {token ? (
                <HStack>
                  <Button
                    py='1'
                    px='2'
                    variant='redOutlineBtn'
                    _text={{
                      fontWeight: '600',
                      fontSize: '10px'
                    }}
                    onPress={(e) => changeMenu('logout')}
                  >
                    {t('LOGOUT')}
                  </Button>
                </HStack>
              ) : (
                <HStack space={2}>
                  <Button
                    py='1'
                    px='2'
                    variant='redOutlineBtn'
                    _text={{
                      fontWeight: '600',
                      fontSize: '10px'
                    }}
                    onPress={(e) => navigate('/login')}
                  >
                    {t('LOGIN')}
                  </Button>
                </HStack>
              )}
            </Box>
          ) : (
            <React.Fragment />
          )}
        </HStack>
      </HStack>

      <StatusBar bg='gray.600' barStyle='light-content' />

      {/* <Box safeAreaTop bg='gray.600' /> */}

      {searchInput ? (
        <Stack alignItems='center'>
          <InputGroup width='100%'>
            <InputLeftAddon
              p='0'
              bg='transparent'
              borderWidth='0'
              children={
                <IconByName
                  size='sm'
                  name='ArrowLeftSLineIcon'
                  color={color ? color : ''}
                  onPress={() => {
                    if (onPressBackButton) {
                      onPressBackButton()
                    } else {
                      navigate(-1)
                    }
                  }}
                />
              }
            />
            <Input
              variant='unstyled'
              bg='transparent'
              size='sm'
              placeholder={t('SEARCH')}
              onChange={(e) => setSearch(e.target.value)}
            />
            <InputRightAddon
              p='0'
              bg='transparent'
              borderWidth='0'
              children={
                <IconByName
                  color='coolGray.500'
                  name='CloseCircleLineIcon'
                  p='0'
                  onPress={(e) => handleSeachState(false)}
                />
              }
            />
          </InputGroup>
        </Stack>
      ) : isShow('backBtn') ||
        isShow('userInfo') ||
        isShow('langBtn') ||
        isShow('menuBtn', false) ? (
        <HStack
          bg='transparent'
          justifyContent='space-between'
          alignItems='center'
          minH='32px'
          {..._hstack}
        >
          <HStack space='4' alignItems='center'>
            {isShow('backBtn') && (
              <IconByName
                size='sm'
                pl='0'
                name='ArrowLeftSLineIcon'
                color={color ? color : ''}
                {..._backBtn}
                onPress={() => {
                  if (onPressBackButton) {
                    onPressBackButton()
                  } else {
                    navigate(-1)
                  }
                }}
              />
            )}

            {isShow('menuBtn', false) && (
              <Box>
                <IconByName
                  name='MenuLineIcon'
                  onPress={() => {
                    setIsOpen(true)
                  }}
                />
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
                          color='textMaroonColor.400'
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
                          <FrontEndTypo.H1
                            pt='15px'
                            color='textMaroonColor.400'
                          >
                            {headerName}
                          </FrontEndTypo.H1>
                          <ChipStatus
                            status={
                              facilitator ? facilitator?.status : 'under_review'
                            }
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
                        <Progress
                          value={progress}
                          size='xs'
                          colorScheme='red'
                        />
                      </Box>
                      <FrontEndTypo.H3>
                        {(progress !== 100 && status === 'screened') ||
                        (progress !== 100 && status === 'applied') ||
                        (progress !== 100 &&
                          status !== 'shortlisted_for_orientation')
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
                          <HStack
                            justifyContent='space-between'
                            alignItems='center'
                          >
                            <HStack alignItems='Center' space='4'>
                              <IconByName name='UserLineIcon' size='20px' />
                              <FrontEndTypo.H2 ml='19px'>
                                {t('PROFILE')}
                              </FrontEndTypo.H2>
                            </HStack>
                            <ChevronRightIcon size='sm' color='textBlack.500' />
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
                          <HStack
                            justifyContent='space-between'
                            alignItems='center'
                          >
                            <HStack alignItems='Center' space='sm'>
                              <IconByName name='ArticleLineIcon' size='20px' />
                              <FrontEndTypo.H2 ml='19px'>
                                {t('CERTIFICATE')}
                              </FrontEndTypo.H2>
                            </HStack>
                            <ChevronRightIcon size='sm' color='textBlack.500' />
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
            )}
            {isShow('userInfo') && (
              <HStack space='1' alignItems='center'>
                {profile_url ? (
                  <ImageView
                    source={{
                      uri: profile_url
                    }}
                    alt='Image not found'
                    width={'24px'}
                    height={'24px'}
                  />
                ) : (
                  <IconByName
                    isDisabled
                    name='AccountCircleLineIcon'
                    color='gray.300'
                    _icon={{ size: '24px' }}
                  />
                )}
                <BodyLarge
                  wordWrap='break-word'
                  width='160px'
                  whiteSpace='nowrap'
                  overflow='hidden'
                  textOverflow='ellipsis'
                >
                  {headerName ? headerName : ''}
                </BodyLarge>
              </HStack>
            )}
            {leftIcon && leftIcon}
          </HStack>

          <HStack alignItems={'center'}>
            {!searchInput && isEnableSearchBtn ? (
              <IconByName
                color={color ? color : ''}
                size='sm'
                name='SearchLineIcon'
                onPress={(e) => handleSeachState(true)}
              />
            ) : (
              <React.Fragment />
            )}
            {isShow('langBtn') ? (
              <Stack px='2'>
                <Menu
                  // right='100%'
                  // w='190'
                  placement='bottom right'
                  trigger={(triggerProps) => {
                    return (
                      <Pressable
                        accessibilityLabel='More options menu'
                        {...triggerProps}
                      >
                        <HStack alignItems='center'>
                          <FrontEndTypo.H3>
                            {(lang && lang !== '') ||
                            localStorage.getItem('lang')
                              ? languages.find(
                                  (e) =>
                                    e?.code === lang ||
                                    e?.code === localStorage.getItem('lang')
                                )?.['title']
                              : 'En'}
                          </FrontEndTypo.H3>
                          <IconByName
                            pr='0'
                            name='ArrowDownSFillIcon'
                            isDisabled={true}
                            color={color ? color : ''}
                            _text={{ size: 'sm' }}
                          />
                        </HStack>
                      </Pressable>
                    )
                  }}
                >
                  {languages?.map((e, index) => (
                    <Menu.Item
                      key={index}
                      label={e.title}
                      textValue={e.code}
                      onPress={(item) => changeMenu(e.code)}
                    >
                      {e.title}
                    </Menu.Item>
                  ))}
                </Menu>
              </Stack>
            ) : (
              <React.Fragment />
            )}
            {/*{rightIcon && rightIcon}
             {isShow('notificationBtn') && (
              <IconByName
                color={color ? color : ''}
                size='20px'
                name='Notification2LineIcon'
              />
            )} */}
          </HStack>
        </HStack>
      ) : (
        <React.Fragment />
      )}
    </Box>
  )
}
