import React from 'react'
import Layout from '../layout/Layout'
import PropTypes from 'prop-types'

export default function App({ _footer, _drawer, user, facilitator, ...props }) {
  return (
    <Layout
      facilitator={user || facilitator}
      _drawer={{
        ..._drawer,
        exceptIconsShow: ['resultsBtn'],
        isHideProgress: true,
        chipComp: true
      }}
      allowRoles={['program_coordinator']}
      _footer={{
        ..._footer,
        menues: [
          {
            title: 'HOME',
            route: '/',
            icon: 'Home4LineIcon'
          },
          {
            title: 'PRERAKS',
            route: '/prerak/PrerakList',
            icon: 'GraduationCap'
          },
          {
            title: 'LEARNERS',
            route: '/learners',
            icon: 'GraduationCap'
          },
          {
            title: 'CAMPS',
            icon: 'CommunityLineIcon',
            route: '/camps'
          }
        ]
      }}
      {...props}
    />
  )
}

App.propTypes = {
  _footer: PropTypes.object,
  _drawer: PropTypes.object,
  user: PropTypes.object,
  facilitator: PropTypes.object
}
