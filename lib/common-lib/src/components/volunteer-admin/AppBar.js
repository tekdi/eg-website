import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  StatusBar,
  Menu,
  HStack,
  Box,
  Pressable,
  Stack,
  Image
} from 'native-base'
import { useNavigate } from 'react-router-dom'
import {
  logout,
  getSelectedAcademicYear,
  getSelectedProgramId
} from '../helper'
import { BodyLarge } from '../layout/HeaderTags'
import { changeLanguage, t } from 'i18next'
import IconByName from '../IconByName'
import ImageView from '../ImageView'
import * as AdminTypo from '../../components/admin_component'
import Banner from '../Banner'
const styles = {
  box: {
    background: 'textMaroonColor.600'
  }
}

export default function AppBar({
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
  const navigate = useNavigate()
  const profile_url = localStorage.getItem('profile_url')
  const [academicYear, setAcademicYear] = React.useState()

  const [program, setProgram] = React.useState()
  const [language, setLanguage] = React.useState()
  useEffect(() => {
    setLanguage(localStorage.getItem('lang'))
  }, [])
  const setMenu = (e) => {
    if (e === 'profile') {
      navigate('/admin-volunteer/profile')
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
  const handleImagePress = () => {
    navigate('/admin-volunteer')
  }

  React.useEffect(() => {
    const fetchAcademicYear = async () => {
      const result = await getSelectedAcademicYear()
      const programResult = await getSelectedProgramId()
      setAcademicYear(result || selectedAcademic)
      setProgram(programResult || selectedAcademic)
    }
    fetchAcademicYear()
  }, [selectedAcademic, getSelectedAcademicYear])

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
                {program?.state_name &&
                  `${program?.state_name} ${academicYear?.academic_year_name}`}
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

AppBar.propTypes = {
  color: PropTypes.string,
  languages: PropTypes.array,
  rightIcon: PropTypes.any,
  isShowNotificationButton: PropTypes.bool,
  lang: PropTypes.any,
  setLang: PropTypes.any,
  setIsOpenDrawer: PropTypes.func,
  selectedAcademic: PropTypes.any
}
