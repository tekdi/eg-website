import React, { useEffect } from 'react'
import { Box, Text, VStack, Stack } from 'native-base'
import IconByName from '../IconByName'
import { Link, generatePath } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Sidebar({ _box, ...props }) {
  return (
    <VStack alignItems='center' {..._box} px='6' bg='textMaroonColor.350'>
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
  useEffect(() => {
    let path = window?.location?.pathname.toString()
    if (path.startsWith('/admin/facilitator')) {
      setSelected(1)
    } else if (path.startsWith('/admin/learners')) {
      setSelected(2)
    } else {
      setSelected(0)
    }
  }, [])

  return (
    <Box pt={4}>
      {menus?.map((item, index) => (
        <PressableNew
          item={item}
          key={index || {}}
          cursor='pointer'
          opacity={selected === index ? 1 : 0.5}
          onPress={() => setSelected(0)}
          bg={selected === index ? 'textRed.400' : 'transparent'}
          alignItems={['', '', 'center']}
        >
          <Text color={selected === index ? 'white' : 'black'}>
            <Stack
              alignItems={'center'}
              p='2'
              space='2'
              bg={'textRed.400'}
              direction={['row', 'row', 'column']}
            >
              {item.icon && (
                <IconByName
                  name={item?.icon}
                  color={selected === index ? 'white' : 'black'}
                  isDisabled
                  _icon={{ size: '25px' }}
                />
              )}
              {item?.title && <Text fontSize='12'>{t(item?.title)}</Text>}
            </Stack>
          </Text>
        </PressableNew>
      ))}
    </Box>
  )
}
