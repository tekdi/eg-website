import { ScrollView } from 'native-base'
import React from 'react'
import { useWindowSize } from './helper'
import PropTypes from 'prop-types'

export default function HeightWidth({ children, windowWidth, _scollView }) {
  const [width, Height] = useWindowSize(windowWidth)

  return (
    <ScrollView minH={Height} maxH={Height} w={width} {..._scollView}>
      {children}
    </ScrollView>
  )
}

HeightWidth.propTypes = {
  children: PropTypes.any,
  windowWidth: PropTypes.any,
  _scollView: PropTypes.any
}
