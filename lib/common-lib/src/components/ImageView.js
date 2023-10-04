import { t } from 'i18next'
import { Avatar, Button, Image, Box, HStack, VStack, Modal } from 'native-base'
import React from 'react'
import { getOne } from '../services/uploadRegistryService'
import { useWindowSize } from './helper'
import IconByName from './IconByName'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

export default function ImageView({
  source,
  text,
  isImageTag,
  isIframeTag,
  urlObject,
  _box,
  ...props
}) {
  const [data, setData] = React.useState()
  const [modalUrl, setModalUrl] = React.useState()
  const type = data?.key?.split('.').pop()
  const [width, height] = useWindowSize()
  React.useEffect(async () => {
    if (!urlObject) {
      if (source?.uri || source?.document_id) {
        const newData = await getOne({
          id: source.uri,
          document_id: source?.document_id
        })
        setData(newData)
      }
    } else {
      setData(urlObject)
    }
  }, [source?.uri, source?.document_id])

  return (
    <Box {..._box}>
      {!text ? (
        !data?.fileUrl ? (
          <React.Fragment />
        ) : type === 'pdf' || isIframeTag ? (
          <iframe
            style={{ border: 'none' }}
            frameBorder='0'
            src={data?.fileUrl}
            title={data?.fileUrl}
            {...{ width: props?.width, height: props?.height }}
          />
        ) : isImageTag ? (
          <img
            alt='Image not found'
            width={'30px'}
            height={'30px'}
            {...props}
            source={{
              ...source,
              uri: data?.fileUrl
            }}
            src={data?.fileUrl}
          />
        ) : (
          <Avatar
            alt='Image not found'
            width={'30px'}
            height={'30px'}
            {...props}
            source={{
              ...source,
              uri: data?.fileUrl
            }}
          />
        )
      ) : data?.fileUrl ? (
        <Button onPress={(e) => setModalUrl(data?.fileUrl)} variant='link'>
          {text}
        </Button>
      ) : (
        t('NA')
      )}
      <Modal isOpen={modalUrl} onClose={() => setModalUrl()}>
        <Modal.Content {...{ width, height }} maxWidth='80%'>
          <Modal.CloseButton />
          <Modal.Body margin={'20px'}>
            {type === 'pdf' ? (
              <iframe src={modalUrl} title={modalUrl} {...{ width, height }} />
            ) : (
              <TransformWrapper>
                {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                  <VStack space='3'>
                    <HStack
                      space='2'
                      justifyContent='center'
                      alignItems='center'
                    >
                      <IconByName
                        p='0'
                        color='light.400'
                        _icon={{ size: '30' }}
                        name='AddCircleLineIcon'
                        onPress={(e) => zoomIn()}
                      />
                      <IconByName
                        p='0'
                        color='light.400'
                        _icon={{ size: '30' }}
                        name='IndeterminateCircleLineIcon'
                        onPress={(e) => zoomOut()}
                      />
                      <IconByName
                        p='0'
                        color='light.400'
                        _icon={{ size: '30' }}
                        name='RefreshLineIcon'
                        onPress={(e) => resetTransform()}
                      />
                    </HStack>
                    <VStack
                      justifyContent='center'
                      alignItems='center'
                      borderWidth='1px'
                      borderColor='light.400'
                    >
                      <TransformComponent wrapperStyle={{ width: '100%' }}>
                        <VStack
                          justifyContent='center'
                          alignItems='center'
                          rounded='sm'
                          borderWidth='1px'
                          borderColor='light.100'
                          {...{
                            width: '100%',
                            height: '100vh'
                          }}
                        >
                          <Image
                            alt='Image not found'
                            {...{ width, height }}
                            {...props}
                            source={{
                              ...source,
                              uri: modalUrl
                            }}
                          />
                        </VStack>
                      </TransformComponent>
                    </VStack>
                  </VStack>
                )}
              </TransformWrapper>
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  )
}
