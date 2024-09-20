import { Box, Button, HStack, Image, Stack, VStack } from 'native-base'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Webcam from 'react-webcam'
import { H2 } from './frontend_component'
import { useWindowSize } from './helper'
import IconByName from './IconByName'
import { H1, Subtitle } from './layout/HeaderTags'
import Loading from './Loading'
import imageCompression from 'browser-image-compression'
import PropTypes from 'prop-types'

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
  const webcamRef = useRef(null)
  const [width, height] = useWindowSize()
  const { t } = useTranslation()
  const topElement = useRef(null)
  const bottomElement = useRef(null)
  const [cameraHeight, setCameraHeight] = useState()
  const [permissionsError, setPermissionsError] = useState()
  const [selected, setSelected] = useState(false)
  const [torch, setTorch] = useState(cameraSide)
  const [track, setTrack] = useState()
  const [cameraRerender, setCameraRerender] = useState('no')

  useEffect(async () => {
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
        // width console.log(topElement?.current?.clientWidth)
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

  return null
}

Camera.propTypes = {
  filePreFix: PropTypes.string,
  cameraSide: PropTypes.string,
  cameraModal: PropTypes.bool,
  setCameraModal: PropTypes.func,
  onFinish: PropTypes.func,
  cameraUrl: PropTypes.string,
  setCameraUrl: PropTypes.func,
  setcameraFile: PropTypes.func,
  headerComponent: PropTypes.element,
  footerComponent: PropTypes.element,
  messageComponent: PropTypes.element,
  webcamOver: PropTypes.element,
  videoConstraints: PropTypes.object,
  _box: PropTypes.object,
  facing: PropTypes.string,
  loading: PropTypes.bool
}
