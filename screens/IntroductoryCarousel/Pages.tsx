import { View, Text, StyleSheet } from "react-native"
import AppText from "../../components/shared/AppText"
import { palette } from "../../styles/global"
import { previewImagesFull } from "../../constants/Images"
import { isRunningInBrowser } from "../../utilities/utilities"

// Import Swiper React components
import { SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"

// TODO: integrate with native carousel (it uses cropped preview images)
// TODO: adapt settings page to web

export function getPageOne() {
  const image = <img style={styles.previewImage} src={previewImagesFull.schedule} loading="eager" />

  const pageOne = (
    <SwiperSlide style={styles.page} key="1">
      <View style={styles.imageContainer}>{image}</View>
      <AppText style={styles.pageTitle}>Розклад</AppText>
      <View style={styles.pageDescriptionText}>
        <AppText style={styles.centeredDescriptionText}>
          Розклад занять у вищих навчальних закладах чергується тижнями: чисельник, знаменник.
        </AppText>
        <br />
        <AppText style={styles.centeredDescriptionText}>
          Якщо цього тижня – чисельник, то перемикач <Text style={{ color: palette.navigationBackground }}>Чис</Text>{" "}
          буде активним.
        </AppText>
      </View>
    </SwiperSlide>
  )

  return pageOne
}

export function getPageTwo() {
  const pageTwo = (
    <SwiperSlide style={styles.page} key="2">
      <View style={{ ...styles.imageContainer }}>
        <img style={styles.previewImage} src={previewImagesFull.reglamentPreview} loading="eager" />
      </View>
      <AppText style={styles.pageTitle}>Регламент</AppText>
      <View style={styles.pageDescriptionText}>
        <AppText style={styles.centeredDescriptionText}>
          Звичайний регламент... Але з{" "}
          <AppText style={{ color: palette.navigationBackground }}>підсвіткою поточної пари </AppText>✨
        </AppText>
      </View>
    </SwiperSlide>
  )

  return pageTwo
}

export function getPageThree() {
  const pageThree = (
    <SwiperSlide style={styles.page} key="3">
      <View style={styles.imageContainer}>
        <img style={styles.previewImage} src={previewImagesFull.editorPreview} loading="eager" />
      </View>
      <AppText style={styles.pageTitle}>Редактор</AppText>
      <View style={styles.pageDescriptionText}>
        <AppText style={styles.centeredDescriptionText}>
          Дозволяє виправити чи змінити розклад за власними побажаннями.
        </AppText>
      </View>
    </SwiperSlide>
  )

  return pageThree
}

export function getPageFour() {
  const pageFour = (
    <SwiperSlide style={styles.page} key="4">
      <View style={styles.imageContainer}>
        <img style={styles.previewImage} src={previewImagesFull.settingsPreview} loading="eager" />
      </View>
      <AppText style={styles.pageTitle}>Налаштування</AppText>
      <View style={styles.pageDescriptionText}>
        <AppText style={styles.centeredDescriptionText}>Вигляд розкладу та сповіщення можна налаштувати тут.</AppText>
      </View>
    </SwiperSlide>
  )

  return pageFour
}

const styles = StyleSheet.create({
  page: {
    marginBottom: 20,
    marginHorizontal: 20,

    display: "flex",
    flexDirection: "column",

    alignItems: "center",
    justifyContent: "space-between",
  },

  pageTitle: {
    fontSize: 24,
    color: palette.navigationBackground,
    textAlign: "center",
    marginVertical: isRunningInBrowser() ? 20 : 10,
    marginTop: isRunningInBrowser() ? 40 : 20,
  },

  imageContainer: {
    borderRadius: 10,
    // bump to 65% on web. Not sure if it's okay to do so on mobile
    height: isRunningInBrowser() ? "65%" : "55%",
    // width: "100%",
    // flex: 1,
    alignSelf: "stretch",

    overflow: "hidden",
    flexDirection: "row",

    // backgroundColor: "orange",
  },

  previewImage: {
    borderRadius: 10,

    width: "100%",

    objectFit: "cover",
    objectPosition: "top",
  },

  centeredDescriptionText: {
    textAlign: "center",
  },

  pageDescriptionText: {
    flex: 1,
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
})
