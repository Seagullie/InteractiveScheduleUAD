import { createStackNavigator } from "@react-navigation/stack"
import * as React from "react"
import ScheduleEditor from "../screens/TestTabsScreens/ScheduleEditor"
import { View } from "react-native"
import StackHeader from "../components/StackHeader"
import ScheduleClassForm from "../screens/TestTabsScreens/scheduleEditorStack/ScheduleClassForm"
import ScheduleEditorScreen from "../screens/ScheduleEditorScreen"

const Stack = createStackNavigator()

export enum EditorStackRoutes {
  EDITOR = "Editor",
  SCHEDULE_CLASS_FORM = "ScheduleClassForm",
}

export default function EditorStack() {
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
        component={ScheduleEditorScreen}
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
