import React from 'react'
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
  logout,
  setSelectedAcademicYear,
  getSelectedAcademicYear
} from '../helper'
import { BodyLarge } from '../layout/HeaderTags'

import { changeLanguage, t } from 'i18next'
import IconByName from '../IconByName'
import ImageView from '../ImageView'
import * as AdminTypo from '../../components/admin_component'
import { cohortService } from '../..'
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
  lang,
  setLang,
  setIsOpenDrawer,
  OacademicYear,
  ...props
}) {
  const navigate = useNavigate()
  const profile_url = localStorage.getItem('profile_url')
  const [academicYear, setAcademicYear] = React.useState()

  const [academicData, setAcademicData] = React.useState()
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
  const handleImagePress = () => {
    navigate('/admin')
  }

  const getAcademic = React.useCallback(async () => {
    const data = await cohortService.getAcademicYear()
    setAcademicData(data?.data)
  }, [])

  React.useEffect(() => {
    getAcademic()
  }, [])

  React.useEffect(() => {
    const fetchAcademicYear = async () => {
      const result = await getSelectedAcademicYear()
      setAcademicYear(result || OacademicYear)
    }
    fetchAcademicYear()
  }, [OacademicYear, getSelectedAcademicYear])

  const handleAcademicYear = React.useCallback(async (data) => {
    await setSelectedAcademicYear(data)
    setAcademicYear(data)
    window.location.reload()
  }, [])

  return (
    <Box py={2} pr={5} pl={2} {...props?._box} bg='textMaroonColor.600'>
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
            <Image
              w='70px'
              h='35px'
              ml='0'
              source={{
                uri: '/images/logos/eg-logo.png'
              }}
              alt='Educate Girls'
              resizeMode='contain'
            />
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
            <Menu
              p='2'
              placement='bottom right'
              trigger={(triggerProps) => {
                return (
                  <Pressable
                    accessibilityLabel='More options menu'
                    {...triggerProps}
                  >
                    <HStack alignItems='start'>
                      <BodyLarge>
                        {academicYear?.academic_year_name ||
                          t('SELECT_ACADEMIC_YEAR')}
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
              {academicData?.map((item) => {
                return (
                  <Menu.Item
                    key={item?.id}
                    onPress={() => {
                      handleAcademicYear(item)
                    }}
                  >
                    {item?.academic_year_name}
                  </Menu.Item>
                )
              })}
            </Menu>
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
                    <HStack rounded={'lg'} bg={'white'} alignItems='center'>
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
