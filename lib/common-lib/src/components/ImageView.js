import { t } from 'i18next'
import { Avatar, Button, Image, Box, Modal } from 'native-base'
import React from 'react'
import { getOne } from '../services/uploadRegistryService'
import { useWindowSize } from './helper'

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
        <Modal.Content {...{ width, height }}>
          <Modal.CloseButton />
          <Modal.Body>
            {type === 'pdf' ? (
              <iframe
                src={modalUrl}
                title={modalUrl}
                {...{ width, height }}
              ></iframe>
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
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  )
}
