import React, { useEffect } from 'react'
import { Box, Text, VStack, Stack, HStack, Pressable, Menu } from 'native-base'
import IconByName from '../IconByName'
import { Link, generatePath, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

export default function Sidebar({ _box, ...props }) {
  return (
    <VStack alignItems='center' {..._box} bg='textMaroonColor.350'>
      <Menus {...props} />
    </VStack>
  )
}
const PressableNew = ({ item, routeDynamics, children, ...prop }) => {
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
export const Menus = ({ menus, routeDynamics, ...props }) => {
  const [selected, setSelected] = React.useState(0)
  const { t } = useTranslation()
  const navigate = useNavigate()

  useEffect(() => {
    let path = window?.location?.pathname.toString()
    const arrData = menus.map((e) => e?.route)
    const index = arrData.indexOf(path.split('/').slice(0, 3).join('/'))
    if (index) {
      setSelected(index)
    } else {
      setSelected(0)
    }
  }, [])

  const navigateSubItems = (itemSub) => {
    setSelected(itemSub?.select)
    navigate(itemSub?.route)
  }
  return (
    <Box pt={4}>
      {menus?.map((item, index) =>
        item?.subMenu ? (
          <Menu
            alignItems={'center'}
            key={index || {}}
            w='190'
            placement='right'
            trigger={(triggerProps) => {
              return (
                <Pressable
                  accessibilityLabel='More options menu'
                  opacity={selected === index ? 1 : 0.5}
                  bg={selected === index ? 'textRed.400' : 'transparent'}
                  {...triggerProps}
                >
                  <Text color={selected === index ? 'white' : 'black'}>
                    <Stack
                      alignItems={'center'}
                      p='2'
                      space='2'
                      direction={['row', 'row', 'column']}
                    >
                      {item.icon && (
                        <IconByName
                          name={item?.icon}
                          isDisabled
                          color={selected === index ? 'white' : 'black'}
                          _icon={{ size: '25' }}
                        />
                      )}
                      {item?.title && (
                        <Text fontSize='12'>{t(item?.title)}</Text>
                      )}
                    </Stack>
                  </Text>
                </Pressable>
              )
            }}
          >
            {item?.subMenu.map((itemSub) => (
              <Menu.Item
                key={itemSub}
                onPress={() => navigateSubItems(itemSub)}
              >
                <HStack alignItems={'center'} p='2' space='2'>
                  {itemSub?.icon && (
                    <IconByName
                      name={itemSub?.icon}
                      isDisabled
                      _icon={{ size: '25' }}
                    />
                  )}
                  {itemSub?.title && (
                    <Text fontSize='12'>{t(itemSub?.title)}</Text>
                  )}
                </HStack>
              </Menu.Item>
            ))}
          </Menu>
        ) : (
          <PressableNew
            item={item}
            key={index || {}}
            cursor='pointer'
            opacity={selected === index ? 1 : 0.5}
            onPress={() => setSelected(0)}
            _
            bg={selected === index ? 'textRed.400' : 'transparent'}
            alignItems={['', '', 'center']}
          >
            <Text color={selected === index ? 'white' : 'black'}>
              <Stack
                alignItems={'center'}
                p='2'
                space='2'
                direction={['row', 'row', 'column']}
              >
                {item.icon && (
                  <IconByName
                    name={item?.icon}
                    color={selected === index ? 'white' : 'black'}
                    isDisabled
                    _icon={{ size: '25' }}
                  />
                )}
                {item?.title && <Text fontSize='12'>{t(item?.title)}</Text>}
              </Stack>
            </Text>
          </PressableNew>
        )
      )}
    </Box>
  )
}

Sidebar.propTypes = {
  _box: PropTypes.any
}
