import * as React from "react"

import { createStackNavigator } from "@react-navigation/stack"
import FacultiesTestScreen from "../screens/TestTabsScreens/FacultiesTestScreen"
import { View } from "react-native"
import { ContactsStackRoutes } from "./ContactsStackRoutes"
import StackHeader from "../components/StackHeader"
import ContactsScreen from "../screens/ContactsScreen/ContactsScreen"
import { palette } from "../styles/global"

const Stack = createStackNavigator()

export default function ContactsStack() {
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
        component={ContactsScreen}
        options={{
          header: () => <View />,
        }}
      />
      <Stack.Screen
        name={ContactsStackRoutes.FACULTIES}
        component={FacultiesTestScreen}
        options={{
          header: (props) => (
            <StackHeader
              title={"Факультети академії"}
              useSafeAreaView={false}
              hasBackground={false}
              captionStyles={{ color: palette.text, fontFamily: "montserrat-bold", fontSize: 20 }}
            />
          ),
        }}
      />
    </Stack.Navigator>
  )
}
