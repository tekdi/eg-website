import { Box, Button, HStack, Image, Stack, VStack, Alert } from 'native-base'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Webcam from 'react-webcam'
import { H2 } from './frontend_component'
import { useWindowSize } from './helper'
import IconByName from './IconByName'
import { H1, Subtitle } from './layout/HeaderTags'
import Loading from './Loading'
import imageCompression from 'browser-image-compression'

export default function Camera({
  filePreFix,
  cameraSide,
  cameraModal,
  setCameraModal,
  onFinish,
  cameraUrl,
  setCameraUrl,
  setcameraFile,
  headerComponent,
  footerComponent,
  messageComponent,
  webcamOver,
  videoConstraints,
  _box,
  facing,
  loading
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
  const [torch, setTorch] = React.useState(cameraSide)
  const [track, setTrack] = React.useState()
  const [cameraRerender, setCameraRerender] = React.useState('no')

  React.useEffect(async () => {
    setSelected(facing)
  }, [])

  const toggleTourch = (newTorch) => {
    if (track) {
      try {
        track?.applyConstraints({
          advanced: [{ torch: newTorch }]
        })
      } catch (e) {}
    }
  }

  const capture = async () => {
    const screenshot = webcamRef.current.getScreenshot({
      screenshotFormat: 'image/webp',
      screenshotQuality: '1'
    })
    const blob = await dataURLtoBlob(screenshot)
    if (setCameraUrl) setCameraUrl(screenshot, blob)
    if (setcameraFile) setcameraFile(blob)
  }

  const dataURLtoBlob = async (dataurl) => {
    if (dataurl === null) {
      return null
    }
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    const blob = new Blob([u8arr], { type: mime })

    if (blob instanceof Blob) {
      const compressedImage = await imageCompression(blob, {
        maxSizeMB: 0.1,
        maxWidthOrHeight: Math.max(width || 1024, height || 768),
        useWebWorker: true
      })

      return new File([compressedImage], `camera_${filePreFix || ''}.jpeg`, {
        type: mime
      })
    }
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
        }
      />
    )
  }

  if (cameraModal) {
    return (
      <Box alignItems={'center'}>
        <Box
          // position='fixed'
          zIndex={100}
          {...{ width, height }}
          bg='gray.900'
          {..._box}
        >
          <Box p='20px' ref={topElement}>
            {headerComponent ? (
              <HStack>
                {headerComponent}
                <VStack>
                  <IconByName
                    name='CloseCircleLineIcon'
                    _icon={{ color: 'white', size: '30px' }}
                    onPress={(e) => {
                      if (cameraUrl) {
                        setCameraUrl()
                      } else {
                        setCameraModal(false)
                      }
                    }}
                  />
                </VStack>
              </HStack>
            ) : (
              <HStack
                space={4}
                justifyContent='space-between'
                flex={1}
                alignItems='center'
                alignSelf={cameraUrl ? 'end' : ''}
              >
                {!cameraUrl && (
                  <IconByName
                    name='Settings4LineIcon'
                    _icon={{ color: 'white', size: '30px' }}
                  />
                )}
                <IconByName
                  name='CloseCircleLineIcon'
                  _icon={{ color: 'white', size: '30px' }}
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
              // style={{
              //   position: 'relative',
              //   height: '300px',
              //   width: '100vw',
              //   objectFit: 'contain'
              // }}
            />
          ) : loading ? (
            <Stack {...{ width, height: cameraHeight }} justifyContent='center'>
              {loading}
            </Stack>
          ) : (
            <Stack>
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
                mirrored={!selected}
                audio={false}
                ref={webcamRef}
                screenshotFormat='image/jpeg'
                {...{
                  height: isNaN(cameraHeight) ? 100 : cameraHeight
                }}
                videoConstraints={{
                  screenshotFormat: 'image/webp',
                  screenshotQuality: '1',
                  width: 640,
                  height: 480,
                  facingMode: selected ? 'environment' : 'user',
                  ...videoConstraints
                }}
              />
              {webcamOver}
            </Stack>
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
                    _icon={{ color: 'white', size: '60px' }}
                    onPress={(e) => {
                      capture()
                    }}
                  />
                )}
              </VStack>
            ) : (
              <VStack space={2}>
                {messageComponent}
                <HStack
                  space={4}
                  justifyContent='space-around'
                  flex={1}
                  alignItems='center'
                >
                  {!cameraUrl && (
                    <IconByName
                      name={torch ? 'FlashlightFillIcon' : 'FlashlightLineIcon'}
                      _icon={{ color: 'white', size: '30px' }}
                      onPress={(e) => {
                        const newTorch = !torch
                        setTorch(newTorch)
                        toggleTourch(newTorch)
                      }}
                    />
                  )}
                  <VStack alignItems='center'>
                    {(!loading || cameraUrl) && (
                      <IconByName
                        name={
                          !cameraUrl
                            ? 'CheckboxBlankCircleLineIcon'
                            : 'CheckboxCircleLineIcon'
                        }
                        _icon={{ color: 'white', size: '60px' }}
                        onPress={(e) => {
                          !cameraUrl ? capture() : onFinish && onFinish()
                        }}
                      />
                    )}
                    <Subtitle color={'white'}>{t('CAPTURE')}</Subtitle>
                  </VStack>
                  {!cameraUrl && (
                    <IconByName
                      name='CameraSwitchLineIcon'
                      _icon={{ color: 'white', size: '30px' }}
                      onPress={(e) => setSelected(!selected)}
                    />
                  )}
                </HStack>
              </VStack>
            )}
          </Box>
        </Box>
      </Box>
    )
  }

  return <React.Fragment />
}
