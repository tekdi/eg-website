import React, { useEffect, useRef, useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { Box, Center, HStack, Stack } from 'native-base'
import AppBar from './AppBar'
import HeightWidth from '../HeightWidth'
import Drawer from './Drawer'
import { useWindowSize } from '../helper'
import Loading from '../Loading'

const menus = [
  {
    title: 'HOME',
    icon: 'Home4LineIcon',
    route: '/'
  },
  {
    title: 'IP',
    icon: 'GroupLineIcon',
    route: '/poadmin/ips'
  },
  {
    title: 'PRERAKS',
    icon: 'GroupLineIcon',
    route: '/poadmin/facilitators'
  },
  {
    title: 'LEARNERS',
    icon: 'GraduationCap',
    route: '/poadmin/learners'
  },
  { title: 'CAMPS', icon: 'CommunityLineIcon', route: '/poadmin/camps' },
  {
    title: 'EXAM',
    icon: 'FileTextLineIcon',
    route: '/poadmin/exam-schedule',
    subMenu: [
      {
        title: 'SCHEDULE_EXAM',
        icon: 'FileTextLineIcon',
        route: '/poadmin/exam-schedule',
        select: 5
      }
    ]
  },
  {
    title: 'REPORTS',
    icon: 'FileChartLineIcon',
    route: '/poadmin/reports',
    subMenu: [
      {
        title: 'PRERAKS',
        icon: 'GroupLineIcon',
        route: '/poadmin/reports/prerak',
        select: 6
      },
      {
        title: 'LEARNERS',
        icon: 'GraduationCap',
        route: '/poadmin/reports/learner',
        select: 6
      },
      {
        title: 'CAMPS',
        icon: 'CommunityLineIcon',
        route: '/poadmin/reports/camp',
        select: 6
      },
      {
        title: 'EPCP_REPORT',
        icon: 'MacLineIcon',
        route: '/poadmin/reports/epcp',
        select: 6
      },
      {
        title: 'TRAINING',
        icon: 'DraftLineIcon',
        route: '/poadmin/reports/training',
        select: 6
      },
      {
        title: 'CAMP_EXECUTION',
        icon: 'CommunityLineIcon',
        route: '/poadmin/reports/camp_execution',
        select: 6
      },
      {
        title: 'SUBJECTS',
        icon: 'Book2LineIcon',
        route: '/poadmin/reports/subjects',
        select: 6
      }
    ]
  },
  {
    title: 'FULL_ADDRESS',
    icon: 'GraduationCap',
    route: '/poadmin/address'
  },
  {
    title: 'DO-ID',
    icon: 'GroupLineIcon',
    route: '/poadmin/do-ids'
  }
  // {
  //   icon: 'CustomerService2LineIcon'
  // },
  // {
  //   icon: 'Settings4LineIcon'
  // }
]

export default function Layout({
  isDisabledAppBar,
  children,
  imageUrl,
  getRefAppBar,
  _appBar,
  _header,
  _sidebar,
  getMenus,
  loading
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [width, Height] = useWindowSize()
  const navRef = useRef(null)
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState)
  }

  useEffect(() => {
    if (getMenus) {
      getMenus(menus)
    }
  }, [])

  if (loading === true) {
    return <Loading windowWidth='100%' />
  }

  return (
    <Center>
      <Drawer {...{ open: isOpen, onClose: setIsOpen, toggleDrawer, menus }} />
      <HeightWidth width windowWidth={'100%'}>
        <Stack
          width={'100%'}
          style={{
            backgroundImage: 'url(' + imageUrl + ')',
            backgroundColor: 'transparent',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }}
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
              minH: (Height || 0) - (navRef?.current?.clientHeight || 0),
              width: '5%',
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
