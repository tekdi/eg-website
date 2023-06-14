import { t } from 'i18next'
import { Avatar, Link } from 'native-base'
import React from 'react'
import { getOne } from '../services/uploadRegistryService'

export default function ImageView({ source, text, ...props }) {
  const [data, setData] = React.useState()
  React.useEffect(async () => {
    if (source.uri || source?.document_id) {
      const data = await getOne({
        id: source.uri,
        document_id: source?.document_id
      })
      setData(data)
    }
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
  ) : data?.fileUrl ? (
    <Link href={data?.fileUrl} isExternal={true}>
      {text}
    </Link>
  ) : (
    t('NA')
  )
}
