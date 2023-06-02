import * as React from "react"

import { createStackNavigator } from "@react-navigation/stack"
import FacultiesTestScreen from "../screens/TestTabsScreens/FacultiesTestScreen"
import ContactsModalTestScreen from "../screens/TestTabsScreens/ContactsModalsTestScreen"
import { View } from "react-native"
import { ContactsStackRoutes } from "./ContactsStackRoutes"
import StackHeader from "../components/StackHeader"

const Stack = createStackNavigator()

export default function ContactsTestStack() {
  return (
    <Stack.Navigator
      screenOptions={
        {
          // headerShown: false,
        }
      }
    >
      <Stack.Screen
        name={ContactsStackRoutes.CONTACTS_MENU}
        component={ContactsModalTestScreen}
        options={{
          header: () => <View />,
        }}
      />
      <Stack.Screen
        name={ContactsStackRoutes.FACULTIES}
        component={FacultiesTestScreen}
        options={{
          header: (props) => <StackHeader title={"Факультети академії"} />,
        }}
      />
    </Stack.Navigator>
  )
}
