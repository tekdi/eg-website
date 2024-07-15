import { Center, VStack, Image } from 'native-base'
import React from 'react'
import { useWindowSize } from './helper'
import { FrontEndTypo } from '..'
import { useTranslation } from 'react-i18next'

export default function Loading({ message = '', ...prop }) {
  const [width, height] = useWindowSize(prop?.windowWidth)
  const { t } = useTranslation()

  return (
    <Center
      _text={{
        color: 'white',
        fontWeight: 'bold'
      }}
      margin={'auto'}
      height={prop?.height ? prop.height : height}
      width={prop?.width ? prop.width : width}
      {...prop?._center}
    >
      {prop?.customComponent ? (
        prop?.customComponent
      ) : (
        <VStack space={2} alignItems={'center'}>
          <VStack space={2} alignItems='center' {...prop?._vstack}>
            {prop?.icon ? (
              prop.icon
            ) : (
              <Image
                source={{
                  uri: '/gif/loader.gif'
                }}
                alt='loader.gif'
                width={'210px'}
                height={'110px'}
              />
            )}
            <FrontEndTypo.H1 color='textMaroonColor.500' bold>
              {message && message != '' ? message : t('LOADING')}
            </FrontEndTypo.H1>
          </VStack>
        </VStack>
      )}
    </Center>
  )
}
