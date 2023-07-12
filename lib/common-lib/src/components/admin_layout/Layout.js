import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { Box, Center, HStack, Stack } from 'native-base'
import AppBar from './AppBar'
import { useWindowSize } from '../helper'
import HeightWidth from '../HeightWidth'
import Drawer from './Drawer'

const menus = [
  {
    title: 'HOME',
    icon: 'Home4LineIcon',
    selected: ['/admin'],
    route: '/admin'
  },
  {
    title: 'MY_PRERAKS',
    icon: 'UserLineIcon',
    route: '/admin/facilitator'
  },
  {
    title: 'LEARNERS',
    icon: 'GroupLineIcon',
    route: '/admin/learner'
  }
  // {
  //   icon: 'GroupLineIcon'
  // },
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
  _sidebar
}) {
  const [refFoot, serRefFoot] = React.useState({})
  const [isOpen, setIsOpen] = React.useState(false)
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState)
  }
  return (
    <Center>
      <Drawer {...{ open: isOpen, onClose: setIsOpen, toggleDrawer, menus }} />
      <HeightWidth windowWidth={'100%'}>
        <Stack
          width={'100%'}
          style={{
            backgroundImage: imageUrl
              ? 'url(' + imageUrl + ')'
              : 'url(' + window.location.origin + '/header.png)',
            backgroundColor: 'transparent',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }}
          space={5}
        >
          {!isDisabledAppBar ? (
            <Box
              ref={(e) => {
                if (getRefAppBar) getRefAppBar(e)
              }}
            >
              <AppBar
                setIsOpenDrawer={setIsOpen}
                isEnableSearchBtn
                isShowNotificationButton={false}
                _box={{ bg: 'info.100' }}
                color={imageUrl ? 'white' : ''}
                languages={[
                  { title: 'En', code: 'en' },
                  { title: 'हिं', code: 'hi' }
                ]}
                {..._appBar}
              />
            </Box>
          ) : (
            <React.Fragment />
          )}
        </Stack>
        <HStack space={'2'}>
          <Sidebar
            _box={{
              display: ['none', 'none', 'block'],
              width: '5%',
              bg: 'info.100'
            }}
            menus={menus}
            {..._sidebar}
          />
          <Box flex={1}>
            {_header ? <Header {..._header} /> : <React.Fragment />}
            {children}
          </Box>
        </HStack>
      </HeightWidth>
    </Center>
  )
}
