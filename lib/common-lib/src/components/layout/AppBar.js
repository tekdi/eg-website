import React, { useState, useEffect } from 'react'
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
  Image,
  Alert
  // Divider
} from 'native-base'
import 'react-modern-drawer/dist/index.css'
import { useNavigate } from 'react-router-dom'
import IconByName from '../IconByName'
import { BodyLarge } from './HeaderTags'
import { arrList, logout, objProps } from '../helper'
import { useTranslation } from 'react-i18next'
import ImageView from '../ImageView'
import * as FrontEndTypo from '../frontend_component'
import { changeLanguage } from 'i18next'
import Banner from '../Banner'
import { debounce } from 'lodash'

const styles = {
  bottom: {
    marginBottom: 0,
    marginTop: 'auto',
    scroll: 'auto'
  }
}

export default function AppBar({
  setIsOpen,
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
  ...props
}) {
  //fetch URL data and store fix for 2 times render useEffect call
  const [selectedCohortData, setSelectedCohortData] = useState({})
  const [language, setLanguage] = useState()
  const { t } = useTranslation()
  const [searchInput, setSearchInput] = React.useState(false)
  const [searchData, setSearchData] = React.useState('')

  useEffect(() => {
    async function fetchData() {
      // ...async operations
      try {
        let cohortSelected = jsonParse(localStorage.getItem('academic_year'))
        setSelectedCohortData(cohortSelected)
      } catch (error) {}
    }
    fetchData()
  }, [localStorage.getItem('academic_year')])

  const jsonParse = (str, returnObject = {}) => {
    try {
      return JSON.parse(str)
    } catch (e) {
      return returnObject
    }
  }

  const headerName = name || localStorage.getItem('fullName') || ''
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const [modal, setModal] = React.useState(false)

  const changeMenu = (e) => {
    if (e === 'logout') {
      logout()
      navigate('/login')
      navigate(0)
    } else {
      localStorage.setItem('lang', e)
      changeLanguage(e)
      setLang ? setLang(e) : console.log(e)
    }
  }
  const handleSeachState = (boolean) => {
    if (setSearchState) setSearchState(boolean)
    setSearchInput(boolean)
    if (boolean === false && searchData != '') setSearch()
  }

  // search
  const handleSearch = (e) => {
    setSearch(e.nativeEvent.text)
    setSearchData(e.nativeEvent.text)
  }

  const debouncedHandleSearch = React.useCallback(
    debounce(handleSearch, 1000),
    []
  )

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
    setLanguage(dLang || 'en')
    changeLanguage(dLang || 'en')
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
    <Box borderBottomWidth='1' borderBottomColor={'transparent'}>
      <Banner />
      <HStack
        justifyContent='space-between'
        style={{
          background:
            'linear-gradient(360deg, rgb(220, 54, 68) 1%, rgb(31, 29, 118) 250%)'
        }}
        px='2'
        borderBottomLeftRadius={'15px'}
        borderBottomRightRadius={'15px'}
        py='0'
      >
        <IconByName
          size='sm'
          pl='0'
          name='ArrowLeftLineIcon'
          _icon={{ color: 'white' }}
          {..._backBtn}
          onPress={() => {
            if (onPressBackButton) {
              onPressBackButton()
            } else {
              navigate(-1)
            }
          }}
        />
        <Pressable onPress={handleImagePress}>
          {language && (
            <Image
              alignSelf='center'
              source={{
                // uri: `/images/logos/${language}/educate-girls-pragati-100x100.png`
                uri: '/images/logos/App_Bar_Logo.svg'
              }}
              alt='Educate Girls'
              resizeMode='contain'
              size={60}
            />
          )}
        </Pressable>

        <IconByName
          pr='0'
          _icon={{ color: 'white' }}
          name='MenuLineIcon'
          onPress={() => {
            setIsOpen(true)
          }}
        />

        {process.env.REACT_APP_SERVER_NAME && (
          <Alert status='warning' alignItems={'center'}>
            <HStack alignItems='center' space='2'>
              <FrontEndTypo.H4>
                {t(`${process.env.REACT_APP_SERVER_NAME}_SERVER`)}
              </FrontEndTypo.H4>
            </HStack>
          </Alert>
        )}
      </HStack>

      <StatusBar bg='gray.600' barStyle='light-content' />

      {/* <Box safeAreaTop bg='gray.600' /> */}

      {searchInput ? (
        <Stack alignItems='center'>
          <InputGroup width='100%'>
            <InputLeftAddon p='0' bg='transparent' borderWidth='0'>
              <IconByName
                size='sm'
                name='ArrowLeftSLineIcon'
                color={color || ''}
                onPress={() => {
                  if (onPressBackButton) {
                    onPressBackButton()
                  } else {
                    navigate(-1)
                  }
                }}
              />
            </InputLeftAddon>
            <Input
              variant='unstyled'
              bg='transparent'
              size='sm'
              placeholder={t('SEARCH')}
              onChange={debouncedHandleSearch}
            />
            <InputRightAddon p='0' bg='transparent' borderWidth='0'>
              <IconByName
                color='coolGray.500'
                name='CloseCircleLineIcon'
                p='0'
                onPress={(e) => handleSeachState(false)}
              />
            </InputRightAddon>
          </InputGroup>
        </Stack>
      ) : isShow('backBtn') ||
        isShow('userInfo') ||
        isShow('langBtn') ||
        isShow('menuBtn', false) ? (
        <HStack
          display={'none'}
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
                borderWidth='1'
                p='0'
                borderColor='black'
                bg='textGreyColor.400'
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
              <HStack space={2} alignItems={'center'}>
                <FrontEndTypo.H3>
                  {selectedCohortData?.academic_year_name}
                </FrontEndTypo.H3>
              </HStack>
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
                  {headerName || ''}
                </BodyLarge>
              </HStack>
            )}
            {leftIcon && leftIcon}
          </HStack>
          <HStack alignItems={'center'}>
            {!searchInput && isEnableSearchBtn && (
              <IconByName
                color={color || ''}
                size='sm'
                name='SearchLineIcon'
                onPress={(e) => handleSeachState(true)}
              />
            )}
            {isShow('langBtn') && (
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
