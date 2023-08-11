import React from 'react'

import Drawer from 'react-modern-drawer'
import ImageView from '../ImageView'
import IconByName from '../IconByName'
import * as AdminTypo from '../../components/admin_component'
import { Box, SmallCloseIcon, Stack, VStack } from 'native-base'
import { Menus } from './Sidebar'

export default function App(props) {
  const profile_url = localStorage.getItem('profile_url')
  return (
    <Drawer
      direction='left'
      zIndex='99999'
      lockBackgroundScroll={true}
      {...props}
    >
      <Stack space='10'>
        <VStack paddingTop='10px' paddingRight='5'>
          <SmallCloseIcon
            size='sm'
            paddingLeft='100%'
            onClick={props?.toggleDrawer}
          />

          <VStack alignItems='Center'>
            {profile_url ? (
              <ImageView
                source={{
                  uri: profile_url
                }}
                alt='Image not found'
                width={'132px'}
                height={'132px'}
              />
            ) : (
              <IconByName
                name='AccountCircleLineIcon'
                color='textGreyColor.600'
                _icon={{ size: '132' }}
              />
            )}
            <AdminTypo.H5>{localStorage.getItem('fullName')}</AdminTypo.H5>
          </VStack>
        </VStack>
        <Menus menus={props?.menus} />
      </Stack>
    </Drawer>
  )
}
