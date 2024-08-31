// EXTERNAL DEPENDENCIES

import React, { useRef } from "react"
import { ActivityIndicator, Text, View, Image } from "react-native"
import { useNavigation, useNavigationState } from "@react-navigation/native"
import { TouchableOpacity } from "react-native-gesture-handler"
import AsyncStorage from "@react-native-async-storage/async-storage"
import _ from "lodash"

// INTERNAL DEPENDENCIES

import { globalStyles, palette } from "../../styles/global"
import { drawerMenuImages } from "../../constants/Images"
import { DrawerRoutes } from "../../routes/DrawerRoutes"
import NewsLoaderService from "../../services/NewsLoaderService/NewsLoaderService"
import { isRunningInExpoGo } from "../../utilities/utilities"
import RouteIcons from "../../constants/RouteIcons"
import { YellowCircle } from "../YellowCircle"
import { FontName } from "../../constants/Fonts"
import { styles } from "./Styles"
import { ASYNC_STORAGE_KEY_NEWS_CHECKED_DATE } from "../../services/NewsLoaderService/Constants"

// let allIcons = Object.keys(Ionicons.getRawGlyphMap())
// console.log(allIcons)

let shouldDisplayYellowCircle = true

// yellow circle is displayed if there are new news
function determineIfShouldDisplayYellowCircle() {
  NewsLoaderService.GetInstance().then(async (instance) => {
    let newestArticleDate = await instance.getNewestArticleDate()
    let lastSeenArticle = await AsyncStorage.getItem(ASYNC_STORAGE_KEY_NEWS_CHECKED_DATE)
    let lastSeenArticleDate = lastSeenArticle ? new Date(lastSeenArticle) : null

    console.log("newestArticleDate", newestArticleDate)
    console.log("lastSeenArticleDate", lastSeenArticleDate)

    if (!lastSeenArticleDate || newestArticleDate.getTime() > lastSeenArticleDate.getTime()) {
      shouldDisplayYellowCircle = true
    } else {
      shouldDisplayYellowCircle = false
    }

    console.log("shouldDisplayYellowCircle: ", shouldDisplayYellowCircle)
  })
}
determineIfShouldDisplayYellowCircle()

// TODO: do something with types on function signature hover
/**
 * Creates RouteButton with additional parameters in its definition scope for it to memorize
 */
function RouteButtonFactory(
  currentRoute: { name: string },
  // handleNavigationButtonPress: (screenName: DrawerRoutes) => void,
  routeNameToIconRef: React.MutableRefObject<typeof RouteIcons>
) {
  const RouteButton = ({ route, index }: { route: typeof currentRoute; index: number }) => {
    const navigation = useNavigation()
    console.log("navigation", navigation)

    // handler for onPress of navigation button
    const handleNavigationButtonPress = (screenName: DrawerRoutes) => {
      console.log("handlePageLinkPress", screenName)
      // @ts-ignore (signature of .navigate doesn't make sense)
      navigation.navigate(screenName)
    }

    const routeName = route.name as DrawerRoutes

    const isCurrentRoute = routeName == currentRoute.name
    const isNewsRoute = routeName == DrawerRoutes.NEWS

    const yellowCircle =
      shouldDisplayYellowCircle && isNewsRoute ? <YellowCircle /> : <View style={globalStyles.noDisplay} />

    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          if (isNewsRoute) {
            shouldDisplayYellowCircle = false
            AsyncStorage.setItem(ASYNC_STORAGE_KEY_NEWS_CHECKED_DATE, new Date().toString())
          }

          handleNavigationButtonPress(routeName)
        }}
      >
        <View
          style={{
            ...styles.pageLinkContainer,
            ...(isCurrentRoute ? styles.activePageLink : {}),
          }}
        >
          {routeNameToIconRef.current[routeName]}
          <Text style={styles.pageLink}>{route.name}</Text>
          {yellowCircle}
        </View>
      </TouchableOpacity>
    )
  }

  return RouteButton
}

export default function DrawerMenu() {
  // Get mapping of route names to icons
  const routeNameToIconRef = useRef(RouteIcons)

  // Get all routes from the navigation state
  let routesContainer = useNavigationState((state) => state)
  //   console.log("routes", routesContainer)

  if (routesContainer && routesContainer.routes) {
    const isRunningInExpoGo_ = isRunningInExpoGo()

    let routes = routesContainer.routes

    // Split routes by breakpoint into top and bottom parts
    let breakpoint = routes.length - 5
    let topRoutes = routes.slice(0, breakpoint)
    let bottomRoutes = routes.slice(breakpoint, routes.length)

    // Remove tests route if app is running outside Expo Go
    if (!isRunningInExpoGo_) {
      _.remove(bottomRoutes, (route) => route.name == DrawerRoutes.TESTS)
    }

    // get current route
    let currentRouteIndex = routesContainer.index
    let currentRoute = routes[currentRouteIndex]

    // create RouteButton component
    const RouteButton = RouteButtonFactory(currentRoute, routeNameToIconRef)

    return (
      <View style={styles.drawerContainer}>
        <View>
          <View style={styles.drawerContainerHeader}>
            <Image
              style={{ width: 35, height: 40, marginRight: 15 }}
              source={drawerMenuImages.uad_logo_white_outline}
            />
            {/* caption at the very top of the drawer */}
            <Text style={{ fontSize: 24, fontFamily: FontName.CenturyGothic, color: "white" }}>Розклад</Text>
          </View>
          {/* render top routes */}
          {topRoutes.map((route, index: number) => {
            return <RouteButton key={index} route={route} index={index} />
          })}
        </View>

        {/* render bottom routes */}
        <View style={styles.drawerContainerBottom}>
          {bottomRoutes.map((route, index: number) => {
            return <RouteButton key={index + topRoutes.length} route={route} index={index + topRoutes.length} />
          })}
        </View>
      </View>
    )
  } else {
    // otherwise return spinner
    return (
      <View style={{ ...styles.drawerContainer, ...globalStyles.centered }}>
        <ActivityIndicator size={"large"} color={palette.navigationBackground} />
      </View>
    )
  }
}
