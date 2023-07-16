import React, { useEffect } from "react"
import { View, Text, StyleSheet, Modal, Pressable, ScrollView, useWindowDimensions } from "react-native"
import { Button, Input } from "react-native-elements"
import { globalStyles, palette } from "../styles/global"
import { TextInput, TouchableOpacity } from "react-native-gesture-handler"
import { Ionicons } from "@expo/vector-icons"
import AppText from "../shared/AppText"

// TODO: fix modal content overflowing when keyboard is shown
// TODO: refactor onClose to something more understandable

export default function OptionPickerModal({
  hasSearchBar = true,
  headerText = "",
  isOpen = false,
  displaySeparators = true,
  initialOptions,
  initialSelectedOption,
  renderItem,
  closeModal: closeModalCallback,
  onSelected,
  optionIcon,
  isOptionSelectable = true,
}: {
  hasSearchBar?: boolean
  headerText?: string
  isOpen: boolean
  displaySeparators?: boolean
  initialOptions: string[]
  initialSelectedOption: string
  renderItem?: (option: string, idx: number) => JSX.Element
  closeModal: () => void
  onSelected: (option: string) => void
  optionIcon?: JSX.Element
  isOptionSelectable?: boolean
}) {
  const { height, width } = useWindowDimensions()

  const [options, setOptions] = React.useState<string[]>(initialOptions)
  const [searchQuery, setSearchQuery] = React.useState<string>("")

  const filteredOptions = hasSearchBar
    ? options.filter((option) => JSON.stringify(option).toLowerCase().includes(searchQuery.toLowerCase()))
    : options

  const [selectedOption, setSelectedOption] = React.useState<string>(initialSelectedOption)

  console.log("selectedOption in schedule picker modal:", selectedOption)

  const closeModal = () => {
    setSearchQuery("")
    closeModalCallback()
    console.log("cleared search query and closed schedule picker modal")
  }

  useEffect(() => {
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
        <ScrollView style={{ width: "100%", height: 0.4 * height }}>
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

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red", // not gonna work cause it's transparent
  },

  horizontalFlex: {
    flexDirection: "row",
    alignItems: "center",
  },

  searchBarContainer: {
    marginLeft: -4,
    marginVertical: 10,
    backgroundColor: "#F2F2F2",
    borderRadius: 7,
    padding: 5,
    paddingVertical: 2,
  },

  searchBar: {
    fontSize: 12,
    flex: 1,
    fontFamily: "montserrat-500",
  },

  modalContentContainer: {
    ...globalStyles.modalContentContainer,
    top: "5%",
  },

  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },

  option: {
    fontFamily: "montserrat-500",
    color: palette.text,
    width: "100%",
    marginVertical: 10,
  },

  selectedOption: {
    fontFamily: "montserrat-600",
  },

  separator: {
    height: 1, // haha
    width: "100%",
    marginVertical: 6,
    backgroundColor: "#E6E6E6",
  },

  header: {
    fontFamily: "montserrat-bold",
    fontSize: 20,
    marginBottom: 10,
    color: palette.text,
  },

  closeButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E6E6E6",
    padding: 10,
    paddingHorizontal: 30,
    marginTop: 10,
    // borderRadius: 10,

    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    elevation: 0.2,
    shadowOpacity: 0.0,
    shadowRadius: 0,
    borderRadius: 10,
  },

  closeButtonText: {
    fontFamily: "montserrat-600",
    color: palette.grayedOut,
    fontSize: 16,
  },

  checkIcon: {
    position: "absolute",
    right: 0,
  },
})
