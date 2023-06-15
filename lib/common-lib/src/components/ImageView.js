import { t } from 'i18next'
import { Avatar, Button, Image, Box, Modal } from 'native-base'
import React from 'react'
import { getOne } from '../services/uploadRegistryService'

export default function ImageView({ source, text, ...props }) {
  const [data, setData] = React.useState()
  const [modalUrl, setModalUrl] = React.useState()
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
        <Modal.Content maxWidth='400px'>
          <Modal.CloseButton />
          <Modal.Body>
            <Image
              alt='Image not found'
              width={'400px'}
              height={'400px'}
              {...props}
              source={{
                ...source,
                uri: modalUrl
              }}
            />
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  )
}
