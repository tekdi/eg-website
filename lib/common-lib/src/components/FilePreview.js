import { t } from 'i18next'
import { Avatar, Button, Box, Modal, HStack, Center } from 'native-base'
import React, { useEffect, useState } from 'react'
import { useWindowSize, getFileTypeFromBase64 } from './helper'
import IconByName from './IconByName'
import PropTypes from 'prop-types'

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
  const [pdf, setPdf] = useState()
  const [modalUrl, setModalUrl] = useState(false)
  const [type, setType] = useState('')
  const [width, height] = useWindowSize()

  const downloadImage = () => {
    const a = document.createElement('a')
    a.href = pdf
    if (type.includes('application/pdf')) {
      a.download = 'document.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } else {
      a.download = 'document.jpg'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  async function base64toBlob(base64Data, contentType = 'application/pdf') {
    const byteCharacters = atob(base64Data.split(',')[1])
    const byteArrays = []

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512)

      const byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }

      const byteArray = new Uint8Array(byteNumbers)
      byteArrays.push(byteArray)
    }

    const blob = new Blob(byteArrays, { type: contentType })
    return blob
  }

  useEffect(() => {
    async function fetchData() {
      if (base64) {
        try {
          let temp_type = await getFileTypeFromBase64(base64)
          setType(temp_type)
          const pdfBlob = await base64toBlob(base64)
          const pdfUrl = URL.createObjectURL(pdfBlob)
          setPdf(pdfUrl)
        } catch (error) {
          console.error('Error decoding base64 data:', error)
        }
      }
    }
    fetchData()
  }, [base64])

  const getFilePreview = () => {
    if (type === 'pdf' || isIframeTag) {
      return (
        <iframe
          style={{ border: 'none', borderColor: 'none' }}
          src={data?.fileUrl}
          title={data?.fileUrl}
          loading='lazy'
          {...{ width: props?.width, height: props?.height }}
        />
      )
    } else if (isImageTag) {
      return (
        <img
          alt='Image_not_found'
          width={'300px'}
          height={'300px'}
          {...props}
          src={base64}
        />
      )
    } else {
      return (
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
    }
  }

  let filePreview = null
  if (data?.fileUrl) {
    filePreview = getFilePreview()
  }

  const buttonOrText = data?.fileUrl ? (
    <Button
      variant={'link'}
      onPress={(e) => setModalUrl(data?.fileUrl)}
      {..._button}
    >
      {text}
    </Button>
  ) : (
    t('NA')
  )

  const getPreviewElement = () => {
    if (type.includes('image')) {
      return <img alt='Image_not_found' {...props} src={base64} />
    } else if (type.includes('application/pdf')) {
      return (
        <iframe
          src={pdf}
          width='100%'
          height='500px'
          title='PDF Preview'
        ></iframe>
      )
    } else {
      return t('NA')
    }
  }

  return (
    <Box {..._box}>
      {!text && base64 && getPreviewElement()}

      {!text ? filePreview : buttonOrText}

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
                  src={pdf}
                  width='100%'
                  height='500px'
                  title='PDF Preview'
                ></iframe>
              ) : (
                <img
                  style={{ width: '100%' }}
                  alt={
                    type.includes('application/pdf')
                      ? 'PDF document'
                      : 'File preview'
                  }
                  {...props}
                  src={base64}
                />
              )}
            </div>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  )
}

FilePreview.propTypes = {
  base64: PropTypes.string,
  source: PropTypes.string,
  borderRadius: PropTypes.number,
  text: PropTypes.string,
  isImageTag: PropTypes.bool,
  isIframeTag: PropTypes.bool,
  urlObject: PropTypes.object,
  _box: PropTypes.object,
  _button: PropTypes.object,
  width: PropTypes.any,
  height: PropTypes.any,
  size: PropTypes.any
}
