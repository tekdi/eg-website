import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { Box, Center, HStack, Stack } from 'native-base'
import AppBar from './AppBar'
import { useWindowSize } from '../helper'
import HeightWidth from '../HeightWidth'

export default function Layout({
  isDisabledAppBar,
  subHeader,
  children,
  imageUrl,
  _appBar,
  _header,
  _subHeader,
  _sidebar
}) {
  const [width, Height] = useWindowSize()
  const [refFoot, serRefFoot] = React.useState({})
  return (
    <Center>
      <HeightWidth>
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
          ref={(e) => serRefFoot(e)}
        >
          {!isDisabledAppBar ? (
            <AppBar
              isEnableSearchBtn
              isShowNotificationButton
              _box={{ bg: '#E5E5E5' }}
              color={imageUrl ? 'white' : ''}
              {..._appBar}
            />
          ) : (
            <React.Fragment />
          )}
        </Stack>
        <HStack space={'2'}>
          <Sidebar
            minH={Height - (refFoot?.clientHeight ? refFoot?.clientHeight : 0)}
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
