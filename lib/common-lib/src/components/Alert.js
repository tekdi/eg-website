import React from 'react'
import { HStack, useToast, VStack, Alert } from 'native-base'
import { H3, BodySmall } from './layout/HeaderTags'
import PropTypes from 'prop-types'

function AlertComponent({ alert, setAlert, _alert, type }) {
  const toast = useToast()

  React.useEffect(() => {
    if (alert) {
      let title,
        description = null
      let toastElement = {}
      type = type || 'primary'
      if (typeof alert === 'object' && (alert?.title || alert?.description)) {
        title = alert?.title
        description = alert?.description
        type =
          typeof alert?.type === 'string'
            ? alert?.type?.toLowerCase()
            : 'success'
      } else {
        description = alert
      }
      toastElement = {
        render: () => {
          return (
            <Alert w='100%' status={type} {..._alert}>
              <VStack w='100%'>
                <HStack space={2} alignItems={'center'}>
                  <Alert.Icon color={type} />
                  {!title ? (
                    <BodySmall color={type}>{description}</BodySmall>
                  ) : (
                    <H3 color={type}>{title}</H3>
                  )}
                </HStack>
                {title && <BodySmall color={type}>{description}</BodySmall>}
              </VStack>
            </Alert>
          )
        }
      }
      toast.show(toastElement)
      setAlert && setAlert()
    }
  }, [alert])
  return null
}
export default React.memo(AlertComponent)

AlertComponent.propTypes = {
  alert: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  setAlert: PropTypes.func,
  _alert: PropTypes.object,
  type: PropTypes.string
}
