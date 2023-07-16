import React, { useEffect, useState } from "react"

import { View, Button, StyleSheet, Text, Image, TouchableOpacity } from "react-native"
import { palette, globalStyles, previewImages } from "../../styles/global"
import AppText from "../../shared/AppText"

import "react-responsive-carousel/lib/styles/carousel.min.css" // requires a loader
import { Carousel } from "react-responsive-carousel"
import _ from "lodash"
import { setStatusBarHidden } from "expo-status-bar"
import OptionPickerModal from "../../components/OptionPickerModal"
import { DrawerRoutes } from "../../routes/DrawerRoutes"
import SettingsService from "../../services/SettingsService"
import { ensureExtension } from "../../utilities/utilities"
import { useNavigation } from "@react-navigation/native"

// TODO: move shared logic to a separate file. As of now, lots if it is a copypaste from IntroductoryCarousel.native.tsx

export default function InroductoryCarouselScreen({ onClose }: { onClose?: () => void }) {
  const [currentPage, setCurrentPage] = React.useState(0)
  let [isVisible, setIsVisible] = useState(true)

  let [schedulePickerModalVisible, setSchedulePickerModalVisible] = useState(false)

  let [schedulePickerData, setSchedulePickerData] = useState<string[]>([])

  const navigation = useNavigation()

  const lastPageIndex = 3

  return (
    <View style={{ ...styles.overlay, height: "800px" }}>
      <View
        style={[
          styles.overlay,
          {
            height: "100vh",
            zIndex: -1,
            backgroundColor: "red",
          },
        ]}
      />

      <div className="carouselContainerDebug" style={styles.carouselContainer}>
        <View style={styles.paginationCircles}>
          {_.times(lastPageIndex + 1, (i) => (
            <View key={i} style={[styles.circle, currentPage == i ? styles.circleActive : {}]} />
          ))}
        </View>

        <Carousel
          emulateTouch={true}
          showArrows={false}
          showThumbs={false}
          showStatus={false}
          renderIndicator={(onClickHandler, isSelected, index, label) => {
            return <div key={index} style={styles.circle} />
          }}
          showIndicators={false}
          onChange={(index) => setCurrentPage(index)}
          selectedItem={currentPage}
        >
          <View style={styles.page} key="1">
            <View style={styles.pageBody}>
              <View style={styles.imageContainer}>
                <img style={styles.previewImage} src={previewImages.scheduleCropped} />
              </View>
              <AppText style={styles.pageTitle}>Розклад</AppText>
              <View style={styles.pageDescriptionText}>
                <AppText style={styles.centeredDescriptionText}>
                  Розклад занять в академії чергується тижнями: чисельник, знаменник.
                </AppText>
                <Text />
                <AppText style={styles.centeredDescriptionText}>
                  Якщо цього тижня – чисельник, то перемикач{" "}
                  <Text style={{ color: palette.navigationBackground }}>Чис</Text> буде активним.
                </AppText>
              </View>
            </View>
          </View>
          <div>
            <img src="https://cdn3.iconfinder.com/data/icons/letters-and-numbers-1/32/number_2_green-512.png" />
            <p>Legend 2</p>
          </div>
          <div>
            <img src="assets/3.jpeg" />
            <p className="legend">Legend 3</p>
          </div>
        </Carousel>
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
      </div>
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
    // height: "100%",
    flex: 1,
    zIndex: 9999,
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
    marginHorizontal: 30,
    marginBottom: 20,
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
    // backgroundColor: "green",

    overflow: "visible",

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
