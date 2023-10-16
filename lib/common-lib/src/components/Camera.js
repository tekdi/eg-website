import { Box, Button, HStack, Image, VStack } from 'native-base'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Webcam from 'react-webcam'
import { H2 } from './frontend_component'
import { useWindowSize } from './helper'
import IconByName from './IconByName'
import { H1, Subtitle } from './layout/HeaderTags'
import Loading from './Loading'

export default function Camera({
  cameraModal,
  setCameraModal,
  cameraUrl,
  setCameraUrl,
  setcameraFile,
  headerComponent,
  footerComponent,
  _box
}) {
  const webcamRef = React.useRef(null)
  const [width, height] = useWindowSize()
  const { t } = useTranslation()
  const topElement = React.useRef(null)
  const bottomElement = React.useRef(null)
  const [cameraHeight, setCameraHeight] = React.useState()
  const [cameraWidth, setCameraWidth] = React.useState()
  const [permissionsError, setPermissionsError] = React.useState()
  const [selected, setSelected] = React.useState(false)
  const [torch, setTorch] = React.useState(false)
  const [track, setTrack] = React.useState()
  const [cameraRerender, setCameraRerender] = React.useState('no')

  const toggleTourch = (newTorch) => {
    if (track) {
      track.applyConstraints({
        advanced: [{ torch: newTorch }]
      })
    }
  }

  const capture = () => {
    const screenshot = webcamRef.current.getScreenshot()
    const blob = dataURLtoBlob(screenshot)
    if (setCameraUrl) setCameraUrl(screenshot, blob)
    if (setcameraFile) setcameraFile(blob)
  }

  const dataURLtoBlob = (dataurl) => {
    if (dataurl === null) {
      return null
    }
    let regex = /:(.*?);/
    let arr = dataurl.split(','),
      mime = arr[0].match(regex)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    const blob = new Blob([u8arr], { type: mime })
    return new File([blob], 'camera.jpeg', { type: mime })
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
              <H2>{permissionsError}</H2>
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
        <Box
          position='fixed'
          zIndex={100}
          {...{ width, height }}
          bg='gray.900'
          {..._box}
        >
          <Box p='20px' ref={topElement}>
            {headerComponent ? (
              <HStack>
                {headerComponent}
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
            ) : (
              <HStack
                space={4}
                justifyContent='space-between'
                flex={1}
                alignItems='center'
              >
                {!cameraUrl && (
                  <IconByName
                    name='Settings4LineIcon'
                    color={'white'}
                    _icon={{
                      size: '30px'
                    }}
                  />
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
            )}
          </Box>
          {cameraUrl ? (
            <Image
              {...{ width, height: cameraHeight }}
              source={{
                uri: cameraUrl?.url ? cameraUrl?.url : cameraUrl
              }}
              alt={cameraUrl}
            />
          ) : (
            <Webcam
              key={cameraRerender}
              onUserMedia={(e) => {
                const tracks = e?.getVideoTracks()
                if (tracks?.[0]) {
                  setTrack(tracks?.[0])
                }
              }}
              onUserMediaError={({ message }) => {
                if (message === 'Permission denied') {
                  setPermissionsError(message)
                } else {
                  setCameraRerender(cameraRerender === 'no' ? 'yes' : 'no')
                }
              }}
              facingMode={selected ? 'user' : 'environment'}
              mirrored={selected}
              audio={false}
              ref={webcamRef}
              screenshotFormat='image/jpeg'
              {...{
                height: isNaN(cameraHeight) ? 100 : cameraHeight
              }}
              videoConstraints={{
                facingMode: selected ? 'user' : 'environment'
              }}
            />
          )}

          <Box p='30px' ref={bottomElement}>
            {footerComponent ? (
              <VStack alignSelf='center'>
                {cameraUrl ? (
                  footerComponent
                ) : (
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
                )}
              </VStack>
            ) : (
              <HStack
                space={4}
                justifyContent='space-around'
                flex={1}
                alignItems='center'
              >
                {!cameraUrl && (
                  <IconByName
                    name={torch ? 'FlashlightFillIcon' : 'FlashlightLineIcon'}
                    color={'white'}
                    _icon={{
                      size: '30px'
                    }}
                    onPress={(e) => {
                      const newTorch = !torch
                      setTorch(newTorch)
                      toggleTourch(newTorch)
                    }}
                  />
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
                {!cameraUrl && (
                  <IconByName
                    name='CameraSwitchLineIcon'
                    color={'white'}
                    _icon={{
                      size: '30px'
                    }}
                    onPress={(e) => setSelected(!selected)}
                  />
                )}
              </HStack>
            )}
          </Box>
        </Box>
      </Box>
    )
  }

  return <React.Fragment />
}
