import React, { useEffect, useState } from "react"

import { View, Button, StyleSheet, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native"
import { palette, globalStyles, previewImages } from "../../styles/global"
import AppText from "../../shared/AppText"

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"

import _ from "lodash"
import { setStatusBarHidden } from "expo-status-bar"
import OptionPickerModal from "../../components/OptionPickerModal"
import { DrawerRoutes } from "../../routes/DrawerRoutes"
import SettingsService from "../../services/SettingsService"
import { ensureExtension, ensureNoExtension } from "../../utilities/utilities"
import { useNavigation } from "@react-navigation/native"
import ScheduleLoaderService from "../../services/ScheduleLoaderService"
import { getPageFour, getPageOne, getPageThree, getPageTwo } from "./Pages"

// TODO: move shared logic to a separate file. As of now, lots if it is a copypaste from IntroductoryCarousel.native.tsx
// TODO: fix navigation falling out of viewport on firefox

export default function InroductoryCarouselScreen({ onClose }: { onClose?: () => void }) {
  const [currentPage, setCurrentPage] = React.useState(0)
  let [isVisible, setIsVisible] = useState(true)
  let [isReady, setIsReady] = useState(false)

  let [schedulePickerModalVisible, setSchedulePickerModalVisible] = useState(false)

  let [schedulePickerData, setSchedulePickerData] = useState<string[]>([])

  const navigation = useNavigation()

  const lastPageIndex = 3

  useEffect(() => {
    async function init() {
      let scheduleLodaderInstance = await ScheduleLoaderService.GetInstance()

      let schedulePickerData = scheduleLodaderInstance.scheduleFiles.map((f) => ensureNoExtension(f.filename, ".json"))
      setSchedulePickerData(schedulePickerData)

      setIsReady(true)
    }

    init()
  }, [])

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={palette.navigationBackground} />
      </View>
    )
  }

  return (
    <View style={{ ...styles.overlay }}>
      <View style={styles.paginationCircles}>
        {_.times(lastPageIndex + 1, (i) => (
          <View key={i} style={[styles.circle, currentPage == i ? styles.circleActive : {}]} />
        ))}
      </View>

      <Swiper
        style={{ display: "flex", width: "95%", flex: 1 }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={(swiper) => {
          setCurrentPage(swiper.activeIndex)
        }}
      >
        {getPageOne()}
        {getPageTwo()}

        {getPageThree()}
        {getPageFour()}
      </Swiper>
      {currentPage == 0 ? (
        <View style={[styles.pagerNavigation, { justifyContent: "center" }]}>
          <TouchableOpacity
            style={[styles.navigationButton, { width: 150 }]}
            onPress={() => {
              setSchedulePickerModalVisible(true)
            }}
          >
            <AppText
              accessibilityLabel="selectSchedule"
              style={{ color: palette.navigationBackground, fontFamily: "montserrat-600" }}
            >
              Обрати розклад
            </AppText>
          </TouchableOpacity>
          <OptionPickerModal
            headerText="Вибери свою групу"
            isOpen={schedulePickerModalVisible}
            initialOptions={schedulePickerData}
            initialSelectedOption={""}
            closeModal={() => setSchedulePickerModalVisible(false)}
            onSelected={(selected) => {
              SettingsService.GetInstance().then((i) => {
                i.currentScheduleName = ensureExtension(selected, ".json")
                i.saveToStorage()

                let newCurrentPage = _.clamp(currentPage + 1, 0, lastPageIndex)
                setCurrentPage(newCurrentPage)
              })
            }}
          />
        </View>
      ) : (
        <View style={styles.pagerNavigation}>
          <TouchableOpacity
            style={[styles.navigationButton, styles.backButton]}
            onPress={() => {
              let newCurrentPage = _.clamp(currentPage - 1, 0, 999)

              setCurrentPage(newCurrentPage)
            }}
          >
            <AppText
              style={{ color: palette.navigationBackground, fontFamily: "montserrat-600", color: palette.grayedOut }}
            >
              Назад
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={() => {
              let isCloseButton = currentPage == lastPageIndex

              if (isCloseButton) {
                setStatusBarHidden(false, "fade")
                setIsVisible(false)
                onClose?.()
                navigation.navigate(DrawerRoutes.VIEWER)
              }

              let newCurrentPage = _.clamp(currentPage + 1, 0, lastPageIndex)
              setCurrentPage(newCurrentPage)
            }}
          >
            <AppText style={{ color: palette.navigationBackground, fontFamily: "montserrat-600" }}>
              {currentPage != lastPageIndex ? "Далі" : "Закрити"}
            </AppText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  carouselContainer: {
    backgroundColor: "#F5F5F5",
    // backgroundColor: "red",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    flex: 1,
    zIndex: 9999,

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  container: {
    flex: 1,
    height: "100%",
  },

  viewPager: {
    flex: 1,
    padding: 0,
    marginHorizontal: 30,
  },
  page: {
    // height: "100%",
    flex: 1,
    alignItems: "center",
  },

  paginationCircles: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,

    width: "100%",
  },

  circle: {
    width: 5,
    height: 5,
    margin: 5,
    borderRadius: 123,
    backgroundColor: "#D9D9D9",
    flexDirection: "row",
  },

  circleActive: {
    backgroundColor: "#7B7B7B",
  },

  pageBody: {
    marginBottom: 20,
    // flex: 1,
    // height: "100%",
  },

  overlay: {
    backgroundColor: "#F5F5F5",
    // backgroundColor: "red",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    flex: 1,
    zIndex: 9998,
  },

  pagerNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignSelf: "center",
    width: "95%",
  },

  pageTitle: {
    fontSize: 24,
    color: palette.navigationBackground,
    textAlign: "center",
    marginVertical: 10,
    marginTop: 20,
  },

  imageContainer: {
    borderRadius: 10,
    height: "65%",
    maxHeight: "65%",
    width: "90%",
    // backgroundColor: "green",

    overflow: "auto",

    // borderColor: palette.navigationBackground,
    // borderWidth: 1,
    // borderColor: palette.grayishBlue,

    // elevation: 0,
    // shadowOffset: { width: 1, height: 1 },
    // shadowColor: palette.navigationBackground,
    // shadowOpacity: 0.3,
    // shadowRadius: 2,

    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "row",
  },

  previewImage: {
    borderRadius: 10,
    // borderColor: palette.backgroundLight,

    // backgroundColor: palette.navigationBackground,

    // height: "100%",
    // width: "100%",

    // resizeMode: "cover" is the default
    // resizeMode: "contain",

    // alignSelf: "flex-start",
    // alignItems: "flex-start",
    // justifyContent: "flex-start",

    // flexDirection: "column",
  },

  halfImageContainer: {
    height: "30%",
  },

  navigationButton: {
    ...globalStyles.navigationButton,
  },

  backButton: {
    borderColor: palette.grayedOut,
  },

  forwardButton: {
    borderColor: palette.navigationBackground,
    borderWidth: 1,
  },

  centeredDescriptionText: {
    textAlign: "center",
  },

  pageDescriptionText: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
})
