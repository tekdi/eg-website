import { Box } from 'native-base'
import React, { useEffect, useState } from 'react'
import { t } from 'i18next'
import PropTypes from 'prop-types'

export default function Chip({ label, children, isActive, ...props }) {
  return (
    <Box
      bg={isActive ? 'primary.500' : 'primary.100'}
      _text={{
        color: isActive ? 'white' : 'black'
      }}
      rounded={'full'}
      py='1'
      px='2'
      // m='1'
      {...props}
    >
      {children ? children : label}
    </Box>
  )
}
Chip.propTypes = {
  label: PropTypes.string,
  children: PropTypes.any,
  isActive: PropTypes.bool
}

// ChipStatus
export function ChipStatus({ status, ...props }) {
  const [color, setColor] = useState('textGreyColor.800')
  const [newStatus, setNewStatus] = useState(status)

  useEffect(() => {
    switch (status && String(status)?.toLowerCase()) {
      case 'application_screened':
      case 'screened':
        setColor('screenedColor')
        setNewStatus(t('SCREENED'))
        break
      case 'rejected':
        setNewStatus(t('REJECTED'))
        setColor('rejected')
        break
      case 'shortlisted_for_orientation':
        setNewStatus(t('SHORTLISTED_FOR_ORIENTATION'))
        setColor('shortlistedColor')
        break
      case 'pragati_mobilizer':
        setNewStatus(t('PRAGATI_MOBILIZER'))
        setColor('potentialColor')
        break
      case 'selected_for_training':
        setNewStatus(t('SELECTED_FOR_TRAINING'))
        setColor('selectedColor')
        break
      case 'selected_for_onboarding':
        setNewStatus(t('SELECTED_FOR_ONBOARDING'))
        setColor('selectedColor')
        break
      case 'selected_prerak':
        setNewStatus(t('SELECTED_PRERAK'))
        setColor('selectedColor')
        break
      case 'quit':
        setNewStatus(t('QUIT'))
        setColor('rejectedColor')
        break
      case 'rusticate':
        setNewStatus(t('RUSTICATE'))
        setColor('selectedColor')
        break
      case 'approved':
        setColor('potentialColor')
        setNewStatus(t('APPROVED'))
        break
      default:
        setNewStatus(t('APPLIED'))
        setColor('appliedColor')
    }
  }, [status])

  return (
    <Chip
      px='4'
      bg={color}
      label={newStatus}
      _text={{
        textTransform: 'capitalize',
        fontSize: '12px',
        lineHeight: '20px',
        fontWeight: '400',
        textAlign: 'center',
        letterSpacing: '0.1px'
      }}
      rounded='sm'
      {...props}
    />
  )
}

ChipStatus.propTypes = {
  status: PropTypes.string
}
