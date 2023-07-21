import { View, Text, StyleSheet, ImageBackground } from "react-native"
import AppText from "../../shared/AppText"
import { previewImages, palette, globalStyles } from "../../styles/global"
import { isRunningInBrowser } from "../../utilities/utilities"

// TODO: integrate with native carousel
// TODO: get full size screenshots
// TODO: adapt settings page to web

export function getPageOne() {
  const pageOne = (
    <View style={styles.page} key="1">
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
          Якщо цього тижня – чисельник, то перемикач <Text style={{ color: palette.navigationBackground }}>Чис</Text>{" "}
          буде активним.
        </AppText>
      </View>
    </View>
  )

  return pageOne
}

export function getPageTwo() {
  const pageTwo = (
    <View style={styles.page} key="2">
      <View style={styles.imageContainer}>
        <img style={styles.previewImage} src={previewImages.reglamentPreview} />
      </View>
      <AppText style={styles.pageTitle}>Регламент</AppText>
      <View style={styles.pageDescriptionText}>
        <AppText style={styles.centeredDescriptionText}>
          Звичайний регламент... Але з{" "}
          <AppText style={{ color: palette.navigationBackground }}>підсвіткою поточної пари </AppText>✨
        </AppText>
      </View>
    </View>
  )

  return pageTwo
}

export function getPageThree() {
  const pageThree = (
    <View style={styles.page} key="3">
      <View style={styles.imageContainer}>
        <img style={styles.previewImage} src={previewImages.editorPreview} />
      </View>
      <AppText style={styles.pageTitle}>Редактор</AppText>
      <View style={styles.pageDescriptionText}>
        <AppText style={styles.centeredDescriptionText}>
          Дозволяє виправити чи змінити розклад за власними побажаннями.
        </AppText>
      </View>
    </View>
  )

  return pageThree
}

export function getPageFour() {
  const pageFour = (
    <View style={styles.page} key="4">
      <View style={styles.imageContainer}>
        <img style={styles.previewImage} src={previewImages.settingsPreview} />
      </View>
      <AppText style={styles.pageTitle}>Налаштування</AppText>
      <View style={styles.pageDescriptionText}>
        <AppText style={styles.centeredDescriptionText}>Вигляд розкладу та сповіщення можна налаштувати тут.</AppText>
      </View>
    </View>
  )

  return pageFour
}

const styles = StyleSheet.create({
  page: {
    height: "80vh",
    marginHorizontal: 20,
    width: "90%",
    marginLeft: "5%",
    alignItems: "center",

    marginBottom: 20,
    flex: 1,

    justifyContent: "center",
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
    height: "55%",
    width: "100%",

    overflow: "hidden",
    flexDirection: "row",
  },

  previewImage: {
    borderRadius: 10,

    width: "100%",
    height: "max-content",
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
