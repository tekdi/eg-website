import React, { useState, useRef, useEffect } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { Box, Center, HStack, Stack } from 'native-base'
import AppBar from './AppBar'
import { getTokernUserInfo, useWindowSize } from '../helper'
import HeightWidth from '../HeightWidth'
import Drawer from './Drawer'
import Loading from '../Loading'
import { useLocation } from 'react-router-dom'

const menus = [
  {
    title: 'HOME',
    icon: 'Home4LineIcon',
    // selected: ['/admin-volunteer'],
    route: '/'
  },
  {
    title: 'VOLUNTEERS',
    icon: 'GroupLineIcon',
    // selected: ['/admin-volunteer/volunteers'],
    route: '/admin-volunteer/volunteers'
  },
  {
    title: 'REPORTS',
    icon: 'FileChartLineIcon',
    subMenu: [
      {
        title: 'VOLUNTEERS',
        icon: 'GroupLineIcon',
        route: '/admin-volunteer/reports/volunteer',
        select: 2
      }
    ]
  }
]

export default function Layout({
  isDisabledAppBar,
  children,
  imageUrl,
  getRefAppBar,
  _appBar,
  _header,
  _sidebar,
  loading,
  getMenus
}) {
  const [width, Height] = useWindowSize()
  const navRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (getMenus) {
      getMenus(menus)
    }
  }, [getMenus, menus])

  useState(() => {
    const { resource_access } = getTokernUserInfo()
    if (
      resource_access?.hasura?.roles &&
      !resource_access?.hasura?.roles?.includes('volunteer_admin')
    ) {
      window.location.reload()
    }
  }, [location])

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState)
  }
  if (loading === true) {
    return <Loading windowWidth='100%' />
  }

  return (
    <Center>
      <Drawer {...{ open: isOpen, onClose: setIsOpen, toggleDrawer, menus }} />

      <HeightWidth windowWidth={'100%'}>
        <Stack
          width={'100%'}
          style={{
            backgroundImage: 'url(' + imageUrl + ')',
            backgroundColor: 'transparent',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }}
          ref={navRef}
          space={5}
        >
          {!isDisabledAppBar && (
            <Box
              ref={(e) => {
                if (getRefAppBar) getRefAppBar(e)
              }}
            >
              <AppBar
                setIsOpenDrawer={setIsOpen}
                isEnableSearchBtn
                isShowNotificationButton={false}
                _box={{ bg: 'textRed.400' }}
                color={imageUrl ? 'white' : ''}
                languages={[
                  { title: 'En', code: 'en' },
                  { title: 'हिं', code: 'hi' }
                ]}
                {..._appBar}
              />
            </Box>
          )}
        </Stack>
        <HStack space={'2'}>
          <Sidebar
            _box={{
              display: ['none', 'none', 'block'],
              width: '5%',
              minH: (Height || 0) - (navRef?.current?.clientHeight || 0),
              bg: 'info.100'
            }}
            menus={menus}
            {..._sidebar}
          />
          <Box flex={1}>
            {_header && <Header {..._header} />}
            {children}
          </Box>
        </HStack>
      </HeightWidth>
    </Center>
  )
}
