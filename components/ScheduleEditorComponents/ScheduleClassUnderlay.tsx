import React from "react"
// import { useSwipeableItemParams } from "react-native-swipeable-item"
import { useSwipeableItemParams } from "../shared/SwipeableItem/SwipeableItem"
import { TouchableOpacity, View, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { globalStyles, palette } from "../../styles/global"

// TODO: hide this component children right when hide animation starts
// TODO: make sure that class start&end block gets completely hidden when main content is shifted to the side

/**
 * Component that is shown when user swipes an item (Class Row) to the left
 */
export default function UnderlayRightSide({
  onDeleteButtonPress: onDeleteButtonPress,
}: {
  onDeleteButtonPress: () => void
}) {
  // @ts-ignore
  const { close } = useSwipeableItemParams()

  return (
    <View style={[globalStyles.row, styles.underlayLeft]}>
      <View>
        <TouchableOpacity
          onPress={(e) => {
            onDeleteButtonPress()
            close()
          }}
        >
          <Ionicons name="trash-outline" size={14} color={palette.grayedOut} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  underlayLeft: {
    flex: 1,
    backgroundColor: palette.ongoingClass,
    justifyContent: "flex-end",
    alignItems: "center",
    marginVertical: 2,
    padding: 10,
    borderRadius: 10,
  },
})
