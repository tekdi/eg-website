import React, { useEffect } from 'react'
import Footer from './Footer'
import { Alert, Box, Center, HStack, Stack, VStack } from 'native-base'
import AppBar from './AppBar'
import { getTokernUserInfo, useWindowSize } from '../helper'
import HeightWidth from '../HeightWidth'
import Loading from '../Loading'
import { useLocation, useNavigate } from 'react-router-dom'
import Drawer from '../layout/Drawer'
import GATrackPageView from '../../services/AnalyticsService'
import PropTypes from 'prop-types'
import { FrontEndTypo, t } from '../..'

export default function Layout({
  isDisabledAppBar,
  children,
  isCenter,
  imageUrl,
  getRefFoot,
  getRefAppBar,
  getBodyHeight,
  loading,
  _appBar,
  _drawer,
  _page,
  _center,
  _footer,
  facilitator,
  stepTitle,
  pageTitle,
  analyticsPageTitle,
  allowRoles,
  onlyChildren,
  isPageAccess
}) {
  const [width, height] = useWindowSize()
  const [refFoot, setRefFoot] = React.useState()
  const [refAppBar, setRefAppBar] = React.useState()
  const location = useLocation()
  const [isOpen, setIsOpen] = React.useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Set doc title
    if (pageTitle !== undefined) {
      let title
      if (typeof stepTitle === 'function') {
        title = `${pageTitle}/${stepTitle()}`
      } else if (typeof stepTitle === 'string') {
        title = `${pageTitle}/${stepTitle}`
      } else {
        title = pageTitle
      }
      document.title = title
    }
    // GATrackPageView
    if (analyticsPageTitle !== undefined) {
      GATrackPageView({ analyticsPageTitle })
    }
  }, [location, analyticsPageTitle, pageTitle, stepTitle])

  useEffect(() => {
    const { resource_access } = getTokernUserInfo()
    if (
      resource_access?.hasura?.roles &&
      !resource_access?.hasura?.roles?.filter((e) => {
        if (allowRoles && Array.isArray(allowRoles)) {
          return allowRoles?.includes(e)
        }
        return ['facilitator'].includes(e)
      }).length > 0
    ) {
      window.location.reload()
    }
  }, [location])

  useEffect(() => {
    if (refFoot && refAppBar && height && getBodyHeight) {
      const newHeight = height - refAppBar?.clientHeight - refFoot?.clientHeight
      getBodyHeight(newHeight)
    }
  }, [refAppBar, refFoot, height])

  if (onlyChildren) {
    return children
  }

  if (loading === true) {
    return <Loading windowWidth='100%' />
  }

  if (isPageAccess) {
    return (
      <Loading
        customComponent={
          <VStack alignItems={'conter'} space={4} p='4'>
            <Alert w='100%' status={'warning'}>
              <VStack w='100%'>
                <HStack space={2} alignItems={'center'}>
                  <Alert.Icon color={'warning'} />
                  <FrontEndTypo.H3>{t('PAGE_NOT_ACCESSABLE')}</FrontEndTypo.H3>
                </HStack>
              </VStack>
            </Alert>

            <FrontEndTypo.Primarybutton onPress={() => navigate(-1)}>
              {t('BACK')}
            </FrontEndTypo.Primarybutton>
          </VStack>
        }
      />
    )
  }

  return (
    <Center>
      {isCenter ? (
        <Loading
          customComponent={children}
          windowWidth='1080'
          {...{
            _center: {
              shadow: 'appShadow',
              ..._center
            }
          }}
        />
      ) : (
        <HeightWidth>
          <Drawer
            {...{ isOpen, setIsOpen, facilitator, height }}
            {..._drawer}
          />
          <React.Fragment>
            <HeightWidth
              windowWidth='1080'
              {..._page}
              _scollView={{
                shadow: 'appShadow',
                ...(_page?._scollView || {})
              }}
            >
              <Stack
                width={'100%'}
                style={{
                  backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                  backgroundColor: 'transparent',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover'
                }}
                space={5}
              >
                {!isDisabledAppBar && (
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
                        { title: 'हिं', code: 'hi' }
                      ]}
                      {..._appBar}
                      setIsOpen={setIsOpen}
                    />
                  </Box>
                )}
              </Stack>

              {children}

              {_footer?.menues && (
                <Box
                  minH={
                    refFoot?.clientHeight ? `${refFoot?.clientHeight}px` : 0
                  }
                />
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
        </HeightWidth>
      )}
    </Center>
  )
}

Layout.PropTypes = {
  isDisabledAppBar: PropTypes.bool,
  children: PropTypes.any,
  isCenter: PropTypes.bool,
  imageUrl: PropTypes.string,
  getRefFoot: PropTypes.any,
  getRefAppBar: PropTypes.any,
  getBodyHeight: PropTypes.any,
  loading: PropTypes.bool,
  _appBar: PropTypes.any,
  _drawer: PropTypes.any,
  _page: PropTypes.any,
  _center: PropTypes.any,
  _footer: PropTypes.any,
  facilitator: PropTypes.any,
  stepTitle: PropTypes.string,
  pageTitle: PropTypes.string,
  analyticsPageTitle: PropTypes.string,
  allowRoles: PropTypes.any,
  onlyChildren: PropTypes.bool,
  isPageAccess: PropTypes.bool
}
