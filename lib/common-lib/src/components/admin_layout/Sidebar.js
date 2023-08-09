import React, { useEffect } from 'react'
import { Box, Text, Center, VStack, Image, Stack } from 'native-base'
import IconByName from '../IconByName'
import { Link, generatePath } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AdminTypo } from '../..'

export default function Sidebar({ _box, ...props }) {
  return (
    <VStack alignItems='center' {..._box} px='6'>
      <Menus {...props} />
    </VStack>
  )
}

export const Menus = ({ menus, routeDynamics, ...props }) => {
  const [selected, setSelected] = React.useState(0)
  const { t } = useTranslation()
  useEffect(() => {
    let path = window?.location?.pathname.toString()
    if (path.startsWith('/admin/facilitator')) {
      setSelected(1)
    } else if (path.startsWith('/admin/learner')) {
      setSelected(2)
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
    <Box>
      {menus?.map((item, index) => (
        <PressableNew
          item={item}
          key={index}
          cursor='pointer'
          opacity={selected === index ? 1 : 0.5}
          onPress={() => setSelected(0)}
          bg={selected === index ? 'info.100' : 'transparent'}
          alignItems={['', '', 'center']}
        >
          <Text color={selected === index ? 'blueText.400' : 'black'}>
            <Stack p='2' space='2' direction={['row', 'row', 'column']}>
              {item.icon ? (
                <React.Fragment>
                  <IconByName
                    name={item?.icon}
                    isDisabled
                    _icon={{ size: '25px' }}
                  />
                  <AdminTypo.H6 bold>{item.title}</AdminTypo.H6>
                </React.Fragment>
              ) : (
                <React.Fragment />
              )}
              {item?.title && (
                <Text display={['', '', 'none']} fontSize='12'>
                  {t(item?.title)}
                </Text>
              )}
            </Stack>
          </Text>
        </PressableNew>
      ))}
    </Box>
  )
}
