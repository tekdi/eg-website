import React from 'react'
import Footer from './Footer'
import { Box, Center, Stack } from 'native-base'
import AppBar from './AppBar'
import { useWindowSize } from '../helper'
import HeightWidth from '../HeightWidth'
import Loading from '../Loading'

export default function Layout({
  isDisabledAppBar,
  children,
  isCenter,
  imageUrl,
  getRefFoot,
  getRefAppBar,
  _appBar,
  _page,
  _center,
  _footer
}) {
  const [width, Height] = useWindowSize()
  const [refFoot, setRefFoot] = React.useState()
  const [refAppBar, setRefAppBar] = React.useState()

  return (
    <Center>
      {isCenter ? (
        <Loading customComponent={children} {..._center} />
      ) : (
        <React.Fragment>
          <HeightWidth windowWidth='1080' {..._page}>
            <Stack
              width={'100%'}
              style={{
                backgroundImage: imageUrl ? 'url(' + imageUrl + ')' : 'none',
                backgroundColor: 'transparent',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover'
              }}
              space={5}
            >
              {!isDisabledAppBar ? (
                <Box
                  ref={(e) => {
                    setRefAppBar(e)
                    if (getRefAppBar) getRefAppBar(e)
                  }}
                >
                  <AppBar
                    color={imageUrl ? 'white' : ''}
                    languages={[
                      { title: 'En', code: 'en' },
                      { title: 'Hi', code: 'hi' }
                    ]}
                    {..._appBar}
                  />
                </Box>
              ) : (
                <React.Fragment />
              )}
            </Stack>

            {children}

            {_footer?.menues ? (
              <Box
                minH={refFoot?.clientHeight ? `${refFoot?.clientHeight}px` : 0}
              />
            ) : (
              <React.Fragment />
            )}
          </HeightWidth>
          <Footer
            setRef={(e) => {
              setRefFoot(e)
              if (getRefFoot) getRefFoot(e)
            }}
            {..._footer}
          />
        </React.Fragment>
      )}
    </Center>
  )
}
