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
  Text
} from 'native-base'
import IconByName from '../IconByName'

export default function AppBar({
  isEnableLanguageMenu,
  color,
  languages,
  rightIcon,
  isShowNotificationButton,
  ...props
}) {
  const setLang = (e) => {
    if (e === 'logout') {
      localStorage.setItem('token', '')
    } else {
      localStorage.setItem('lang', e)
    }
    window.location.reload()
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
        <IconByName
          size='sm'
          name='BookOpenLineIcon'
          color={color ? color : ''}
        />
        <HStack alignItems={'center'} space='5'>
          <Input
            InputLeftElement={
              <IconByName color='coolGray.500' name='SearchLineIcon' />
            }
            placeholder='search'
            borderColor={'#61646B'}
            variant='outline'
          />
          <IconByName color={color ? color : ''} name='MapPinLineIcon' />
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
                      <IconByName
                        name='AccountCircleLineIcon'
                        isDisabled={true}
                        color={color ? color : ''}
                      />
                      <Text>IP Name</Text>
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
