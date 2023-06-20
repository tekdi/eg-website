import React from 'react'
import { Button, Stack } from 'native-base'
import IconByName from '../../../IconByName'

const StatusButton = ({ children, leftIcon, status, ...props }) => {
  const [color, setColor] = React.useState('')
  const [icon, setIcon] = React.useState()
  React.useEffect(() => {
    switch (status && status?.toLowerCase()) {
      case 'success':
        setColor('successColor')
        setIcon(
          <IconByName
            isDisabled
            name='CheckboxCircleLineIcon'
            color='white'
            _icon={{ color: 'white' }}
          />
        )
        break
      case 'warning':
        setColor('warningColor')
        setIcon(<IconByName isDisabled name='HistoryLineIcon' color='black' />)
        break
      case 'danger':
      case 'error':
        setColor('dangerColor')
        setIcon(<IconByName isDisabled name='Forbid2LineIcon' color='white' />)
        break
      case 'info':
        setColor('infoColor')
        setIcon(<IconByName isDisabled name='TimeLineIcon' color='white' />)
        break
      default:
        setColor('infoColor')
        setIcon(<IconByName isDisabled name='TimeLineIcon' color='white' />)
        break
    }
  }, [status])

  return (
    <Button
      {...props}
      rounded='full'
      background={color}
      color='white'
      leftIcon={leftIcon ? leftIcon : icon}
    >
      {children ? children : status}
    </Button>
  )
}
export default React.memo(StatusButton)
