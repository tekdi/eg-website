import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { Box, Center, HStack, Stack } from 'native-base'
import AppBar from './AppBar'
import HeightWidth from '../HeightWidth'
import Drawer from './Drawer'

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
  const menus = [
    {
      title: 'LEARNERS',
      icon: 'GraduationCap',
      route: '/poadmin'
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
            backgroundImage: 'url(' + imageUrl + ')',
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
