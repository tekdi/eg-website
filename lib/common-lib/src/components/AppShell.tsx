import React from 'react'
import { eventBus } from '../services/EventBus'
import AppRoutesContainer from './AppRoutesContainer'
import { getAppshellData } from './helper'

function AppShell({
  colors,
  themeName,
  routes,
  AuthComponent,
  basename,
  appName,
  _authComponent,
  skipLogin = false,
  guestRoutes,
  ...otherProps
}: any) {
  const [token, setToken] = React.useState(localStorage.getItem('token'))
  const [theme, setTheme] = React.useState<any>({})
  const [accessRoutes, setAccessRoutes] = React.useState<any>([])
  const [alert, setAlert] = React.useState<any>()
  if (localStorage.getItem('console')) {
    console.log({ accessRoutes })
  }
  React.useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search)
    const searchParams = Object.fromEntries(urlSearchParams.entries())
    if (searchParams.token != undefined) {
      localStorage.setItem('token', searchParams.token)
      setToken(searchParams.token)
      skipLogin = true
    }
  }, [])

  React.useEffect(() => {
    const getData = async () => {
      const { newTheme, newRoutes, config } = await getAppshellData(
        routes,
        '',
        themeName
      )
      if (!token) {
        if (AuthComponent) {
          setAccessRoutes([
            ...(guestRoutes ? guestRoutes : []),
            {
              path: '*',
              component: AuthComponent
            }
          ])
        } else {
          setAccessRoutes([...(guestRoutes ? guestRoutes : [])])
        }
      } else {
        setAccessRoutes(routes)
      }
      setTheme(newTheme)
    }

    getData()
    const subscription = eventBus.subscribe('AUTH', (data, envelop) => {
      if (data.eventType == 'LOGIN_SUCCESS') {
        setToken(localStorage.getItem('token'))
      } else if (data.eventType == 'LOGOUT') {
        if (skipLogin) {
          setTimeout(() => {
            window.location.href = '/oauth2/sign_out?rd=/'
          }, 1)
        } else {
          setTimeout(() => {
            window.location.href = '/'
          }, 1)
        }
      }
    })
    return () => {
      eventBus.unsubscribe(subscription)
    }
  }, [token, routes, otherProps?.footerLinks])

  if (!Object.keys(theme).length) {
    return <React.Fragment />
  }

  return (
    <AppRoutesContainer
      {...{
        theme,
        routes: accessRoutes,
        basename,
        appName: 'Teacher App',
        alert,
        setAlert,
        ...otherProps
      }}
    />
  )
}
export default AppShell
