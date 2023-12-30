import * as SplashScreen from "expo-splash-screen"
// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

import "react-native-gesture-handler"
import { Text, View, StyleSheet } from "react-native"
import React, { useEffect, useState } from "react"

import { NavigationContainer } from "@react-navigation/native"

import { useFonts } from "expo-font"
import * as Font from "expo-font"

import { Drawer } from "./routes/globalDrawer"
import Header from "./components/Header"

import { ErrorBoundary } from "react-error-boundary"
import { ScrollView } from "react-native-gesture-handler"
import DrawerMenu from "./components/DrawerMenu"
import { DrawerRoutes } from "./routes/DrawerRoutes"

// screens

import ScheduleScreen from "./screens/ScheduleScreen"
import ReglamentScreen from "./screens/ReglamentScreen"
import TeachersScreen from "./screens/TeachersScreen"
import EditorStack from "./routes/EditorStack"
import ContactsStack from "./routes/ContactsStack"
import NewsScreen from "./screens/NewsScreen"
import TestTabs from "./routes/testTabs"
import SettingsScreen from "./screens/SettingsScreen"
import AboutScreen from "./screens/AboutScreen"
import { isLandscapeWeb, isRunningInBrowser } from "./utilities/utilities"
import { Entypo, FontAwesome, Ionicons, Octicons } from "@expo/vector-icons"
import QnAScreen from "./screens/QnAScreen"
;("use client")

import "react-native-url-polyfill/auto"
import Aptabase, { trackEvent } from "@aptabase/react-native"
import { AptabaseAppKey } from "./constants/Keys"
import { GetAllAppFonts } from "./constants/Fonts"

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
    // init analytics
    Aptabase.init(AptabaseAppKey)

    const [appIsReady, setAppIsReady] = useState(false)

    const [fontsLoaded] = useFonts(GetAllAppFonts())

    // preload icons to prevent text flicker effect on navigating to another page
    if (isRunningInBrowser()) {
      Font.loadAsync(FontAwesome.font)
      Font.loadAsync(Entypo.font)
      Font.loadAsync(Ionicons.font)
      Font.loadAsync(Octicons.font)
    }

    useEffect(() => {
      if (fontsLoaded) {
        SplashScreen.hideAsync().then(() => setAppIsReady(true))
      }
    }, [fontsLoaded])

    if (!appIsReady) {
      return null
    }

    trackEvent("app", { event: "app started" })

    const markdown = (
      <ErrorBoundary fallbackRender={fallbackRender}>
        <NavigationContainer>
          <View style={styles.root}>
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

              <Drawer.Screen name={DrawerRoutes.QnA} component={QnAScreen} />

              <Drawer.Screen
                name={DrawerRoutes.EDITOR}
                options={{
                  header: (props) => <View />,
                }}
                component={EditorStack}
              />

              <Drawer.Screen
                name={DrawerRoutes.TESTS}
                component={TestTabs}
                options={{
                  header: (props) => <View />,
                }}
              />

              <Drawer.Screen name={DrawerRoutes.SETTINGS} component={SettingsScreen} />

              <Drawer.Screen name={DrawerRoutes.ABOUT} component={AboutScreen} />
            </Drawer.Navigator>
          </View>
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

const drawerMenuWidthPx = 320

const landscapeWebStyles = StyleSheet.create({
  root: {
    width: "50%",
    minWidth: "50%",
    maxWidth: "50%",

    maxHeight: "100%",

    flexGrow: 1,
    marginLeft: "33%", // free space divided by two and + drawerMenuWidthPx in % * 0.5
    // TODO: unhardcode the percentage
  },
})

const nativeStyles = StyleSheet.create({
  root: {
    width: "100%",
    flex: 1,
  },
})

const styles = isLandscapeWeb() ? landscapeWebStyles : nativeStyles
