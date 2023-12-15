import React, { useEffect } from 'react'
import { Box, Text, HStack, Center, VStack, useTheme } from 'native-base'
import IconByName from '../IconByName'
import { useTranslation } from 'react-i18next'
import { Link, generatePath } from 'react-router-dom'
import { useWindowSize } from '../helper'

export default function Footer({ menues, routeDynamics, setRef, ...props }) {
  const [selected, setSelected] = React.useState(0)
  const { t } = useTranslation()
  const { colors } = useTheme()
  const [width, Height] = useWindowSize()
  const footerMenus = menues

  useEffect(() => {
    let path = window?.location?.pathname.toString()
    if (path.startsWith('/attendance') || path.startsWith('/class')) {
      setSelected(1)
    } else if (path.startsWith('/table')) {
      setSelected(4)
    } else if (path.startsWith('/beneficiary')) {
      setSelected(1)
    } else if (path.startsWith('/community-references')) {
      setSelected(2)
    } else if (path.startsWith('/camps')) {
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
    <Box
      width={width}
      flex={1}
      safeAreaTop
      position='fixed'
      bottom='0'
      ref={(e) => setRef(e)}
      {...props}
    >
      <HStack bg='white' alignItems='center' safeAreaBottom shadow={6}>
        {footerMenus?.map((item, index) => (
          <PressableNew
            item={item}
            key={index}
            cursor='pointer'
            opacity={selected === index ? 1 : 0.5}
            flex={1}
            onPress={() => setSelected(0)}
          >
            <Text
              color={
                selected === index ? 'footer.boxBorder' : 'textGreyColor.100'
              }
            >
              <Center>
                <VStack alignItems='center'>
                  <Box
                    w='100%'
                    borderTopColor={
                      selected === index ? 'footer.boxBorder' : 'white'
                    }
                    borderTopWidth={4}
                    roundedBottom='4px'
                  />
                  <VStack py='3' alignItems='center'>
                    <IconByName
                      name={item?.icon}
                      isDisabled
                      _icon={{
                        size: '25px',
                        color:
                          selected === index
                            ? colors?.['footer']?.['boxBorder']
                            : colors?.['textGreyColor']?.['100']
                      }}
                    />
                    <Text fontSize='12'>{t(item.title)}</Text>
                  </VStack>
                </VStack>
              </Center>
            </Text>
          </PressableNew>
        ))}
      </HStack>
    </Box>
  )
}
