import React, { useEffect, useState } from 'react'
import {
  HStack,
  Box,
  StatusBar,
  Pressable,
  Menu,
  Stack,
  Image
} from 'native-base'
import { useNavigate } from 'react-router-dom'
import {
  getSelectedAcademicYear,
  getSelectedProgramId,
  logout
} from '../helper'
import { BodyLarge } from '../layout/HeaderTags'

import { changeLanguage, t } from 'i18next'
import IconByName from '../IconByName'
import ImageView from '../ImageView'
import * as AdminTypo from '../admin_component'
import Banner from '../Banner'
const styles = {
  box: {
    background: 'textRed.400'
  }
}

const triggerPropsFun = (triggerProps, profile_url, color) => {
  return (
    <Pressable accessibilityLabel='More options menu' {...triggerProps}>
      <HStack rounded={'lg'} px={2} bg={'white'} alignItems='center' space={4}>
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
        <AdminTypo.H5>{localStorage.getItem('fullName')}</AdminTypo.H5>
        <IconByName
          pr='0'
          name='ArrowDownSLineIcon'
          isDisabled={true}
          color={color || ''}
        />
      </HStack>
    </Pressable>
  )
}

const triggerPropsSecondFun = (triggerProps, lang, languages, color) => {
  return (
    <Pressable accessibilityLabel='More options menu' {...triggerProps}>
      <HStack rounded={'lg'} px={4} bg={'white'} alignItems='center'>
        <BodyLarge>
          {(lang && lang !== '') || localStorage.getItem('lang')
            ? languages.find(
                (e) =>
                  e?.code === lang || e?.code === localStorage.getItem('lang')
              )?.['title']
            : 'En'}
        </BodyLarge>
        <IconByName
          pr='0'
          name='ArrowDownSFillIcon'
          isDisabled={true}
          color={color || ''}
          _text={{ size: 'sm' }}
        />
      </HStack>
    </Pressable>
  )
}

export default function AppBar({
  isEnableLanguageMenu,
  color,
  languages,
  rightIcon,
  isShowNotificationButton,
  lang,
  setLang,
  setIsOpenDrawer,
  selectedAcademic,
  ...props
}) {
  const profile_url = localStorage.getItem('profile_url')
  const [language, setLanguage] = useState()
  const [academicYear, setAcademicYear] = useState()
  const [program, setProgram] = useState()
  const navigate = useNavigate()

  useEffect(() => {
    setLanguage(localStorage.getItem('lang'))
  }, [])

  const setMenu = (e) => {
    if (e === 'profile') {
      navigate('/poadmin/profile')
    } else if (e === 'logout') {
      logout()
      navigate('/login')
      navigate(0)
    } else {
      localStorage.setItem('lang', e)
      changeLanguage(e)
      setLang ? setLang(e) : console.log(e)
    }
  }
  useEffect(() => {
    const fetchAcademicYear = async () => {
      const result = await getSelectedAcademicYear()
      const programResult = await getSelectedProgramId()
      setAcademicYear(result || selectedAcademic)
      setProgram(programResult || selectedAcademic)
    }
    fetchAcademicYear()
  }, [selectedAcademic, localStorage.getItem('academic_year')])

  const handleImagePress = () => {
    navigate('/')
  }
  return (
    <Box py={1} pr={5} pl={2} {...styles.box}>
      <Banner />
      <StatusBar bg='gray.600' barStyle='light-content' />
      <Box safeAreaTop bg='gray.600' />
      <HStack
        bg='transparent'
        justifyContent='space-between'
        alignItems='center'
        {...styles.box}
      >
        <HStack space='1'>
          <Pressable onPress={handleImagePress}>
            <Stack padding={1} borderRadius={100} backgroundColor={'white'}>
              <Image
                ml='0'
                source={{
                  uri: `/images/logos/${
                    language || 'en'
                  }/educate-girls-pragati-100x100.png`
                }}
                alt='Educate Girls'
                resizeMode='contain'
                size='50'
              />
            </Stack>
          </Pressable>
          <IconByName
            display={['block', 'block', 'none']}
            name='MenuLineIcon'
            onPress={() => {
              setIsOpenDrawer && setIsOpenDrawer(true)
            }}
          />
        </HStack>
        <HStack alignItems={'flex-end'} space='5'>
          {rightIcon || <React.Fragment />}

          <HStack space={6} p='4' justifyContent='flex-end' display='contents'>
            <HStack alignItems='start'>
              <BodyLarge color={'white'}>
                {academicYear?.academic_year_name &&
                  `${academicYear?.academic_year_name}`}
              </BodyLarge>
            </HStack>

            <Menu
              w='190'
              placement='bottom right'
              trigger={(triggerProps) => {
                return (
                  <Pressable
                    accessibilityLabel='More options menu'
                    {...triggerProps}
                  >
                    <HStack
                      rounded={'lg'}
                      px={4}
                      bg={'white'}
                      alignItems='center'
                      space={4}
                    >
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
                      <AdminTypo.H5>
                        {localStorage.getItem('fullName')}
                      </AdminTypo.H5>
                      <IconByName
                        pr='0'
                        name='ArrowDownSLineIcon'
                        isDisabled={true}
                        color={color || ''}
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
            <Menu
              p={2}
              placement='bottom right'
              trigger={(triggerProps) => {
                return (
                  <Pressable
                    accessibilityLabel='More options menu'
                    {...triggerProps}
                  >
                    <HStack
                      rounded={'lg'}
                      px={4}
                      bg={'white'}
                      alignItems='center'
                    >
                      <BodyLarge>
                        {(lang && lang !== '') || localStorage.getItem('lang')
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
                        color={color || ''}
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
                  onPress={(item) => setMenu(e.code)}
                >
                  {e.title}
                </Menu.Item>
              ))}
            </Menu>
          </HStack>
        </HStack>
      </HStack>
    </Box>
  )
}
