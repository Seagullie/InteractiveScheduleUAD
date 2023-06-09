import React from "react"
import { View, Image, StyleSheet, TouchableOpacity, Linking } from "react-native"
import { globalStyles, images, palette, teamMemberImages } from "../styles/global"
import { FontAwesome5, Ionicons } from "@expo/vector-icons"
import AppText from "../shared/AppText"
import { ScrollView } from "react-native-gesture-handler"
import { useNavigation } from "@react-navigation/native"
import { DrawerRoutes } from "../routes/DrawerRoutes"

export default function AboutScreen() {
  const appVersion = "1.0.1"
  const navigation = useNavigation()

  return (
    <ScrollView style={globalStyles.screen}>
      <View style={styles.card}>
        <View style={[styles.row]}>
          <AppText style={{ color: "#333333", letterSpacing: 0 }}>Перший в історії УАД</AppText>
          {/* <SvgUri source={images.uad_logo_text} width="200" height={"200"} /> */}
          <Image
            style={{
              width: 73,
              height: 34,
              resizeMode: "contain",

              // backgroundColor: "red",
            }}
            source={images.uad_logo_text_not_vector_hires}
          />
        </View>
        <View style={[styles.row, { alignItems: "flex-end", marginTop: 45 }]}>
          <AppText style={styles.header}>Інтерактивний {"\n"}розклад</AppText>
          <AppText
            style={{
              color: palette.textOnBackground,
              fontStyle: "italic",
              fontSize: 10,
              letterSpacing: 0,
            }}
          >
            і не тільки
          </AppText>
        </View>
      </View>
      <View style={[globalStyles.centered]}>
        <View
          style={[
            styles.card,
            globalStyles.centered,

            {
              flexDirection: "row",
              // justifyContent: "space-between",
              width: 110 * 2 + 20,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              {
                width: 110,
                alignItems: "center",
              },
            ]}
            onPress={() => {
              navigation.navigate(DrawerRoutes.VIEWER)
            }}
          >
            <Ionicons name="calendar" color={palette.textOnBackground} size={48} />
            <AppText style={styles.tileText}>Розклад</AppText>
          </TouchableOpacity>

          <View
            style={[
              {
                justifyContent: "center",
                alignSelf: "center",
              },
            ]}
          >
            <Ionicons name="add-sharp" color={palette.textOnBackground} size={32} />
          </View>

          <TouchableOpacity
            style={[
              {
                alignItems: "center",
                width: 110,
              },
            ]}
            onPress={() => {
              navigation.navigate(DrawerRoutes.EDITOR)
            }}
          >
            <Ionicons name="options" color={palette.textOnBackground} size={48} />
            <AppText style={styles.tileText}>Редактор</AppText>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={[styles.card, styles.tile]}
            onPress={() => {
              navigation.navigate(DrawerRoutes.REGLAMENT)
            }}
          >
            <Ionicons name="time-sharp" color={palette.textOnBackground} size={48} />
            <AppText style={styles.tileText}>Регламент</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.tile]}
            onPress={() => {
              navigation.navigate(DrawerRoutes.TEACHERS)
            }}
          >
            <FontAwesome5 name="user-graduate" color={palette.textOnBackground} size={48} />
            <AppText style={styles.tileText}>Викладачі</AppText>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={[styles.card, styles.tile]}
            onPress={() => {
              navigation.navigate(DrawerRoutes.CONTACTS)
            }}
          >
            <Ionicons name="call" color={palette.textOnBackground} size={48} />
            <AppText style={styles.tileText}>Контакти</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.tile]}
            onPress={() => {
              navigation.navigate(DrawerRoutes.NEWS)
            }}
          >
            <Ionicons name="chatbox-ellipses" color={palette.textOnBackground} size={48} />
            <AppText style={styles.tileText}>Новини</AppText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.card]}>
        <AppText style={[styles.teamSectionHeader]}>Команда проекту</AppText>
        <View style={[styles.tilesContainer]}>
          <View style={[styles.row]}>
            <View style={[styles.teamMemberTile]}>
              {/* image container */}
              <View style={styles.teamMemberImageWrapper}>
                <Image style={styles.teamMemberImage} source={teamMemberImages.senchyk_andrii} />
              </View>
              {/* team member description */}
              <View style={styles.teamMemberDescription}>
                <AppText style={[styles.teamMemberName, styles.regularLetterSpacing]}>Сенчик Андрій</AppText>
                <AppText style={[styles.teamMemberDetails]}>Програмування{"\n"}</AppText>
              </View>
            </View>

            <View style={[styles.teamMemberTile]}>
              {/* image container */}
              <View style={styles.teamMemberImageWrapper}>
                <Image style={styles.teamMemberImage} source={teamMemberImages.zakharova_zarina} />
              </View>
              {/* team member description */}
              <View style={styles.teamMemberDescription}>
                <AppText style={[styles.teamMemberName, styles.regularLetterSpacing]}>Захарова Заріна</AppText>
                <AppText style={[styles.teamMemberDetails]}>
                  Керування проектом{"\n"}
                  Дизайн
                </AppText>
              </View>
            </View>
          </View>
          <View
            style={[
              styles.row,
              {
                marginTop: 40,
              },
            ]}
          >
            <View style={[styles.teamMemberTile]}>
              {/* image container */}
              <View style={styles.teamMemberImageWrapper}>
                <Image style={styles.teamMemberImage} source={teamMemberImages.shepita_julia} />
              </View>
              {/* team member description */}
              <View style={styles.teamMemberDescription}>
                <AppText style={[styles.teamMemberName, styles.regularLetterSpacing]}>Шепіта Юлія</AppText>
                <AppText style={[styles.teamMemberDetails]}>Робота з контентом</AppText>
              </View>
            </View>

            <View style={[styles.teamMemberTile]}>
              {/* image container */}
              <View style={styles.teamMemberImageWrapper}>
                <Image style={styles.teamMemberImage} source={teamMemberImages.ivanov_mykhailo} />
              </View>
              {/* team member description */}
              <View style={styles.teamMemberDescription}>
                <AppText style={[styles.teamMemberName, styles.regularLetterSpacing]}>Іванов Михайло</AppText>
                <AppText style={[styles.teamMemberDetails]}>Тестування</AppText>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.card]}>
        <AppText style={[styles.teamSectionHeader, { marginBottom: 10 }]}>Зворотній зв'язок</AppText>
        <AppText style={[{ fontSize: 13, fontFamily: "montserrat-600", marginBottom: 5 }]}>
          Виникли запитання або ідеї як покращити наш застосунок? Напиши нам!
        </AppText>
        <View style={[globalStyles.centered, { flexDirection: "row" }]}>
          <Ionicons name="mail" color={palette.navigationBackground} size={19} style={{ marginRight: 5 }} />
          <AppText
            onPress={() => {
              Linking.openURL("mailto:schedule.uad@gmail.com")
            }}
            style={styles.contactsEmail}
          >
            schedule.uad@gmail.com
          </AppText>
        </View>
      </View>

      <View style={[styles.copyrightContainer]}>
        <AppText style={[{ textAlign: "center", fontFamily: "century-gothic" }]}>
          Авторські права 2023 © Українська Академія Друкарства. Усі права захищені
        </AppText>
      </View>

      <View style={[styles.appVersionContainer]}>
        <AppText style={[{ fontFamily: "century-gothic", color: "#5A5A5A" }]}>{appVersion} </AppText>
      </View>
    </ScrollView>
  )
}

const teamMemberImageWidth = 110

const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    color: palette.navigationBackground,
    fontFamily: "century-gothic",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  tile: {
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",

    width: 110,

    padding: 15,
  },

  tilesContainer: {
    // width: "100%",
  },

  teamMemberTile: {
    width: "50%",
    ...globalStyles.centered,
  },

  teamSectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 0,
    marginBottom: 20,
  },

  teamMemberName: {
    fontSize: 16,
    fontWeight: "bold",
    color: palette.navigationBackground,
  },

  teamMemberDetails: {
    letterSpacing: 0,
    fontFamily: "raleway-600",
    textAlign: "center",
    letterSpacing: 0,
  },

  regularLetterSpacing: {
    letterSpacing: 0,
  },

  teamMemberDescription: {
    marginTop: 15,
    alignItems: "center",
  },

  teamMemberImage: {
    width: teamMemberImageWidth,
    height: teamMemberImageWidth,
    borderRadius: 999,
    resizeMode: "contain",
  },

  teamMemberImageWrapper: {
    backgroundColor: "gray",

    borderRadius: 999,

    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },

  tileText: {
    fontFamily: "century-gothic",
    fontSize: 14,
  },

  card: {
    // marginVertical: 5,
    // marginHorizontal: 10,
    padding: 15,
    margin: 10,
    // paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "white",

    elevation: 1,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },

  contactsEmail: {
    color: palette.navigationBackground,
    fontSize: 16,
    fontFamily: "century-gothic",
    textAlign: "center",
    textDecorationLine: "underline",
    marginBottom: 3,
  },

  copyrightContainer: {
    marginTop: 5,

    backgroundColor: palette.background,
    paddingHorizontal: 50,
    paddingVertical: 7,
  },

  appVersionContainer: {
    backgroundColor: "white",
    alignItems: "flex-end",
    paddingVertical: 2,
    paddingRight: 5,
  },
})
