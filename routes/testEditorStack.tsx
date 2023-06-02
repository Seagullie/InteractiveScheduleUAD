import { createStackNavigator } from "@react-navigation/stack"
import * as React from "react"
import ScheduleEditor from "../screens/TestTabsScreens/ScheduleEditor"
import { View } from "react-native"
import StackHeader from "../components/StackHeader"
import ScheduleClassForm from "../screens/TestTabsScreens/scheduleEditorStack/ScheduleClassForm"
import { EditorStackRoutes } from "./EditorStackRoutes"

const Stack = createStackNavigator()

export default function TestEditorStack() {
  return (
    <Stack.Navigator
      screenOptions={
        {
          // headerShown: false,
        }
      }
    >
      <Stack.Screen
        name={EditorStackRoutes.EDITOR}
        component={ScheduleEditor}
        options={{
          header: () => <View />,
        }}
      />
      <Stack.Screen
        name={EditorStackRoutes.SCHEDULE_CLASS_FORM}
        component={ScheduleClassForm}
        options={{
          header: (props) => <StackHeader title={"Пара"} />,
        }}
      />
    </Stack.Navigator>
  )
}
