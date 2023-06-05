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
import { changeLanguage, t } from 'i18next'
const styles = {
  box: {
    background:
      'linear-gradient(135deg, #e2f2fc -10%, #faf6f3 35%, #faf6f3 60%,#faf6f3 70%, #e2f2fc 110%)'
  }
}
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
  const setMenu = (e) => {
    if (e === 'profile') {
      navigate('/admin/profile')
    } else if (e === 'logout') {
      logout()
      navigate('/login')
      navigate(0)
    } else {
      localStorage.setItem('lang', e)
      changeLanguage(e)
      setLang ? setLang(e) : navigate(0)
    }
  }

  return (
    <Box py={5} pr={5} pl={2} {...props?._box}>
      <StatusBar bg='gray.600' barStyle='light-content' />
      <Box safeAreaTop bg='gray.600' />
      <HStack
        bg='transparent'
        justifyContent='space-between'
        alignItems='center'
        minH='32px'
        {...styles.box}
      >
        <Image
          w='42px'
          h='35px'
          ml="2"
          source={{
            uri: '/logo.png'
          }}
          alt=''
          resizeMode="contain"

        />
        <HStack alignItems={'flex-end'} space='5'>
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

          <Stack px='3' justifyContent='flex-end'>
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
                          name='UserLineIcon'
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
              <Menu.Item onPress={(item) => setMenu('profile')}>
                {t('PROFILE')}
              </Menu.Item>
              <Menu.Item onPress={(item) => setMenu('logout')}>
                {t('LOGOUT')}
              </Menu.Item>
            </Menu>
          </Stack>
        </HStack>
      </HStack>
    </Box>
  )
}
