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
  sm,
  xs
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
      px={2}
      borderBottomWidth='1'
      borderBottomColor={'gray.300'}
      {...props?._box}
    >
      <HStack justifyContent={'flex-end'} pb="4">
      {isShow('helpBtn') ?(
             <Box>
                <Button
                  py="1"
                  px="5"
                  variant='redOutlineBtn'
                  borderRadius={xs}
                  onPress={() => setModal('bottom')}
                >
                  {t('HELP')}
                </Button>
              
              <Modal isOpen={modal} onClose={() => setModal(false)} size='xl'>
                <Modal.Content style={styles.bottom}>
                  <Modal.CloseButton />
                  <Modal.Header p='5' fontSize='16' borderBottomWidth='0'>
                    {t('NEED_HELP')}
                  </Modal.Header>
                  <Modal.Body p='5' pb='10' mx={5} overflowX='auto'>
                    <HStack space='3' align-items='stretch' width="100%">
                        <Box width="32%">
                            <Button
                              variant='outline'
                              color='secondary'
                              bg='textGreyColor.400'
                              
                            >
                              <IconByName
                                color='coolGray.500'
                                name='MessageLineIcon'
                                p='0'
                                width="30px"
                              />
                              <Box pt={2} w='20'>
                                {t('FREQUENTLY_ASKED_QUESTION')}
                              </Box>
                            </Button>
                        </Box>
                        <Box width="32%" height="30%">
                          <Button
                            variant='outline'
                            color='secondary'
                            bg='textGreyColor.400'
                          >
                            <IconByName
                              color='coolGray.500'
                              name='CustomerService2LineIcon'
                              p='0'
                              width="30px"
                            />
                            <Box pt={3} w="53px">{t('CALL_SUPPORT')}</Box>
                          </Button>
                      </Box>
                      <Box width="32%">
                        <Button
                          variant='outline'
                          color='secondary'
                          
                          bg='textGreyColor.400'
                        >
                          <IconByName
                          color='coolGray.500'
                          name='CellphoneLineIcon'
                          p='0'
                          width="30px"
                        />
                          <Box pt={3} w="53px">{t('CALL_MY_IP')} </Box>
                      </Button>
                      </Box>
                    </HStack>
                  </Modal.Body>
                </Modal.Content>
              </Modal>
            </Box>
            ):<React.Fragment />}
            {token ? (
              <HStack>
                <Button
                  py="1"
                  px="5"
                  variant='redOutlineBtn'
                  ml={3}
                  borderRadius={sm}
                  onPress={(e) => changeMenu('logout')}
                >
                  {t('LOGOUT')}
                </Button>
              </HStack>
            ) : (
              <React.Fragment />
            )}
             {isShow('loginBtn') ?(
             <Box>
              <HStack space={2}>
                <Button
                  py="1"
                  px="5"
                  variant='redOutlineBtn'
                  ml={3}
                  borderRadius={sm}
                  onPress={(e) => navigate('/login')}
                >
                  {t('LOGIN')}
                </Button>
              </HStack>
              </Box>
            ):<React.Fragment />}
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
                pl="0"
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
                <BodyLarge  wordWrap= "break-word" width="181px" whiteSpace= "nowrap" overflow="hidden" textOverflow= "ellipsis">{headerName}</BodyLarge>
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
                            pr="0"
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
