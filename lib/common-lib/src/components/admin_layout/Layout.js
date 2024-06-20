import React, { useState, useRef } from 'react'
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
    selected: ['/admin'],
    route: '/admin'
  },
  {
    title: 'PRERAKS',
    icon: 'GroupLineIcon',
    route: '/admin/facilitator'
  },
  {
    title: 'LEARNERS',
    icon: 'GraduationCap',
    route: '/admin/learners'
  },
  { title: 'CAMPS', icon: 'CommunityLineIcon', route: '/admin/camps' },
  {
    title: 'REPORTS',
    icon: 'FileChartLineIcon',
    route: '/admin/reports',
    subMenu: [
      {
        title: 'PRERAKS',
        icon: 'GroupLineIcon',
        route: '/admin/reports/prerak',
        select: 4
      },
      {
        title: 'LEARNERS',
        icon: 'GraduationCap',
        route: '/admin/reports/learner',
        select: 4
      },
      {
        title: 'CAMPS',
        icon: 'CommunityLineIcon',
        route: '/admin/reports/camp',
        select: 4
      },
      {
        title: 'EPCP_REPORT',
        icon: 'MacLineIcon',
        route: '/admin/reports/epcp',
        select: 4
      },
      {
        title: 'TRAINING',
        icon: 'DraftLineIcon',
        route: '/admin/reports/training',
        select: 4
      },
      {
        title: 'CAMP_EXECUTION',
        icon: 'CommunityLineIcon',
        route: '/admin/reports/camp_execution',
        select: 4
      },
      {
        title: 'SUBJECTS',
        icon: 'Book2LineIcon',
        route: '/admin/reports/subjects',
        select: 4
      }
    ]
  },
  // Temp Comment
  {
    title: 'EXAMS',
    icon: 'FileTextLineIcon',
    route: '/admin/exam',
    subMenu: [
      {
        title: 'VIEW_EXAM_SCHEDULE',
        icon: 'FileTextLineIcon',
        route: '/admin/exams/examschedule',
        select: 5
      }
      // {
      //   title: 'LEARNER_EXAM_RESULTS',
      //   icon: 'FileTextLineIcon',
      //   route: '/admin/exams/list',
      //   select: 5
      // }
    ]
  }
  // Temp Comment End

  // {
  //   title: 'ATTENDANCE',
  //   icon: 'GroupLineIcon',
  //   route: '/admin/attendances'
  // }
  // {
  //   icon: 'DashboardLineIcon'
  // },
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
  loading
}) {
  const [width, Height] = useWindowSize()
  const navRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  useState(() => {
    const { resource_access } = getTokernUserInfo()
    if (
      resource_access?.hasura?.roles &&
      !resource_access?.hasura?.roles?.includes('staff')
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
