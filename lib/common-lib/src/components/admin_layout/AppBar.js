import React from 'react'
import {
  HStack,
  Box,
  StatusBar,
  Pressable,
  Input,
  Menu,
  Stack,
  Text,
  Avatar,
  Image
} from 'native-base'
import IconByName from '../IconByName'
import { useNavigate } from 'react-router-dom'
import { logout } from '../helper'
import ImageView from '../ImageView'

export default function AppBar({
  isEnableLanguageMenu,
  color,
  languages,
  rightIcon,
  isShowNotificationButton,
  ...props
}) {
  const navigate = useNavigate()
  const profile_url = localStorage.getItem('profile_url')
  const setLang = (e) => {
    if (e === 'profile') {
      navigate('/admin/profile')
    } else {
      if (e === 'logout') {
        logout()
      } else {
        localStorage.setItem('lang', e)
      }
      // window.location.href
      // window.location.reload()
      navigate(0)
    }
  }

  return (
    <Box py={5} px={5} {...props?._box}>
      <StatusBar bg='gray.600' barStyle='light-content' />
      <Box safeAreaTop bg='gray.600' />
      <HStack
        bg='transparent'
        justifyContent='space-between'
        alignItems='center'
        minH='32px'
      >
        <Image
          w='67px'
          h='38px'
          source={{
            uri: '/logo.png'
          }}
          alt=''
        />
        <HStack alignItems={'center'} space='5'>
          {/* <Input
            InputLeftElement={
              <IconByName color='coolGray.500' name='SearchLineIcon' />
            }
            placeholder='search'
            borderColor={'#61646B'}
            variant='outline'
          /> */}
          {/* <IconByName color={color ? color : ''} name='MapPinLineIcon' /> */}
          {rightIcon ? rightIcon : <React.Fragment />}
          {isShowNotificationButton ? (
            <IconByName
              name='Notification2LineIcon'
              color={color ? color : ''}
            />
          ) : (
            <React.Fragment />
          )}
          <Stack px='3'>
            <Menu
              w='190'
              placement='bottom right'
              trigger={(triggerProps) => {
                return (
                  <Pressable
                    accessibilityLabel='More options menu'
                    {...triggerProps}
                  >
                    <HStack space={4}>
                      {profile_url ? (
                        <ImageView
                          source={{
                            uri: profile_url
                          }}
                          // alt="Alternate Text"
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
                      <Text>{localStorage.getItem('fullName')}</Text>
                      <IconByName
                        name='ArrowDownSLineIcon'
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

              <Menu.Item onPress={(item) => setLang('profile')}>
                Profile
              </Menu.Item>
              <Menu.Item onPress={(item) => setLang('logout')}>
                Logout
              </Menu.Item>
            </Menu>
          </Stack>
        </HStack>
      </HStack>
    </Box>
  )
}
