import { Text } from 'native-base'
import React from 'react'
import * as enumRegistryService from '../services/enumRegistryService'
import PropTypes from 'prop-types'

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

GetEnumValue.propTypes = {
  enumType: PropTypes.string,
  enumOptionValue: PropTypes.string,
  enumApiData: PropTypes.any,
  t: PropTypes.any
}
