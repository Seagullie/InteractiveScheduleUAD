import React, { useState } from "react"
import { View, Switch, StyleSheet } from "react-native"
import { palette } from "../styles/global"
import { isRunningInBrowser } from "../utilities/utilities"

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
      // thumbColor={"#eeeeee"}
      thumbColor="#eeeeee"
      activeThumbColor="#eeeeee" // this prop is added and used by  react-native-web
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
    // react-native-web sets min width to half of height
    height: isRunningInBrowser() ? 20 : 24,
    width: 44,
  },
})
