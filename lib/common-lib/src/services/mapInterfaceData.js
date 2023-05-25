export default function interfaceData(
  element,
  formate,
  reverse = false,
  only = true
) {
  const data = {}
  for (var [key1, value1] of Object.entries(formate)) {
    if (!reverse) {
      if (key1 === 'mergeParameterWithDefaultValue') {
        for (var [mKey1, mValue1] of Object.entries(value1)) {
          data[mKey1] = mValue1
        }
      } else if (key1 === 'mergeParameterWithValue') {
        for (var [mvKey1, mvValue1] of Object.entries(value1)) {
          data[mvKey1] = element[mvValue1]
        }
      } else if (
        !['reverseValueWithParameter', 'defaultValueSet', 'format'].includes(
          key1
        )
      ) {
        const arr = value1?.split('.')
        let value = element
        arr.forEach((item) => {
          if (value[item]) {
            if (
              ['number', 'int'].includes(
                formate?.['format']?.[key1]?.toLowerCase()
              ) &&
              typeof value[item] !== 'object'
            ) {
              value = parseInt(value[item])
            } else if (
              ['string', 'str'].includes(
                formate?.['format']?.[key1]?.toLowerCase()
              ) &&
              typeof value[item] !== 'object'
            ) {
              value = `${value[item]}`
            } else {
              value = value[item]
            }
          } else {
            if (formate['defaultValueSet'][item]) {
              value = formate['defaultValueSet'][item]
            } else {
              value = ''
            }
          }
        })
        data[key1] = value
      }
    } else {
      if (only) {
        if (
          formate?.onlyParameter &&
          formate?.onlyParameter.length > 0 &&
          formate?.onlyParameter.includes(key1)
        ) {
          if (element[key1] || element[key1] === '') {
            if (formate['reverseValueWithParameter'][key1]) {
              data[key1] = element[key1]
            } else data[value1] = element[key1]
          }
        } else if (
          !formate?.onlyParameter &&
          formate?.removeParameter &&
          !formate?.removeParameter.includes(key1)
        ) {
          if (element[key1]) {
            if (formate['reverseValueWithParameter'][key1]) {
              data[key1] = element[key1]
            } else data[value1] = element[key1]
          }
        } else if (element[key1]) {
          if (formate['reverseValueWithParameter'][key1]) {
            data[key1] = element[key1]
          } else data[value1] = element[key1]
        }
      } else data[value1] = element[key1]
    }
  }
  return data
}
