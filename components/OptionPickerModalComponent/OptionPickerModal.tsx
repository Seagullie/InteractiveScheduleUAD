import React, { useEffect } from "react"
import { View, Text, Modal, Pressable, ScrollView, useWindowDimensions } from "react-native"
import { globalStyles, palette } from "../../styles/global"
import { TextInput } from "react-native-gesture-handler"
import { Ionicons } from "@expo/vector-icons"
import AppText from "../shared/AppText"
import { styles } from "./Styles"
import { OptionPickerModalProps } from "./Types"

// TODO: fix modal content overflowing when keyboard is shown
// TODO: refactor onClose to something more understandable

/**
 * Filters options based on search query. Case insensitive.
 */
function FilterOptions(options: string[], searchQuery: string) {
  searchQuery = searchQuery.trim().toLowerCase()

  return options.filter((option) => option.toLowerCase().includes(searchQuery))
}

export default function OptionPickerModal({
  hasSearchBar = true,
  headerText = "",
  isOpen = false,
  displaySeparators = true,
  options: optionsParam,
  selectedOption: selectedOptionParam,
  renderItem,
  onCloseModal: onCloseModalCallback,
  onSelected,
  optionIcon,
  isOptionSelectable = true,
}: OptionPickerModalProps) {
  const { height: windowHeight } = useWindowDimensions()

  const [options, _] = React.useState<string[]>(optionsParam)
  const [searchQuery, setSearchQuery] = React.useState<string>("")

  // filter options if search bar is present
  const filteredOptions = hasSearchBar ? FilterOptions(options, searchQuery) : options

  const [selectedOption, setSelectedOption] = React.useState<string>(selectedOptionParam)

  console.log("selectedOption in schedule picker modal:", selectedOption)

  const closeModal = () => {
    setSearchQuery("")
    onCloseModalCallback()
    console.log("cleared search query and closed schedule picker modal")
  }

  useEffect(() => {
    // return umount callback
    return () => {
      console.log("unmounting schedule picker modal")
      setSearchQuery("")
    }
  }, [])

  return (
    <Modal animationType="fade" transparent={true} style={styles.modal} visible={isOpen}>
      <View style={styles.overlay} />
      <View style={styles.modalContentContainer}>
        <View style={{ width: "100%" }}>
          <Text style={styles.header}>{headerText ?? ""}</Text>
          <View style={[styles.horizontalFlex, styles.searchBarContainer, !hasSearchBar ? globalStyles.noDisplay : {}]}>
            <Ionicons name="search-outline" size={14} style={{ marginHorizontal: 5 }} color={palette.grayedOut} />
            <TextInput style={styles.searchBar} onChangeText={setSearchQuery} placeholder="Пошук групи" />
          </View>
        </View>
        <ScrollView style={{ width: "100%", height: 0.4 * windowHeight }}>
          {filteredOptions.map((option, idx) => (
            <View key={idx}>
              {renderItem ? (
                renderItem(option, idx)
              ) : (
                <Pressable
                  onPress={() => {
                    if (!isOptionSelectable) return

                    setSelectedOption(option)
                    onSelected(option)
                    closeModal()
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      {optionIcon}

                      <AppText style={{ ...styles.option, ...(selectedOption == option ? styles.selectedOption : {}) }}>
                        {option}
                      </AppText>
                    </View>

                    {selectedOption == option ? (
                      <Ionicons style={styles.checkIcon} name="checkmark-outline" color={"#1C5D8FCC"} size={24} />
                    ) : (
                      <View />
                    )}
                  </View>
                </Pressable>
              )}

              {displaySeparators && idx != options.length - 1 ? <View style={styles.separator}></View> : <View />}
            </View>
          ))}
        </ScrollView>

        <Pressable onPress={() => closeModal()}>
          <View style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Закрити</Text>
          </View>
        </Pressable>
      </View>
    </Modal>
  )
}
