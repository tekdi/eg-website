import { Box, Button, HStack, Image, VStack } from 'native-base'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Webcam from 'react-webcam'
import { useWindowSize } from './helper'
import IconByName from './IconByName'
import { H1, Subtitle } from './layout/HeaderTags'
import { t } from 'i18next'
import Loading from './Loading'

export default function Camera({
  cameraModal,
  setCameraModal,
  cameraUrl,
  setCameraUrl
}) {
  const webcamRef = React.useRef(null)
  const [width, height] = useWindowSize()
  const { t } = useTranslation()
  const topElement = React.useRef(null)
  const bottomElement = React.useRef(null)
  const [cameraHeight, setCameraHeight] = React.useState()
  const [cameraWidth, setCameraWidth] = React.useState()
  const [permissionsError, setPermissionsError] = React.useState()
  const capture = () => {
    const screenshot = webcamRef.current.getScreenshot()
    const blob = dataURLtoBlob(screenshot)
    setCameraUrl(screenshot, blob)
  }

  const dataURLtoBlob = (dataurl) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }

    return new Blob([u8arr], { type: mime })
  }

  React.useEffect(() => {
    let isMounted = true

    async function fetchData() {
      let newHeight =
        height -
        ((topElement?.current?.clientHeight
          ? topElement?.current?.clientHeight
          : 0) +
          (bottomElement?.current?.clientHeight
            ? bottomElement?.current?.clientHeight
            : 0))
      if (isMounted) {
        setCameraWidth(topElement?.current?.clientWidth)
        setCameraHeight(newHeight)
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  })

  if (permissionsError) {
    return (
      <Loading
        customComponent={
          <React.Fragment>
            <VStack space={4} alignItems='center'>
              <H1>{t(`CAMERA_PERMISSION_DENIED`)}</H1>
              <Button
                onPress={(e) => {
                  if (cameraUrl) {
                    setCameraUrl()
                  } else {
                    setCameraModal(false)
                  }
                }}
              >
                {t('GO_TO_BACK')}
              </Button>
            </VStack>
          </React.Fragment>
        }
      />
    )
  }

  if (cameraModal) {
    return (
      <Box alignItems={'center'}>
        <Box position='fixed' zIndex={100} {...{ width, height }} bg='gray.900'>
          <Box p='20px' ref={topElement}>
            <HStack
              space={4}
              justifyContent='space-between'
              flex={1}
              alignItems='center'
            >
              {!cameraUrl ? (
                <IconByName
                  name='Settings4LineIcon'
                  color={'white'}
                  _icon={{
                    size: '30px'
                  }}
                />
              ) : (
                ''
              )}
              <IconByName
                name='CloseCircleLineIcon'
                color={'white'}
                _icon={{
                  size: '30px'
                }}
                onPress={(e) => {
                  if (cameraUrl) {
                    setCameraUrl()
                  } else {
                    setCameraModal(false)
                  }
                }}
              />
            </HStack>
          </Box>
          {cameraUrl ? (
            <Image
              {...{ width, height: cameraHeight }}
              source={{
                uri: cameraUrl
              }}
            />
          ) : (
            <Webcam
              onUserMediaError={(e) =>
                setPermissionsError(t(`CAMERA_PERMISSION_DENIED`))
              }
              mirrored='true'
              audio={false}
              ref={webcamRef}
              screenshotFormat='image/jpeg'
              {...{
                height: cameraHeight,
                width: cameraWidth
              }}
              videoConstraints={{
                facingMode: 'user',
                ...{
                  height: cameraHeight,
                  width: cameraWidth
                }
              }}
            />
          )}

          <Box p='30px' ref={bottomElement}>
            <HStack
              space={4}
              justifyContent='space-around'
              flex={1}
              alignItems='center'
            >
              {!cameraUrl ? (
                <IconByName
                  name='FlashlightLineIcon'
                  color={'white'}
                  _icon={{
                    size: '30px'
                  }}
                />
              ) : (
                ''
              )}
              <VStack alignItems='center'>
                <IconByName
                  name={
                    !cameraUrl
                      ? 'CheckboxBlankCircleLineIcon'
                      : 'CheckboxCircleLineIcon'
                  }
                  color={'white'}
                  _icon={{
                    size: '60px'
                  }}
                  onPress={(e) => capture()}
                />

                <Subtitle color={'white'}>{t('CAPTURE')}</Subtitle>
              </VStack>
              {!cameraUrl ? (
                <IconByName
                  name='CameraSwitchLineIcon'
                  color={'white'}
                  _icon={{
                    size: '30px'
                  }}
                />
              ) : (
                ''
              )}
            </HStack>
          </Box>
        </Box>
      </Box>
    )
  }

  return <React.Fragment />
}
