import { Avatar } from 'native-base'
import React from 'react'
import { getOne } from '../services/uploadRegistryService'

export default function ImageView({ source, ...props }) {
  const [profileUrl, setProfileUrl] = React.useState()
  React.useEffect(async () => {
    const data = await getOne({
      id: source.uri,
      document_id: source?.document_id
    })
    setProfileUrl(data?.fileUrl)
  }, [source?.uri, source?.document_id])
  return (
    <Avatar
      alt='Image not found'
      width={'30px'}
      height={'30px'}
      {...props}
      source={{
        ...source,
        uri: profileUrl
      }}
    />
  )
}
