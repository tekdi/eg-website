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
  Text,
  Avatar,
  Button,
  Modal,
  sm
} from 'native-base'
import { useNavigate } from 'react-router-dom'
import IconByName from '../IconByName'
import { BodyLarge } from './HeaderTags'
import { logout } from '../helper'
import { changeLanguage, t } from 'i18next'

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
  lang,
  setLang,
  ...props
}) {
  const [searchInput, setSearchInput] = useState(false)
  const profile_url = localStorage.getItem('profile_url')

  const headerName = localStorage.getItem('fullName')
    ? localStorage.getItem('fullName')
    : name
    ? name
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

  return (
    <Box
      py={2}
      px={5}
      borderBottomWidth='1'
      borderBottomColor={'gray.300'}
      {...props?._box}
    >
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
              <HStack space='1' alignItems='center'>
                {profile_url ? (
                  <Avatar
                    source={{
                      uri: profile_url
                    }}
                    alt='Image not found'
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
            {
              <Button
                variant='redOutlineBtn'
                borderRadius={sm}
                onPress={() => setModal('bottom')}
              >
                {t('HELP')}
              </Button>
            }
            <Modal isOpen={modal} onClose={() => setModal(false)} size='xl'>
              <Modal.Content style={styles.bottom}>
                <Modal.CloseButton />
                <Modal.Header p='5' fontSize='16' borderBottomWidth='0'>
                  {t('NEED_HELP')}
                </Modal.Header>
                <Modal.Body p='5' pb='10' mx={5} overflowX='auto'>
                  <HStack space='3' align-items='center'>
                    <Button
                      variant='outline'
                      color='secondary'
                      bg='textGreyColor.400'
                      w='40'
                    >
                      <svg
                        width='30'
                        height='30'
                        viewBox='0 0 30 30'
                        fill='none'
                        Margin='0 auto'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M27.6213 21.6213C28.1839 21.0587 28.5 20.2956 28.5 19.5V4.5C28.5 3.70435 28.1839 2.94129 27.6213 2.37868C27.0587 1.81607 26.2956 1.5 25.5 1.5H4.5C3.70435 1.5 2.94129 1.81607 2.37868 2.37868C1.81607 2.94129 1.5 3.70435 1.5 4.5V28.5L7.5 22.5H25.5C26.2956 22.5 27.0587 22.1839 27.6213 21.6213Z'
                          stroke='#212121'
                          stroke-width='2'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                      </svg>
                      <Box pt={2} w='20'>
                        {t('FREQUENTLY_ASKED_QUESTION')}
                      </Box>
                    </Button>
                    <Button
                      variant='outline'
                      color='secondary'
                      w='40'
                      bg='textGreyColor.400'
                    >
                      <svg
                        width='30'
                        height='29'
                        viewBox='0 0 30 29'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M28.5 17.5H24C23.2044 17.5 22.4413 17.8161 21.8787 18.3787C21.3161 18.9413 21 19.7044 21 20.5V25C21 25.7956 21.3161 26.5587 21.8787 27.1213C22.4413 27.6839 23.2044 28 24 28H25.5C26.2956 28 27.0587 27.6839 27.6213 27.1213C28.1839 26.5587 28.5 25.7956 28.5 25V17.5ZM28.5 17.5V14.5C28.5 10.9196 27.0777 7.4858 24.5459 4.95406C22.0142 2.42232 18.5804 1 15 1C11.4196 1 7.9858 2.42232 5.45406 4.95406C2.92232 7.4858 1.5 10.9196 1.5 14.5V23.5M1.5 25C1.5 25.7956 1.81607 26.5587 2.37868 27.1213C2.94129 27.6839 3.70435 28 4.5 28H6C6.79565 28 7.55871 27.6839 8.12132 27.1213C8.68393 26.5587 9 25.7956 9 25V20.5C9 19.7044 8.68393 18.9413 8.12132 18.3787C7.55871 17.8161 6.79565 17.5 6 17.5H1.5V25Z'
                          stroke='#212121'
                          stroke-width='2'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                      </svg>
                      <Box pt={3}>{t('CALL_SUPPORT')}</Box>
                    </Button>
                    <Button
                      variant='outline'
                      color='secondary'
                      w='40'
                      bg='textGreyColor.400'
                    >
                      <svg
                        width='32'
                        height='33'
                        viewBox='0 0 32 33'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M30.9999 23.88V28.38C31.0016 28.7978 30.916 29.2113 30.7487 29.594C30.5813 29.9768 30.3358 30.3204 30.028 30.6028C29.7202 30.8852 29.3568 31.1002 28.961 31.2341C28.5653 31.3679 28.146 31.4176 27.7299 31.38C23.1142 30.8785 18.6804 29.3012 14.7849 26.775C11.1606 24.472 8.0879 21.3993 5.7849 17.775C3.24987 13.8618 1.67226 9.40652 1.1799 4.77002C1.14242 4.35522 1.19171 3.93716 1.32465 3.54246C1.45759 3.14776 1.67126 2.78506 1.95205 2.47746C2.23284 2.16985 2.57461 1.92409 2.95559 1.75581C3.33657 1.58753 3.74841 1.50042 4.1649 1.50002H8.6649C9.39286 1.49286 10.0986 1.75064 10.6505 2.22532C11.2025 2.7 11.563 3.35919 11.6649 4.08002C11.8548 5.52012 12.2071 6.93411 12.7149 8.29502C12.9167 8.83191 12.9604 9.4154 12.8408 9.97634C12.7211 10.5373 12.4432 11.0522 12.0399 11.46L10.1349 13.365C12.2702 17.1203 15.3796 20.2297 19.1349 22.365L21.0399 20.46C21.4477 20.0567 21.9626 19.7788 22.5236 19.6592C23.0845 19.5395 23.668 19.5832 24.2049 19.785C25.5658 20.2928 26.9798 20.6451 28.4199 20.835C29.1485 20.9378 29.814 21.3048 30.2897 21.8663C30.7654 22.4277 31.0182 23.1444 30.9999 23.88Z'
                          stroke='#212121'
                          stroke-width='2'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                      </svg>
                      <Box pt={3}>{t('CALL_MY_IP')} </Box>
                    </Button>
                  </HStack>
                </Modal.Body>
              </Modal.Content>
            </Modal>
            {token ? (
              <HStack>
                <Button
                  variant='redOutlineBtn'
                  ml={3}
                  borderRadius={sm}
                  onPress={(e) => changeMenu('logout')}
                >
                  {t('LOGOUT')}
                </Button>
              </HStack>
            ) : (
              <HStack space={2}>
                <Button
                  variant='redOutlineBtn'
                  ml={3}
                  borderRadius={sm}
                  onPress={(e) => navigate('/login')}
                >
                  {t('LOGIN')}
                </Button>
              </HStack>
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
                            {(lang && lang !== '') ||
                            localStorage.getItem('lang')
                              ? languages.find(
                                  (e) =>
                                    e?.code === lang ||
                                    e?.code === localStorage.getItem('lang')
                                )?.['title']
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
          </HStack>
        </HStack>
      )}
    </Box>
  )
}
