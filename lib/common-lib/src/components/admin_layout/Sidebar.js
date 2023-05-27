import React, { useEffect } from 'react'
import { Box, Text, Center, VStack,Image } from 'native-base'
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
          route: '/admin',
        }
        // {
        //   icon: 'UserLineIcon'
        // },
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
    if (path.startsWith('/attendance') || path.startsWith('/class')) {
      setSelected(1)
    } else if (path.startsWith('/worksheet')) {
      setSelected(3)
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
    <VStack alignItems='center' {..._box}>
      {sidebarMenus?.map((item, index) => (
        <PressableNew
          item={item}
          key={index}
          cursor='pointer'
          opacity={selected === index ? 1 : 0.5}
          p='3'
          onPress={() => setSelected(0)}
          bg={selected === index ? 'info.100' : 'transparent'}
        >
          <Text color={selected === index ? 'info.300' : 'black'}>
            <Center>
              {item.icon ? (
                <IconByName name={item?.icon} isDisabled />
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
