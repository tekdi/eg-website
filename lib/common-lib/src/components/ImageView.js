import { Avatar } from 'native-base'
import React from 'react'
import { getOne } from '../services/uploadRegistryService'

export default function ImageView({ source, ...props }) {
  const [profileUrl, setProfileUrl] = React.useState()
  React.useEffect(async () => {
    const data = await getOne({ id: source.uri })
    setProfileUrl(data?.fileUrl)
  }, [source?.uri])
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
