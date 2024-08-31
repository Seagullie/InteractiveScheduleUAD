import React, { useRef } from "react"
import { ActivityIndicator, Text, View, StyleSheet, Image } from "react-native"
import { useNavigation, useNavigationState } from "@react-navigation/native"
import { globalStyles, palette } from "../styles/global"
import { drawerMenuImages } from "../constants/Images"
import { TouchableOpacity } from "react-native-gesture-handler"
import { DrawerRoutes } from "../routes/DrawerRoutes"
import AsyncStorage from "@react-native-async-storage/async-storage"
import NewsLoaderService from "../services/NewsLoaderService/NewsLoaderService"
import { isRunningInExpoGo } from "../utilities/utilities"
import _ from "lodash"
import RouteIcons from "../constants/RouteIcons"
import { YellowCircle } from "./YellowCircle"
import { FontName } from "../constants/Fonts"

// let allIcons = Object.keys(Ionicons.getRawGlyphMap())
// console.log(allIcons)

let shouldDisplayYellowCircle = true

function determineIfShouldDisplayYellowCircle() {
  NewsLoaderService.GetInstance().then(async (instance) => {
    let newestArticleDate = await instance.getNewestArticleDate()
    let lastSeenArticle = await AsyncStorage.getItem("newsChecked")
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

export default function DrawerMenu() {
  const routeNameToIconRef = useRef(RouteIcons)

  const navigation = useNavigation()
  console.log("navigation", navigation)

  const handleNavigationButtonPress = (screenName: DrawerRoutes) => {
    console.log("handlePageLinkPress", screenName)
    // @ts-ignore
    navigation.navigate(screenName)
  }

  // Get all the routes from the navigation state
  let routesContainer = useNavigationState((state) => state)
  //   console.log("routes", routesContainer)

  if (routesContainer && routesContainer.routes) {
    const isRunningInExpoGo_ = isRunningInExpoGo()

    let routes = routesContainer.routes

    let breakpoint = routes.length - 5
    let topRoutes = routes.slice(0, breakpoint)
    let bottomRoutes = routes.slice(breakpoint, routes.length)

    if (!isRunningInExpoGo_) {
      _.remove(bottomRoutes, (route) => route.name == DrawerRoutes.TESTS)
    }

    let currentRouteIndex = routesContainer.index
    let currentRoute = routes[currentRouteIndex]

    // NavigationRoute type isn't exported, thus I have to use typeof here
    const RouteButton = ({ route, index }: { route: typeof currentRoute; index: number }) => {
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
              AsyncStorage.setItem("newsChecked", new Date().toString())
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

    return (
      <View style={styles.drawerContainer}>
        <View>
          <View style={styles.drawerContainerHeader}>
            <Image
              style={{ width: 35, height: 40, marginRight: 15 }}
              source={drawerMenuImages.uad_logo_white_outline}
            />
            <Text style={{ fontSize: 24, fontFamily: FontName.CenturyGothic, color: "white" }}>Розклад</Text>
          </View>
          {topRoutes.map((route, index: number) => {
            return <RouteButton key={index} route={route} index={index} />
          })}
        </View>

        <View style={styles.drawerContainerBottom}>
          {bottomRoutes.map((route, index: number) => {
            return <RouteButton key={index + topRoutes.length} route={route} index={index + topRoutes.length} />
          })}
        </View>
      </View>
    )
  } else {
    return (
      <View style={{ ...styles.drawerContainer, ...globalStyles.centered }}>
        <ActivityIndicator size={"large"} color={palette.navigationBackground} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  pageLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  pageLink: {
    fontSize: 18,
    marginLeft: 10,
    color: "white",
    fontFamily: FontName.CenturyGothic,
  },

  drawerContainer: {
    flex: 1,
    justifyContent: "space-between",

    backgroundColor: "#1C5D8F",
    paddingTop: 35,
    paddingBottom: 25,
  },

  drawerContainerBottom: {},

  activePageLink: {
    // backgroundColor: "lightblue",
    backgroundColor: "rgba(37, 150, 190, 0.7)",
    // opacity: 0.5,
  },

  drawerContainerHeader: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 25,
    paddingBottom: 15,

    paddingHorizontal: 20,

    borderBottomColor: "rgba(0,0,0,0.1)",
    borderBottomWidth: 1,
  },
})
