import React, { useEffect } from 'react'
import { Box, Text, HStack, Center, Stack, VStack } from 'native-base'
import IconByName from '../IconByName'
import { useTranslation } from 'react-i18next'
import { Link, generatePath } from 'react-router-dom'
import { useWindowSize } from '../helper'

export default function Sidebar({ menues, routeDynamics, minH, ...props }) {
  const [selected, setSelected] = React.useState(0)
  const { t } = useTranslation()

  const [width, Height] = useWindowSize()
  const sidebarMenus = menues

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
    <VStack bg='white' alignItems='center' minH={minH}>
      {sidebarMenus?.map((item, index) => (
        <PressableNew
          item={item}
          key={index}
          cursor='pointer'
          opacity={selected === index ? 1 : 0.5}
          p='3'
          onPress={() => setSelected(0)}
        >
          <Text color={selected === index ? 'button.500' : 'coolGray.400'}>
            <Center>
              <IconByName name={item.icon} isDisabled />
              <Text fontSize='12'>{t(item.title)}</Text>
            </Center>
          </Text>
        </PressableNew>
      ))}
    </VStack>
  )
}
