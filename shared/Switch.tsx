import React, { useState } from "react"
import { View, Switch, StyleSheet } from "react-native"
import { palette } from "../styles/global"

// TODO: find better colors for toggled state

export default function CustomSwitch({
  onValueChange,
  initVal = false,
  disabled = false,
}: {
  initVal?: boolean
  disabled?: boolean
  onValueChange?: (newValue: boolean) => void
}): JSX.Element {
  const [isEnabled, setIsEnabled] = useState(initVal)
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState)

  // disabled = true

  return (
    <Switch
      style={styles.switch}
      trackColor={{ false: "#767577", true: palette.navigationBackground }}
      thumbColor={"#eeeeee"}
      ios_backgroundColor="#3e3e3e"
      onValueChange={(newValue) => {
        if (disabled) return
        toggleSwitch()
        onValueChange && onValueChange(newValue)
      }}
      value={isEnabled}
    />
  )
}

const styles = StyleSheet.create({
  switch: {
    height: 24,
    width: 44,
  },
})
