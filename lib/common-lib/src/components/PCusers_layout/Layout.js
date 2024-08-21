import React from 'react'
import Layout from '../layout/Layout'

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
            route: '/learner/learnerList',
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
