import React, { useRef } from "react"
import { ActivityIndicator, Text, View, Pressable, StyleSheet, Image } from "react-native"
import { FontAwesome5, Ionicons } from "@expo/vector-icons"
import { useNavigation, useNavigationState } from "@react-navigation/native"
import { drawerMenuImages, globalStyles, palette } from "../styles/global"
import { TouchableOpacity } from "react-native-gesture-handler"
import SingleSidedShadowBox from "../shared/SingleSidedShadowBox"
import { DrawerRoutes } from "../routes/DrawerRoutes"
import useEffect from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import NewsLoaderService from "../services/NewsLoaderService"
import { isRunningInExpoGo } from "../utilities/utilities"
import _ from "lodash"

// let allIcons = Object.keys(Ionicons.getRawGlyphMap())
// console.log(allIcons)

let shouldDisplayYellowCircle = true
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

function YellowCircle({ filled = true }: { filled?: boolean }) {
  return (
    <View
      style={{
        marginLeft: 10,
        marginTop: 5,

        alignSelf: "flex-start",

        width: 5,
        height: 5,
        borderRadius: 10,
        backgroundColor: filled ? "#FFE600" : "transparent",
        borderWidth: 1,
        borderColor: !filled ? palette.grayedOut : "transparent",
      }}
    />
  )
}

export default function DrawerMenu() {
  const routeNameToIconRef = useRef({
    [DrawerRoutes.VIEWER]: <Ionicons name="calendar" color={"white"} size={18} />,
    [DrawerRoutes.REGLAMENT]: <Ionicons name="time-sharp" color={"white"} size={18} />,
    [DrawerRoutes.TEACHERS]: <FontAwesome5 name="user-graduate" color={"white"} size={18} />,
    [DrawerRoutes.CONTACTS]: <Ionicons name="call" color={"white"} size={18} />,
    [DrawerRoutes.NEWS]: <Ionicons name="chatbox-ellipses" color={"white"} size={18} />,

    [DrawerRoutes.TESTS]: <Ionicons name="flask" color={"white"} size={18} />,
    [DrawerRoutes.EDITOR]: <Ionicons name="options" color={"white"} size={18} />,
    [DrawerRoutes.SETTINGS]: <FontAwesome5 name="cog" color={"white"} size={18} />,
    [DrawerRoutes.ABOUT]: <Ionicons name="information-circle" color={"white"} size={18} />,
  })

  const navigation = useNavigation()

  const handlePageLinkPress = (pageName: string) => {
    console.log("handlePageLinkPress", pageName)
    navigation.navigate(pageName)
  }

  // Get all the routes from the navigation state
  let routesContainer = useNavigationState((state) => state)
  //   console.log("routes", routesContainer)

  if (routesContainer && routesContainer.routes) {
    const isRunningInExpoGo_ = isRunningInExpoGo()

    let routes = routesContainer.routes

    let breakpoint = routes.length - 4
    let topRoutes = routes.slice(0, breakpoint)
    let bottomRoutes = routes.slice(breakpoint, routes.length)
    if (!isRunningInExpoGo_) {
      _.remove(bottomRoutes, (route) => route.name == DrawerRoutes.TESTS)
    }

    let currentRouteIndex = routesContainer.index
    let currentRoute = routes[currentRouteIndex]

    // NavigationRoute type isn't exported, thus I have to use typeof here
    const RouteButton = ({ route, index }: { route: typeof currentRoute; index: number }) => {
      const isCurrentRoute = route.name == currentRoute.name
      const isNewsRoute = route.name == DrawerRoutes.NEWS

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

            handlePageLinkPress(route.name)
          }}
        >
          <View
            style={{
              ...styles.pageLinkContainer,
              ...(isCurrentRoute ? styles.activePageLink : {}),
            }}
          >
            {routeNameToIconRef.current[route.name]}
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
            <Text style={{ fontSize: 24, fontFamily: "century-gothic", color: "white" }}>Розклад</Text>
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
    fontFamily: "century-gothic",
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
    backgroundColor: "lightblue",
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
