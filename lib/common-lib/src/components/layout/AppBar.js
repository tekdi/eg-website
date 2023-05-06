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
  Image,
  Text,
  Avatar
} from 'native-base'
import { useNavigate } from 'react-router-dom'
import IconByName from '../IconByName'
import { BodyLarge } from './HeaderTags'
import { logout } from '../helper'

export default function AppBar({
  isEnableSearchBtn,
  setSearch,
  setSearchState,
  color,
  languages,
  onPressBackButton,
  rightIcon,
  onlyIconsShow,
  exceptIconsShow,
  name,
  ...props
}) {
  const [searchInput, setSearchInput] = useState(false)
  const profile_url = localStorage.getItem('profile_url')
  const lang = localStorage.getItem('lang')
  const headerName = localStorage.getItem('fullName')
    ? localStorage.getItem('fullName')
    : name
    ? name
    : ''
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const setLang = (e) => {
    if (e === 'logout') {
      logout()
    } else {
      localStorage.setItem('lang', e)
    }
    // window.location.href
    // window.location.reload()
    navigate(0)
  }

  const handleSeachState = (boolean) => {
    if (setSearchState) setSearchState(boolean)
    setSearchInput(boolean)
  }

  const isShow = (item) =>
    (!onlyIconsShow || onlyIconsShow.includes(item)) &&
    (!exceptIconsShow || !exceptIconsShow.includes(item))

  return (
    <Box
      py={2}
      px={5}
      borderBottomWidth='1'
      borderBottomColor={'gray.300'}
      {...props?._box}
    >
      <StatusBar bg='gray.600' barStyle='light-content' />
      <Box safeAreaTop bg='gray.600' />

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
              size={'full'}
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
      ) : (
        <HStack
          bg='transparent'
          justifyContent='space-between'
          alignItems='center'
          minH='32px'
        >
          <HStack space='4' alignItems='center'>
            {isShow('backBtn') ? (
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
            ) : (
              <React.Fragment />
            )}
            {isShow('userInfo') ? (
              <HStack space='3' alignItems='center'>
                {profile_url ? (
                  <Avatar
                    source={{
                      uri: profile_url
                    }}
                    // alt="Alternate Text"
                    width={'40px'}
                    height={'40px'}
                  />
                ) : (
                  <IconByName
                    isDisabled
                    name='AccountCircleLineIcon'
                    color='gray.300'
                    _icon={{ size: '40px' }}
                  />
                )}
                <BodyLarge>{headerName}</BodyLarge>
              </HStack>
            ) : (
              <React.Fragment />
            )}
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
            {rightIcon ? rightIcon : <React.Fragment />}
            {isShow('helpBtn') ? (
              <IconByName
                name='CustomerService2LineIcon'
                color={color ? color : ''}
              />
            ) : (
              <React.Fragment />
            )}
            {token ? (
              <IconByName
                onPress={(e) => setLang('logout')}
                name='ShutDownLineIcon'
              />
            ) : (
              <IconByName
                name='LoginCircleLineIcon'
                onPress={(e) => navigate('/login')}
              />
            )}
            {isShow('langBtn') ? (
              <Stack px='3'>
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
                        <HStack space={2}>
                          <Text>
                            {lang && lang !== ''
                              ? languages.find((e) => e?.code === lang)?.[
                                  'title'
                                ]
                              : 'En'}
                          </Text>
                          <IconByName
                            size='sm'
                            name='ArrowDownSFillIcon'
                            isDisabled={true}
                            color={color ? color : ''}
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
                      onPress={(item) => setLang(e.code)}
                    >
                      {e.title}
                    </Menu.Item>
                  ))}
                </Menu>
              </Stack>
            ) : (
              <React.Fragment />
            )}
          </HStack>
        </HStack>
      )}
    </Box>
  )
}
