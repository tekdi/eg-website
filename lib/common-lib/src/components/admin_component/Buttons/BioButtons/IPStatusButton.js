import React from 'react'
import { Button, Stack } from 'native-base'
import IconByName from '../../../IconByName'

const IPStatusButton = ({ children, leftIcon, status, ...props }) => {
  const [color, setColor] = React.useState('')
  const [icon, setIcon] = React.useState()
  React.useEffect(() => {
    switch (status && status?.toLowerCase()) {
      case 'success':
        setColor('PrerakPrerakColor')
        setIcon(<IconByName name='CheckboxCircleLineIcon' color='white' />)
        break
      case 'warning':
        setColor('BioReviewColor')
        setIcon(<IconByName name='HistoryLineIcon' color='white' />)
        break
      case 'danger':
      case 'error':
        setColor('BioRejectColor')
        setIcon(<IconByName name='Forbid2LineIcon' color='white' />)
        break
      case 'info':
        setColor('BioScheduleInterviewColor')
        setIcon(<IconByName name='TimeLineIcon' color='white' />)
        break
      default:
        setColor('BioScheduleInterviewColor')
        setIcon(<IconByName name='TimeLineIcon' color='white' />)
        break
    }
  }, [status])
  console.log(children)
  return (
    <Button
      {...props}
      rounded='full'
      background={color}
      leftIcon={leftIcon ? leftIcon : icon}
    >
      {children ? children : status}
    </Button>
  )
}
export default React.memo(IPStatusButton)
