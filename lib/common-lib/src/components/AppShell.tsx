import React from 'react'
import * as Sentry from '@sentry/react'
import { eventBus } from '../services/EventBus'
import AppRoutesContainer from './AppRoutesContainer'
import { getAppshellData } from './helper'

const replaySampleRateString = process.env.REACT_APP_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE;

if (process.env.REACT_APP_SENTRY_ENV) {
  Sentry.init({
    environment: `${process.env.REACT_APP_SENTRY_ENV}`,
    dsn: `${process.env.REACT_APP_SENTRY_DSN_URL}`,
    integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
    // Performance Monitoring
    tracesSampleRate: 0.1, // Capture 100% of the transactions, reduce in production!
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: replaySampleRateString
    ? parseInt(replaySampleRateString) 
    : undefined // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  })
}
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
    const searchParams = Object?.fromEntries(urlSearchParams.entries())
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
