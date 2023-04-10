import { ScrollView } from 'native-base'
import React from 'react'
import { useWindowSize } from './helper'

export default function HeghtWidth({ children, maxW }) {
  const [width, Height] = useWindowSize(maxW)

  return (
    <ScrollView minH={Height} maxH={width} w={width}>
      {children}
    </ScrollView>
  )
}
