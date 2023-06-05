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
  Divider
} from 'native-base'
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { useNavigate } from 'react-router-dom'
import IconByName from '../IconByName'
import { BodyLarge, Caption } from './HeaderTags'
import { logout } from '../helper'
import { changeLanguage, t } from 'i18next'
import ImageView from '../ImageView'
import { FrontEndTypo } from '../..'
import { ChipStatus } from '../frontend_component/Chip'
export default function AppBar({
  isEnableSearchBtn,
  setSearch,
  setSearchState,
  color,
  languages,
  onPressBackButton,
  onPressMenuButton,
  rightIcon,
  onlyIconsShow,
  exceptIconsShow,
  name,
  lang,
  setLang,
  profile_url,
  _backBtn,
  _menuBtn,
  _hstack,
  leftIcon,
  ...props
}) {
  const [searchInput, setSearchInput] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
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

  const isShow = (item) =>
    (!onlyIconsShow || onlyIconsShow.includes(item)) &&
    (!exceptIconsShow || !exceptIconsShow.includes(item))

  React.useEffect(() => {
    const dLang = localStorage.getItem('lang')
    changeLanguage(dLang ? dLang : 'en')
  }, [])

  return (
    <Box
      p='4'
      borderBottomWidth='1'
      borderBottomColor={'gray.300'}
      {...props?._box}
    >
      <HStack justifyContent={'space-between'} space='2'>
        {isShow('menuBtn') ? (
          <Box>
            <IconByName
              name='MenuLineIcon'
              onPress={() => {
                setIsOpen(true)
              }}
            />
            {console.log(isOpen)}
            <Drawer
              open={isOpen}
              onClose={toggleDrawer}
              direction='left'
              size='330px'
            >
              <Stack>
                <Box>
                  <VStack paddingTop='10px' paddingRight='5'>
                    <SmallCloseIcon
                      size='sm'
                      onClick={toggleDrawer}
                      color='textMaroonColor.400'
                      style={{ position: 'absolute', right: '10px' }}
                    />

                    <VStack alignItems='Center' display='flex'>
                      <IconByName
                        name='AccountCircleLineIcon'
                        color='textGreyColor.600'
                        _icon={{ size: '132' }}
                      />
                      <FrontEndTypo.H1 pt='15px' color='textMaroonColor.400'>
                        Rachana Wagh
                      </FrontEndTypo.H1>
                      <ChipStatus status={'under_review'} />
                    </VStack>
                  </VStack>
                </Box>

                <Box pt='20px' gap='20px' pl='16px'>
                  <FrontEndTypo.H2 bold color='textGreyColor.800'>
                    {t('COMPLETE_YOUR_PROFILE')}
                  </FrontEndTypo.H2>
                  <Box gap='8px'>
                    <HStack justifyContent='space-between'>
                      <Progress
                        width='80%'
                        colorScheme='info'
                        value={80}
                        size='sm'
                      />
                      <ChevronRightIcon size='sm' color='textMaroonColor.400' />
                    </HStack>
                    <FrontEndTypo.H3 mt='-10px' width='268px'>
                      {t('COMPLETE_THIS_BEFORE_ORIENTATION')}
                    </FrontEndTypo.H3>
                  </Box>
                  <Box gap='18px'>
                    <HStack alignItems='Center' justifyContent='space-between'>
                      <HStack alignItems='Center' space='sm'>
                        <IconByName name='UserLineIcon' size='20px' />
                        <FrontEndTypo.H2 ml='19px'>
                          {t('MY_IP')}
                        </FrontEndTypo.H2>
                      </HStack>
                      <ChevronRightIcon size='sm' color='textMaroonColor.400' />
                    </HStack>
                    <Divider
                      orientation='horizontal'
                      background='dividerColor'
                      thickness='1'
                    />
                    <HStack alignItems='Center' justifyContent='space-between'>
                      <HStack alignItems='Center' space='sm'>
                        <IconByName mt='5px' size='20px' name='Chat4LineIcon' />
                        <FrontEndTypo.H2 ml='19px'>{t('FAQS')}</FrontEndTypo.H2>
                      </HStack>
                      <ChevronRightIcon size='sm' color='textMaroonColor.400' />
                    </HStack>
                    <Divider
                      orientation='horizontal'
                      background='dividerColor'
                      thickness='1'
                    />
                    <HStack alignItems='Center' justifyContent='space-between'>
                      <HStack alignItems='Center' space='sm'>
                        <IconByName name='PhoneLineIcon' size='20px' />
                        <FrontEndTypo.H2 ml='19px'>
                          {t('CALL_SUPPORT')}
                        </FrontEndTypo.H2>
                      </HStack>
                      <ChevronRightIcon size='sm' color='textMaroonColor.400' />
                    </HStack>
                    <Divider
                      orientation='horizontal'
                      background='dividerColor'
                      thickness='1'
                    />
                    <HStack alignItems='Center' justifyContent='space-between'>
                      <HStack alignItems='Center' space='sm'>
                        <IconByName name='GroupLineIcon' size='20px' />
                        <FrontEndTypo.H2 ml='19px'>
                          {t('PRERAK_COMMUNITY')}
                        </FrontEndTypo.H2>
                      </HStack>
                      <ChevronRightIcon size='sm' color='textMaroonColor.400' />
                    </HStack>
                    <Divider
                      orientation='horizontal'
                      background='dividerColor'
                      thickness='1'
                    />
                    <HStack alignItems='Center' justifyContent='space-between'>
                      <HStack alignItems='Center' space='sm'>
                        <IconByName name='Settings4LineIcon' size='20px' />
                        <FrontEndTypo.H2 ml='19px'>
                          {t('SETTINGS')}
                        </FrontEndTypo.H2>
                      </HStack>
                      <ChevronRightIcon
                        color='textMaroonColor.400'
                        ml='52%'
                        size='sm'
                      />
                    </HStack>
                    <Divider
                      orientation='horizontal'
                      background='dividerColor'
                      thickness='1'
                    />
                  </Box>
                </Box>
              </Stack>
            </Drawer>
          </Box>
        ) : (
          <React.Fragment />
        )}
        <HStack>
          {isShow('helpBtn') ? (
            <Box pr='3'>
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
              width='100%'
              borderBottomWidth='1px'
              borderColor='textMaroonColor.400'
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
      ) : isShow('backBtn') || isShow('userInfo') || isShow('langBtn') ? (
        <HStack
          bg='transparent'
          justifyContent='space-between'
          alignItems='center'
          minH='32px'
          {..._hstack}
        >
          <HStack space='2' alignItems='center'>
            {isShow('backBtn') ? (
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
            ) : (
              <React.Fragment />
            )}

            {isShow('userInfo') ? (
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
                  {headerName ? headerName : 'Add an AG'}
                </BodyLarge>
              </HStack>
            ) : (
              <React.Fragment />
            )}
          </HStack>

          <HStack alignItems={'center'}>
            {!searchInput && isEnableSearchBtn ? (
              <IconByName
                color={color ? color : 'textMaroonColor.400'}
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
                  right='100%'
                  w='190'
                  placement='bottom right'
                  trigger={(triggerProps) => {
                    return (
                      <Pressable
                        accessibilityLabel='More options menu'
                        {...triggerProps}
                      >
                        <HStack alignItems='start'>
                          <BodyLarge>
                            {(lang && lang !== '') ||
                            localStorage.getItem('lang')
                              ? languages.find(
                                  (e) =>
                                    e?.code === lang ||
                                    e?.code === localStorage.getItem('lang')
                                )?.['title']
                              : 'En'}
                          </BodyLarge>
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
            {rightIcon && rightIcon}
            {isShow('notificationBtn') ? (
              <IconByName
                color={color ? color : ''}
                size='20px'
                name='Notification2LineIcon'
              />
            ) : (
              <React.Fragment />
            )}
          </HStack>
        </HStack>
      ) : (
        <React.Fragment />
      )}
    </Box>
  )
}
