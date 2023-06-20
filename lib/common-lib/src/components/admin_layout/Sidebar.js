import React, { useEffect } from 'react'
import { Box, Text, Center, VStack, Image } from 'native-base'
import IconByName from '../IconByName'
import { Link, generatePath } from 'react-router-dom'

export default function Sidebar({ menues, routeDynamics, _box, ...props }) {
  const [selected, setSelected] = React.useState(0)
  const sidebarMenus = menues
    ? menues
    : [
        {
          icon: 'Home4LineIcon',
          selected: ['/admin'],
          route: '/admin'
        },
        {
          icon: 'UserLineIcon',
          route: '/admin/facilitator'
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

  useEffect(() => {
    let path = window?.location?.pathname.toString()
    if (path.startsWith('/admin/facilitator')) {
      setSelected(1)
    } else {
      setSelected(0)
    }
  }, [])

  const PressableNew = ({ item, children, ...prop }) => {
    return item?.route ? (
      <Box {...prop}>
        <Link
          style={{ textDecoration: 'none' }}
          to={
            routeDynamics
              ? generatePath(item.route, { ...{ id: item.id } })
              : item.route
          }
        >
          {children}
        </Link>
      </Box>
    ) : (
      <Box {...prop}>{children}</Box>
    )
  }

  return (
    <VStack alignItems='center' {..._box} px="6">
      {sidebarMenus?.map((item, index) => (
        <PressableNew
          item={item}
          key={index}
          cursor='pointer'
          opacity={selected === index ? 1 : 0.5}
          onPress={() => setSelected(0)}
          bg={selected === index ? 'info.100' : 'transparent'}
        >
          <Text color={selected === index ? 'blueText.400' : 'black'}>
            <Center pb="2">
              {item.icon ? (
                <IconByName
                  name={item?.icon}
                  isDisabled
                  
                  _icon={{ size: '25px' }}
                />
              ) : (
                <React.Fragment />
              )}
              {item?.title ? (
                <Text fontSize='12'>{t(item?.title)}</Text>
              ) : (
                <React.Fragment />
              )}
            </Center>
          </Text>
        </PressableNew>
      ))}
    </VStack>
  )
}
