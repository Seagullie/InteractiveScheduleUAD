// EXTERNAL DEPENDENCIES

import * as SplashScreen from "expo-splash-screen"
console.log("[IMPORTS 1] Imported SplashScreen")
// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

import "react-native-gesture-handler"
import { View } from "react-native"
import React, { useEffect, useState } from "react"

import { NavigationContainer } from "@react-navigation/native"

import { useFonts } from "expo-font"
import * as Font from "expo-font"

import { Entypo, FontAwesome, Ionicons, Octicons } from "@expo/vector-icons"

import { ErrorBoundary } from "react-error-boundary"

import "react-native-url-polyfill/auto"

console.log("[IMPORTS] Imported all external dependencies")

// OWN MODULES

import DrawerMenu from "./components/DrawerMenuComponent/DrawerMenu"
import { DrawerRoutes } from "./routes/DrawerRoutes"

import { Drawer } from "./routes/globalDrawer"
import Header from "./components/Header"

// screens

import ScheduleScreen from "./screens/ScheduleScreen/ScheduleScreen"
import ReglamentScreen from "./screens/ReglamentScreen"
import TeachersScreen from "./screens/TeachersScreen"
import EditorStack from "./routes/EditorStack"
import ContactsStack from "./routes/ContactsStack"
import NewsScreen from "./screens/NewsScreen"
import TestTabs from "./routes/testTabs"
import SettingsScreen from "./screens/SettingsScreen/SettingsScreen"
import AboutScreen from "./screens/AboutScreen"
import QnAScreen from "./screens/QnAScreen"

import { isRunningInBrowser } from "./utilities/utilities"
import { GetAllAppFonts } from "./constants/Fonts"
import { AnalyticsService } from "./services/AnalyticsService/AnalyticsService"
import { showErrorView } from "./components/shared/FailureView"
import { AppStyles } from "./styles/AppStyles"
;("use client")

console.log("[IMPORTS] Imported all internal dependencies")

export default function App() {
  try {
    console.log("Settings up App component")

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

    AnalyticsService.trackEvent("app", { event: "app started" })

    const markdown = (
      <ErrorBoundary fallbackRender={showErrorView}>
        <NavigationContainer>
          <View style={AppStyles.root}>
            <Drawer.Navigator
              screenOptions={{
                header: (props) => <Header navigation={props.navigation} title={props.route.name as DrawerRoutes} />,
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
    return showErrorView(e)
  }
}
