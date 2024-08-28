import React from "react"
import { CheckBox } from "react-native-elements"
import { View, StyleSheet } from "react-native"
import AppText from "./AppText"
import { palette } from "../../styles/global"

function BlueCircle(filled = true) {
  return (
    <View
      style={{
        width: 15,
        height: 15,
        borderRadius: 10,
        backgroundColor: filled ? palette.navigationBackground : "transparent",
        borderWidth: 1,
        borderColor: !filled ? palette.grayedOut : "transparent",
      }}
    />
  )
}

type Option = {
  title: string
  code_name: string
}

export function RadioButtonGroup({
  options,
  onOptionSelected,
  selectedOptionIndex = 0,
}: {
  options: Option[]
  onOptionSelected: (option: Option) => void
  selectedOptionIndex?: number
}) {
  const [selectedIndex, setIndex] = React.useState(selectedOptionIndex)

  return (
    <View style={{ flexGrow: 0, marginLeft: 20 }}>
      {options.map((option, index) => (
        <CheckBox
          checked={selectedIndex === index}
          onPress={() => setIndex(index) || onOptionSelected(option)}
          checkedIcon={BlueCircle()}
          uncheckedIcon={BlueCircle(false)}
          title={<AppText style={styles.optionTitle}>{option.title}</AppText>}
          containerStyle={styles.checkboxContainer}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  optionTitle: {
    marginLeft: 10,
    fontSize: 14,
  },

  checkboxContainer: {
    backgroundColor: "transparent",
    borderWidth: 0,
    flexGrow: 0,
    marginVertical: 7,
    marginLeft: 0,
    padding: 0,
  },
})
