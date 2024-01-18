import { t } from 'i18next'
import { Avatar, Button, Image, Box, Modal, HStack, Center } from 'native-base'
import React from 'react'
import { getOne } from '../services/uploadRegistryService'
import { useWindowSize } from './helper'
import IconByName from './IconByName'

export default function ImageView({
  source,
  text,
  isImageTag,
  isIframeTag,
  urlObject,
  _box,
  _button,
  ...props
}) {
  const [data, setData] = React.useState()
  const [modalUrl, setModalUrl] = React.useState()
  const type = data?.key?.split('.').pop()
  const [width, height] = useWindowSize()

  const downloadImage = () => {
    const FileSaver = require('file-saver')
    FileSaver.saveAs(`${modalUrl}`)
  }

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
  }, [source?.uri, source?.document_id, urlObject])

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
            loading='lazy'
            {...{ width: props?.width, height: props?.height }}
          />
        ) : isImageTag ? (
          <img
            alt='Image not found'
            width={'30px'}
            height={'30px'}
            {...props}
            src={data?.fileUrl}
          />
        ) : (
          <Avatar
            alt='Image not found'
            {...(!props?.size ? { width: '30px', height: '30px' } : {})}
            {...props}
            source={{
              ...source,
              uri: data?.fileUrl
            }}
          />
        )
      ) : data?.fileUrl ? (
        <Button
          variant={'link'}
          onPress={(e) => setModalUrl(data?.fileUrl)}
          {..._button}
        >
          {text}
        </Button>
      ) : (
        t('NA')
      )}

      <Modal isOpen={modalUrl} onClose={() => setModalUrl()}>
        <Modal.Content {...{ width }} maxWidth={'80%'}>
          <Modal.CloseButton />
          <Modal.Body padding={'30px'}>
            <HStack space={3} justifyContent='center'>
              <Center>
                <Button
                  rightIcon={<IconByName name='DownloadLineIcon' />}
                  variant={'outline'}
                  onPress={downloadImage}
                  marginBottom={'20px'}
                  borderRadius={'100px'}
                  p='4'
                  height={'40px'}
                >
                  {t('DOWNLOAD')}
                </Button>
              </Center>
            </HStack>
            <div id='modalContent'>
              {type === 'pdf' ? (
                <iframe
                  src={modalUrl}
                  title={modalUrl}
                  {...{ width, height }}
                />
              ) : (
                <Image
                  alt='Image not found'
                  {...{ width, height }}
                  {...props}
                  source={{
                    ...source,
                    uri: modalUrl
                  }}
                />
              )}
            </div>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  )
}
