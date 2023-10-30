import { Text } from 'native-base'
import React from 'react'
import { enumRegistryService } from '@shiksha/common-lib'
export default function GetEnumValue({
  enumType,
  enumOptionValue,
  enumApiData,
  t,
  ...props
}) {
  const [value, setValue] = React.useState()
  React.useEffect(async () => {
    let enumData = enumApiData
    if (!enumApiData) {
      enumApiData = await enumRegistryService.listOfEnum()
      enumData = enumApiData?.data
    }
    let enumTypeData = enumData[enumType]
    if (enumTypeData?.length > 0) {
      const translation = enumTypeData.find(
        (item) => item.value === enumOptionValue
      )
      if (translation?.title) {
        setValue(translation?.title)
      } else {
        setValue(enumOptionValue)
      }
    }
  }, [enumType, enumOptionValue, enumApiData, value])
  return <Text {...props}>{t ? t(value) : value}</Text>
}
