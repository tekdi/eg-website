import { Center, VStack, Image } from 'native-base'
import React from 'react'
import { useWindowSize } from './helper'
import { FrontEndTypo } from '..'
export default function Loading({ message = 'Loading...', ...prop }) {
  const [width, height] = useWindowSize(prop?.windowWidth)

  return (
    <Center
      _text={{
        color: 'white',
        fontWeight: 'bold'
      }}
      height={prop?.height ? prop.height : height}
      width={prop?.width ? prop.width : width}
      {...prop?._center}
    >
      {prop?.customComponent ? (
        prop?.customComponent
      ) : (
        <VStack space={2} alignItems={'center'}>
          <VStack space={2} alignItems='center'>
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
              {message}
            </FrontEndTypo.H1>
          </VStack>
        </VStack>
      )}
    </Center>
  )
}
