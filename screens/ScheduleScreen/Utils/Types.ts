import { ScrollView } from "react-native"

export interface OnLayoutChangeParams {
  dataSourceCoords: number[]
  scrollViewContainerRef: React.RefObject<ScrollView>
}
