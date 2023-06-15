import * as SplashScreen from "expo-splash-screen"
// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

import "react-native-gesture-handler"
import { Text, View } from "react-native"
import React, { useEffect, useState } from "react"

import { NavigationContainer } from "@react-navigation/native"
import SettingsScreen from "./screens/SettingsScreen"

import { useFonts } from "expo-font"
import { Drawer } from "./routes/globalDrawer"
import AboutScreen from "./screens/AboutScreen"
import Header from "./components/Header"
import ReglamentScreen from "./screens/ReglamentScreen"
import ScheduleScreen from "./screens/ScheduleScreen"

import { ErrorBoundary } from "react-error-boundary"
import { ScrollView } from "react-native-gesture-handler"
import DrawerMenu from "./components/DrawerMenu"
import TeachersScreen from "./screens/TeachersScreen"
import ScheduleEditorScreen from "./screens/ScheduleEditorScreen"
import EditorStack from "./routes/EditorStack"
import { DrawerRoutes } from "./routes/DrawerRoutes"
import ContactsScreen from "./screens/ContactsScreen"
import ContactsTestStack from "./routes/ContactsTestStack"
import ContactsStack from "./routes/ContactsStack"
import NewsScreen from "./screens/NewsScreen"
;import TestTabs from "./routes/testTabs"
("use client")

function fallbackRender({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <ScrollView>
      <Text>Something went wrong:</Text>
      <Text style={{ color: "red" }}>{JSON.stringify(error.message)}</Text>
      <Text style={{ color: "red" }}>{JSON.stringify(error.stack)}</Text>
    </ScrollView>
  )
}

export default function App() {
  try {
    const [appIsReady, setAppIsReady] = useState(false)

    const [fontsLoaded] = useFonts({
      "lato-regular": require("./assets/fonts/Lato-Regular.ttf"),
      "lato-bold": require("./assets/fonts/Lato-Bold.ttf"),
      "cinzel-regular": require("./assets/fonts/CinzelDecorative-Regular.ttf"),

      "montserrat-regular": require("./assets/fonts/Montserrat-Regular.ttf"),
      "montserrat-medium": require("./assets/fonts/Montserrat-Medium.ttf"),
      "montserrat-semibold": require("./assets/fonts/Montserrat-SemiBold.ttf"),

      "raleway-regular": require("./assets/fonts/Raleway-Regular.ttf"),

      "montserrat-500": require("./assets/fonts/Montserrat-Medium.ttf"),
      "montserrat-600": require("./assets/fonts/Montserrat-SemiBold.ttf"),

      "montserrat-bold": require("./assets/fonts/Montserrat-Bold.ttf"),
      "raleway-500": require("./assets/fonts/Raleway-Regular.ttf"),
      "raleway-600": require("./assets/fonts/Raleway-Medium.ttf"),

      "century-gothic": require("./assets/fonts/CenturyGothic.ttf"),
      "century-gothic-bold": require("./assets/fonts/GOTHICB.ttf"),
      "century-gothic-italic": require("./assets/fonts/GOTHICI.ttf"),
    })

    useEffect(() => {
      if (fontsLoaded) {
        SplashScreen.hideAsync().then(() => setAppIsReady(true))
      }
    }, [fontsLoaded])

    if (!appIsReady) {
      return null
    }

    const markdown = (
      <ErrorBoundary fallbackRender={fallbackRender}>
        <NavigationContainer>
          <Drawer.Navigator
            screenOptions={{
              header: (props) => <Header navigation={props.navigation} title={props.route.name} />,
            }}
            drawerContent={(props) => <DrawerMenu {...props} />}
          >
            <Drawer.Screen
              name={DrawerRoutes.VIEWER}
              component={ScheduleScreen}
              options={{
                header: (props) => <View />,
              }}
            />
            <Drawer.Screen name={DrawerRoutes.REGLAMENT} component={ReglamentScreen} />
            <Drawer.Screen name={DrawerRoutes.TEACHERS} component={TeachersScreen} />
            <Drawer.Screen name={DrawerRoutes.CONTACTS} component={ContactsStack} />
            <Drawer.Screen name={DrawerRoutes.NEWS} component={NewsScreen} />

            <Drawer.Screen
              name={DrawerRoutes.TESTS}
              component={TestTabs}
              options={{
                header: (props) => <View />,
              }}
            />
            <Drawer.Screen
              name={DrawerRoutes.EDITOR}
              options={{
                header: (props) => <View />,
              }}
              component={EditorStack}
            />
            <Drawer.Screen name={DrawerRoutes.SETTINGS} component={SettingsScreen} />
            <Drawer.Screen name={DrawerRoutes.ABOUT} component={AboutScreen} />
          </Drawer.Navigator>
        </NavigationContainer>
      </ErrorBoundary>
    )

    return markdown
  } catch (e) {
    console.log(e)
    return (
      <ScrollView>
        <Text>
          Something went wrong. Something went wrong. Something went wrong. Something went wrong. Something went wrong.
          Something went wrong.
        </Text>
        <Text>
          Something went wrong. Something went wrong. Something went wrong. Something went wrong. Something went wrong.
          Something went wrong.
        </Text>
        <Text>
          Something went wrong. Something went wrong. Something went wrong. Something went wrong. Something went wrong.
          Something went wrong.
        </Text>
        <Text>
          {JSON.stringify(e.message, null, 4)}
          {JSON.stringify(e.stack, null, 4)}
        </Text>
      </ScrollView>
    )
  }
}
