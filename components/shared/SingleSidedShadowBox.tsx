import React from "react"
import { View, StyleSheet, ViewPropTypes } from "react-native"
import PropTypes from "prop-types"

const SingleSidedShadowBox = ({ children, style }) => <View style={[styles.container, style]}>{children}</View>

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    paddingBottom: 5,
  },
})

SingleSidedShadowBox.propTypes = {
  children: PropTypes.element,
  style: ViewPropTypes.style,
}

export default SingleSidedShadowBox
