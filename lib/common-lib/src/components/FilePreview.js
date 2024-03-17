import { t } from 'i18next'
import { Avatar, Button, Image, Box, Modal, HStack, Center } from 'native-base'
import React, { useEffect, useState } from 'react'
import { useWindowSize, getFileTypeFromBase64 } from './helper'
import IconByName from './IconByName'

export default function FilePreview({
  base64,
  source,
  text,
  isImageTag,
  isIframeTag,
  urlObject,
  _box,
  _button,
  ...props
}) {
  const [data, setData] = useState()
  const [modalUrl, setModalUrl] = useState(false)
  const [type, setType] = useState('')
  const [width, height] = useWindowSize()

  const downloadImage = () => {
    const FileSaver = require('file-saver')
    FileSaver.saveAs(`${modalUrl}`)
  }

  useEffect(() => {
    async function fetchData() {
      if (base64) {
        let temp_type = await getFileTypeFromBase64(base64)
        setType(temp_type)
        //console.log("type", temp_type);
      }
    }
    fetchData()
  }, [base64])

  return (
    <Box {..._box}>
      {!text &&
        base64 &&
        (type.includes('image') ? (
          <img alt='Image not found' {...props} src={base64} />
        ) : type.includes('application/pdf') ? (
          <iframe
            src={base64}
            width='100%'
            height='500px'
            title='PDF Preview'
          ></iframe>
        ) : (
          t('NA')
        ))}

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
            width={'300px'}
            height={'300px'}
            {...props}
            src={base64}
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
      ) : text && base64 ? (
        <Button
          variant={'link'}
          onPress={(e) => setModalUrl(true)}
          {..._button}
        >
          {text}
        </Button>
      ) : (
        t('NA')
      )}

      <Modal isOpen={modalUrl} onClose={() => setModalUrl(false)}>
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
              {type.includes('application/pdf') ? (
                <iframe
                  src={base64}
                  width='100%'
                  height='500px'
                  title='PDF Preview'
                ></iframe>
              ) : (
                <img alt='Image not found' {...props} src={base64} />
              )}
            </div>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  )
}
