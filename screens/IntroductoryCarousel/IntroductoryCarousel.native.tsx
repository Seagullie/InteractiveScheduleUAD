import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, useWindowDimensions } from "react-native"
import PagerView from "react-native-pager-view"

import appConfig from "../../app.json"
import AppText from "../../components/shared/AppText"
import { globalStyles, palette } from "../../styles/global"
import { previewImages } from "../../constants/Images"
import _ from "lodash"
import { StatusBar, setStatusBarHidden } from "expo-status-bar"
import { useNavigation } from "@react-navigation/native"
import OptionPickerModal from "../../components/OptionPickerModalComponent/OptionPickerModal"
import ScheduleLoaderService from "../../services/ScheduleLoaderService/ScheduleLoaderService"
import { ensureExtension, ensureNoExtension } from "../../utilities/utilities"
import SettingsService from "../../services/SettingsService/SettingsService"
import { DrawerRoutes } from "../../routes/DrawerRoutes"
import { FontName } from "../../constants/Fonts"

// use this library: https://github.com/callstack/react-native-pager-view

export default function InroductoryCarouselScreen({ onClose }: { onClose?: () => void }) {
  const [currentPage, setCurrentPage] = React.useState(0)
  const [hideStatusBar, setHideStatusBar] = React.useState(true)

  let [isReady, setIsReady] = useState(false)
  let [isVisible, setIsVisible] = useState(true)

  let [schedulePickerModalVisible, setSchedulePickerModalVisible] = useState(false)

  let [schedulePickerData, setSchedulePickerData] = useState<string[]>([])

  const navigation = useNavigation()

  useEffect(() => {
    setStatusBarHidden(true, "fade")

    async function init() {
      let scheduleLodaderInstance = await ScheduleLoaderService.GetInstance()

      let schedulePickerData = scheduleLodaderInstance.scheduleFiles.map((f) => ensureNoExtension(f.filename, ".json"))
      setSchedulePickerData(schedulePickerData)

      setIsReady(true)
    }

    init()

    return () => {
      setHideStatusBar(false)
    }
  }, [])

  console.log(`Current page of intro pager is ${currentPage}`)

  const pagerRef = React.useRef<PagerView | null>(null)
  const lastPageIndex = 3

  const appName = appConfig.expo.name

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={palette.navigationBackground} />
      </View>
    )
  }

  return (
    <View style={[styles.overlay, { flex: 1, zIndex: 9999 }]}>
      <View
        style={[
          styles.overlay,
          {
            height: 9999,
            zIndex: -1,
            // backgroundColor: "red",
          },
        ]}
      />

      <View style={styles.paginationCircles}>
        {_.times(lastPageIndex + 1, (i) => (
          <View key={i} style={[styles.circle, currentPage == i ? styles.circleActive : {}]} />
        ))}
      </View>

      <PagerView
        onPageScroll={(e) => {
          setCurrentPage(e.nativeEvent.position)
        }}
        style={styles.viewPager}
        initialPage={currentPage}
        ref={pagerRef}
      >
        <View style={styles.page} key="1">
          <View style={styles.pageBody}>
            <View style={styles.imageContainer}>
              <Image style={styles.previewImage} source={previewImages.scheduleCropped} />
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
        <View style={styles.page} key="2">
          <View style={styles.pageBody}>
            <View style={styles.imageContainer}>
              <Image style={styles.previewImage} source={previewImages.reglamentPreview} />
            </View>
            <AppText style={styles.pageTitle}>Регламент</AppText>
            <View style={styles.pageDescriptionText}>
              <AppText style={styles.centeredDescriptionText}>
                Звичайний регламент... Але з{" "}
                <AppText style={{ color: palette.navigationBackground }}>підсвіткою поточної пари </AppText>✨
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.page} key="3">
          <View style={styles.pageBody}>
            <View style={styles.imageContainer}>
              <Image style={styles.previewImage} source={previewImages.editorPreview} />
            </View>
            <AppText style={styles.pageTitle}>Редактор</AppText>
            <View style={styles.pageDescriptionText}>
              <AppText style={styles.centeredDescriptionText}>
                Дозволяє виправити чи змінити розклад за власними побажаннями.
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.page} key="4">
          <View style={styles.pageBody}>
            <View style={styles.imageContainer}>
              <Image style={styles.previewImage} source={previewImages.settingsPreview} />
            </View>
            <AppText style={styles.pageTitle}>Налаштування</AppText>
            <View style={styles.pageDescriptionText}>
              <AppText style={styles.centeredDescriptionText}>
                Вигляд розкладу та сповіщення можна налаштувати тут.
              </AppText>
            </View>
          </View>
        </View>
      </PagerView>

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
              style={{ color: palette.navigationBackground, fontFamily: FontName.Montserrat600 }}
            >
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
              // setSettingsValues({
              //   ...settingsValues,
              //   selectedSchedule: ensureExtension(selected, ".json"),
              // })
              SettingsService.GetInstance().then((i) => {
                i.currentScheduleName = ensureExtension(selected, ".json")
                i.saveToStorage()

                let newCurrentPage = _.clamp(currentPage + 1, 0, pagerRef.current!.props.children.length - 1)
                pagerRef.current!.setPage(newCurrentPage)
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
              pagerRef.current!.setPage(newCurrentPage)
            }}
          >
            <AppText
              style={{
                color: palette.navigationBackground,
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
                navigation.navigate(DrawerRoutes.VIEWER)
              }

              let newCurrentPage = _.clamp(currentPage + 1, 0, pagerRef.current!.props.children.length - 1)
              pagerRef.current!.setPage(newCurrentPage)
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

const styles = StyleSheet.create({
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
  },

  circleActive: {
    backgroundColor: "#7B7B7B",
  },

  pageBody: {
    marginBottom: 20,
    flex: 1,
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

    elevation: 0,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: palette.navigationBackground,
    shadowOpacity: 0.3,
    shadowRadius: 2,

    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "row",
  },

  previewImage: {
    borderRadius: 10,
    // borderColor: palette.backgroundLight,

    // backgroundColor: palette.navigationBackground,

    height: "100%",
    width: "100%",

    // resizeMode: "cover" is the default
    resizeMode: "contain",

    alignSelf: "flex-start",
    alignItems: "flex-start",
    justifyContent: "flex-start",
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
