import { ScrollView } from 'native-base'
import React from 'react'
import { useWindowSize } from './helper'

export default function HeightWidth({ children, windowWidth, _scollView }) {
  const [width, Height] = useWindowSize(windowWidth)

  return (
    <ScrollView minH={Height} maxH={Height} w={width} {..._scollView}>
      {children}
    </ScrollView>
  )
}
