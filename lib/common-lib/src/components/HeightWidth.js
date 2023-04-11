import { ScrollView } from 'native-base'
import React from 'react'
import { useWindowSize } from './helper'

export default function HeghtWidth1({ children, windowWidth, _scollView }) {
  const [width, Height] = useWindowSize()

  return (
    <ScrollView
      {..._scollView}
      minH={Height}
      maxH={Height}
      w={windowWidth ? windowWidth : width}
    >
      {children}
    </ScrollView>
  )
}
