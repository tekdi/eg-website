import { t } from 'i18next'
import { Avatar, Button, Image, Box, Modal } from 'native-base'
import React from 'react'
import { getOne } from '../services/uploadRegistryService'
import { useWindowSize } from './helper'

export default function ImageView({ source, text, ...props }) {
  const [data, setData] = React.useState()
  const [modalUrl, setModalUrl] = React.useState()
  const type = data?.key?.split('.').pop()
  const [width, height] = useWindowSize()
  React.useEffect(async () => {
    if (source.uri || source?.document_id) {
      const data = await getOne({
        id: source.uri,
        document_id: source?.document_id
      })
      setData(data)
    }
  }, [source?.uri, source?.document_id])

  return (
    <Box>
      {!text ? (
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
