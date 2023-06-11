import { Avatar, Link } from 'native-base'
import React from 'react'
import { getOne } from '../services/uploadRegistryService'

export default function ImageView({ source, text, ...props }) {
  const [data, setData] = React.useState()
  React.useEffect(async () => {
    const data = await getOne({
      id: source.uri,
      document_id: source?.document_id
    })
    setData(data)
  }, [source?.uri, source?.document_id])
  return !text ? (
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
  ) : (
    <Link href={data?.fileUrl} isExternal>
      {text}
    </Link>
  )
}
