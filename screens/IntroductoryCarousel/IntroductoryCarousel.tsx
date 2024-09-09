import React, { useEffect, useRef, useState } from "react"

import { View, TouchableOpacity, ActivityIndicator, DimensionValue } from "react-native"
import { palette } from "../../styles/global"
import AppText from "../../components/shared/AppText"

// Import Swiper React components
import { Swiper } from "swiper/react"

// Import Swiper styles
import "swiper/css"

import _ from "lodash"
import { setStatusBarHidden } from "expo-status-bar"
import OptionPickerModal from "../../components/OptionPickerModalComponent/OptionPickerModal"
import { DrawerRoutes } from "../../routes/DrawerRoutes"
import SettingsService from "../../services/SettingsService/SettingsService"
import { ensureExtension, ensureNoExtension, isLandscapeWeb } from "../../utilities/utilities"
import { useNavigation } from "@react-navigation/native"
import ScheduleLoaderService from "../../services/ScheduleLoaderService/ScheduleLoaderService"
import { getPageFour, getPageOne, getPageThree, getPageTwo } from "./Pages"
import { Swiper as SwiperType } from "swiper/types"
import { FontName } from "../../constants/Fonts"
import { styles, swiperWidth } from "./IntroductoryCarouselWebStyles"

// TODO: move shared logic to a separate file. As of now, lots if it is a copypaste from IntroductoryCarousel.native.tsx

// TODO: get replace document height with viewport height

/**
 * Web version of Introductory Carousel Screen
 */
export default function InroductoryCarouselScreen({ onClose }: { onClose?: () => void }) {
  const [currentPage, setCurrentPage] = React.useState(0)
  const swiperRef = useRef<SwiperType>()

  let [isVisible, setIsVisible] = useState(true)
  let [isReady, setIsReady] = useState(false)

  let [schedulePickerModalVisible, setSchedulePickerModalVisible] = useState(false)

  let [schedulePickerData, setSchedulePickerData] = useState<string[]>([])

  const navigation = useNavigation()

  const lastPageIndex = 3

  // mount effect
  useEffect(() => {
    async function init() {
      let scheduleLodaderInstance = await ScheduleLoaderService.GetInstance()

      let schedulePickerData = scheduleLodaderInstance.scheduleFiles.map((f) => ensureNoExtension(f.filename, ".json"))
      setSchedulePickerData(schedulePickerData)

      setIsReady(true)
    }

    init()
  }, [])

  // current page change effect
  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(currentPage)
    }
  }, [currentPage])

  if (!isReady) {
    // return spinner
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
        initialSlide={currentPage}
        style={{ display: "flex", width: swiperWidth, flexGrow: 1, maxHeight: "85%" }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => {
          setCurrentPage(swiper.activeIndex)
        }}
      >
        {getPageOne()}
        {getPageTwo()}

        {getPageThree()}
        {getPageFour()}
      </Swiper>
      {/* pager navigation (page 1 has different buttons) */}
      {currentPage == 0 ? (
        <View style={[styles.pagerNavigation, { justifyContent: "center" }]}>
          <TouchableOpacity
            style={[styles.navigationButton, { width: 150 }]}
            onPress={() => {
              setSchedulePickerModalVisible(true)
            }}
          >
            <AppText accessibilityLabel="selectSchedule" style={styles.selectScheduleText}>
              Обрати розклад
            </AppText>
          </TouchableOpacity>
          <OptionPickerModal
            headerText="Вибери свою групу"
            isOpen={schedulePickerModalVisible}
            options={schedulePickerData}
            selectedOption={""}
            onCloseModal={() => setSchedulePickerModalVisible(false)}
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
              style={{
                // color: palette.navigationBackground,
                fontFamily: FontName.Montserrat600,
                color: palette.grayedOut,
              }}
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
                // @ts-expect-error
                navigation.navigate(DrawerRoutes.VIEWER)
              }

              let newCurrentPage = _.clamp(currentPage + 1, 0, lastPageIndex)
              setCurrentPage(newCurrentPage)
            }}
          >
            <AppText style={{ color: palette.navigationBackground, fontFamily: FontName.Montserrat600 }}>
              {currentPage != lastPageIndex ? "Далі" : "Закрити"}
            </AppText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
