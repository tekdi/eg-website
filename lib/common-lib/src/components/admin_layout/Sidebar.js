import React, { useEffect } from 'react'
import { Box, Text, VStack, Stack, Menu, Pressable, HStack } from 'native-base'
import IconByName from '../IconByName'
import { Link, generatePath, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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
    if (path.startsWith('/admin/facilitator')) {
      setSelected(1)
    } else if (path.startsWith('/admin/learners')) {
      setSelected(2)
    } else if (path.startsWith('/admin/camps')) {
      setSelected(3)
    } else if (path.startsWith('/admin/reports')) {
      setSelected(4)
    } else if (path.startsWith('/admin/attendances')) {
      setSelected(5)
    } else {
      setSelected(0)
    }
  }, [])

  const navigateSubItems = (itemSub) => {
    setSelected(4)
    navigate(itemSub?.route)
  }

  return (
    <Box pt={4}>
      {menus?.map((item, index) =>
        item?.subMenu ? (
          <Menu
            key={index || {}}
            w='190'
            placement='right'
            trigger={(triggerProps) => {
              SubMenuFUnction(triggerProps)
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

const SubMenuFUnction = ({ triggerProps }) => {
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
          {item?.title && <Text fontSize='12'>{t(item?.title)}</Text>}
        </Stack>
      </Text>
    </Pressable>
  )
}

Sidebar.propTypes = {
  _box: PropTypes.any
}
PressableNew.propTypes = {
  routeDynamics: PropTypes.any,
  item: PropTypes.any,
  children: PropTypes.any
}
Menus.propTypes = {
  menus: PropTypes.any,
  routeDynamics: PropTypes.any
}
SubMenuFUnction.propTypes = {
  triggerProps: PropTypes.any
}
