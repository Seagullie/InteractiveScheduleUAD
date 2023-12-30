import React from "react"
import { View, Text, StyleSheet, Button, Linking } from "react-native"
import OptionPickerModal from "../../components/OptionPickerModal"
import { globalStyles, palette } from "../../styles/global"
import { imageIcons } from "../../constants/Images"
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import AppText from "../../shared/AppText"
import { useNavigation } from "@react-navigation/native"
import { ContactsStackRoutes } from "../../routes/ContactsStackRoutes"
import { Image } from "react-native-elements"
import { isMail } from "../../utilities/utilities"

type ModalItem = {
  icon: JSX.Element
  text: string
  isPhone?: boolean
  isLink?: boolean
  linkName?: string
}

export default function ContactsModalTestScreen() {
  let navigation = useNavigation()

  let [corpsModalIsOpen, setCorpsModalIsOpen] = React.useState(false)
  let [rectorateModalIsOpen, setRectorateModalIsOpen] = React.useState(false)
  let [preparationDepartmentModalIsOpen, setPreparationDepartmentModalIsOpen] = React.useState(false)
  let [
    internationalAffairsAndInformationDepartmentModalIsOpen,
    setInternationalAffairsAndInformationDepartmentModalIsOpen,
  ] = React.useState(false)
  let [admissionCommitteeModalIsOpen, setAdmissionCommitteeModalIsOpen] = React.useState(false)
  let [studentCouncilModalIsOpen, setStudentCouncilModalIsOpen] = React.useState(false)
  let [socialMediaModalIsOpen, setSocialMediaModalIsOpen] = React.useState(false)

  let academyCorps = [
    "вул. Під Голоском, 19",
    "вул. Підвальна, 17",
    "вул. Личаківська, 3",
    "вул. Коцюбинського, 21",
    "вул. Винниченка, 12",
  ]

  // Корпуси академії
  let corpsModalItems = academyCorps.map((corps) => {
    return {
      text: corps,
      icon: <Ionicons name="location" color={palette.grayedOut} size={16} />,
    }
  })

  // Ректорат
  let rectorateModalItems: ModalItem[] = [
    {
      icon: <Ionicons name="location" color={palette.grayedOut} size={16} />,
      text: "вул. Під Голоском, 19, ауд. 234",
    },
    {
      icon: <Ionicons name="call" color={palette.grayedOut} size={16} />,
      text: "(032) 242 23 77",
      isPhone: true,
    },
    {
      icon: <Ionicons name="mail" color={palette.grayedOut} size={16} />,
      text: "uad@uad.edu.ua",
      isLink: true,
    },
  ]

  // Підготовче відділення
  let preparationDepartmentModalItems: ModalItem[] = [
    {
      icon: <Ionicons name="location" color={palette.grayedOut} size={16} />,
      text: "вул. Під Голоском, 19, ауд. 218",
    },
    {
      icon: <Ionicons name="call" color={palette.grayedOut} size={16} />,
      text: "(032) 242 23 78",
      isPhone: true,
    },
    {
      icon: <Ionicons name="mail" color={palette.grayedOut} size={16} />,
      text: "pv@uad.edu.ua",
      isLink: true,
    },
    {
      icon: <Ionicons name="globe" color={palette.grayedOut} size={16} />,
      text: "http://www.uad-pv.pp.ua/",
      isLink: true,
    },
  ]

  // Відділ міжнародних звʼязків та інформаційного забезпечення
  let internationalAffairsAndInformationDepartmentModalItems: ModalItem[] = [
    {
      icon: <Ionicons name="location" color={palette.grayedOut} size={16} />,
      text: "вул. Під Голоском, 19",
    },

    {
      icon: <Ionicons name="call" color={palette.grayedOut} size={16} />,
      text: "(032) 259 94 21",
      isPhone: true,
    },
    {
      icon: <Ionicons name="mail" color={palette.grayedOut} size={16} />,
      text: "ird@uad.lviv.ua",
      isLink: true,
    },
  ]

  // Приймальна комісія
  let admissionsCommitteeModalItems: ModalItem[] = [
    {
      icon: <Ionicons name="location" color={palette.grayedOut} size={16} />,
      text: "вул. Під Голоском, 19, каб. 417, 200",
    },
    {
      icon: <Ionicons name="call" color={palette.grayedOut} size={16} />,
      text: "(067) 149 14 00",
      isPhone: true,
    },
    {
      icon: <Ionicons name="mail" color={palette.grayedOut} size={16} />,
      text: "pk@uad.edu.ua",
      isLink: true,
    },
    {
      icon: <Ionicons name="mail" color={palette.grayedOut} size={16} />,
      text: "pk.uad.lviv@gmail.com",
      isLink: true,
    },
  ]

  // Бухгалтерія
  let accountingModalItems: ModalItem[] = [
    {
      icon: <Ionicons name="location" color={palette.grayedOut} size={16} />,
      text: "вул. Під Голоском, 19, ауд. 213",
    },
    {
      icon: <Ionicons name="call" color={palette.grayedOut} size={16} />,
      text: "(032) 242 23 46",
      isPhone: true,
    },
  ]

  // Відділ платної форми навчання
  let contractEducationDepartmentModalItems: ModalItem[] = [
    {
      icon: <Ionicons name="location" color={palette.grayedOut} size={16} />,
      text: "вул. Під Голоском, 19, ауд. 234а",
    },
    {
      icon: <Ionicons name="call" color={palette.grayedOut} size={16} />,
      text: "(032) 242 23 80",
      isPhone: true,
    },
    {
      icon: <Ionicons name="mail" color={palette.grayedOut} size={16} />,
      text: "vpn_uad@ukr.net",
      isLink: true,
    },
  ]

  // Профком студентів
  let studentUnionModalItems: ModalItem[] = [
    {
      icon: <Ionicons name="location" color={palette.grayedOut} size={16} />,
      text: "вул. Під Голоском, 19, ауд. 311",
    },
    {
      icon: <Ionicons name="call" color={palette.grayedOut} size={16} />,
      text: "(032) 242 23 79",
      isPhone: true,
    },
    {
      icon: <Ionicons name="call" color={palette.grayedOut} size={16} />,
      text: "(067) 67 23 173",
      isPhone: true,
    },
  ]

  // Студентська рада
  let studentCouncilModalItems: ModalItem[] = [
    {
      icon: <FontAwesome name="instagram" color={palette.grayedOut} size={16} />,
      text: "https://www.instagram.com/uad_lviv/",
      isLink: true,
      linkName: "uad_lviv",
    },
  ]

  // Соц. мережі академії
  let socialMediaModalItems: ModalItem[] = [
    {
      icon: <FontAwesome name="instagram" color={palette.grayedOut} size={16} />,
      text: "https://www.instagram.com/uad_lviv/",
      isLink: true,
      linkName: "@uad_lviv",
    },
    {
      icon: <FontAwesome name="telegram" color={palette.grayedOut} size={16} />,
      text: "https://t.me/uad_live",
      isLink: true,
      linkName: "@uad_live",
    },
    {
      icon: <FontAwesome name="youtube-play" color={palette.grayedOut} size={16} />,
      text: "https://www.youtube.com/user/UADtelevision",
      isLink: true,
      linkName: "UADtelevision",
    },
    {
      icon: <FontAwesome name="facebook-official" color={palette.grayedOut} size={16} />,
      text: "https://www.facebook.com/uadlv",
      isLink: true,
    },
    {
      icon: (
        <Image
          source={imageIcons.tiktok}
          // color={palette.grayedOut}
          style={{
            width: 16,
            height: 18,
          }}
        />
      ),
      text: "https://www.tiktok.com/@uad.lviv",
      isLink: true,
      linkName: "@uad.lviv",
    },
  ]

  const constructModalItem = (item: ModalItem, idx) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 6,
        }}
      >
        {item.icon}
        <AppText
          onPress={() => {
            if (item.isLink) {
              if (isMail(item.text)) Linking.openURL(`mailto:${item.text}`)
              else Linking.openURL(item.text)
            } else if (item.isPhone) Linking.openURL(`tel:${item.text}`)
          }}
          style={[styles.optionText, item.isLink ? globalStyles.underlinedLink : {}]}
        >
          {item.linkName ? item.linkName : item.text}
        </AppText>
      </View>
    )
  }

  const constructContentPresenterModal = (
    headerText: string,
    isOpen: boolean,
    onCloseModal: () => void,
    initialOptions: typeof rectorateModalItems,
    displaySeparators = false
  ) => {
    return (
      <OptionPickerModal
        headerText={headerText}
        isOpen={isOpen}
        hasSearchBar={false}
        displaySeparators={displaySeparators}
        closeModal={onCloseModal}
        initialOptions={initialOptions}
        renderItem={constructModalItem}
        isOptionSelectable={false}
      />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Button title="Корпуси академії" onPress={() => setCorpsModalIsOpen(true)} />
        {constructContentPresenterModal(
          "Корпуси академії",
          corpsModalIsOpen,
          () => setCorpsModalIsOpen(false),
          corpsModalItems,
          true
        )}
      </View>
      <View>
        <Button title="Ректорат" onPress={() => setRectorateModalIsOpen(true)} />
        {constructContentPresenterModal(
          "Ректорат",
          rectorateModalIsOpen,
          () => setRectorateModalIsOpen(false),
          rectorateModalItems
        )}
      </View>

      <View>
        <Button title="Підготовче відділення" onPress={() => setPreparationDepartmentModalIsOpen(true)} />
        {constructContentPresenterModal(
          "Підготовче відділення",
          preparationDepartmentModalIsOpen,
          () => setPreparationDepartmentModalIsOpen(false),
          preparationDepartmentModalItems
        )}
      </View>
      <View>
        {/* push Faculties Screen on top of stack */}
        <Button title="Факультети академії" onPress={() => navigation.push(ContactsStackRoutes.FACULTIES)} />
      </View>

      <View>
        <Button
          title="Відділ міжнародних звʼязків та інформаційного забезпечення"
          onPress={() => setInternationalAffairsAndInformationDepartmentModalIsOpen(true)}
        />
        {constructContentPresenterModal(
          "Відділ міжнародних звʼязків та інформаційного забезпечення",
          internationalAffairsAndInformationDepartmentModalIsOpen,
          () => setInternationalAffairsAndInformationDepartmentModalIsOpen(false),
          internationalAffairsAndInformationDepartmentModalItems
        )}
      </View>
      <View>
        <Button title="Приймальна комісія" onPress={() => setAdmissionCommitteeModalIsOpen(true)} />
        {constructContentPresenterModal(
          "Приймальна комісія",
          admissionCommitteeModalIsOpen,
          () => setAdmissionCommitteeModalIsOpen(false),
          admissionsCommitteeModalItems
        )}
      </View>

      <View>
        <Button title="Студентська рада" onPress={() => setStudentCouncilModalIsOpen(true)} />
        {constructContentPresenterModal(
          "Студентська рада",
          studentCouncilModalIsOpen,
          () => setStudentCouncilModalIsOpen(false),
          studentCouncilModalItems
        )}
      </View>

      <View>
        <Button title="Соц. мережі академії" onPress={() => setSocialMediaModalIsOpen(true)} />
        {constructContentPresenterModal(
          "Соц. мережі академії",
          socialMediaModalIsOpen,
          () => setSocialMediaModalIsOpen(false),
          socialMediaModalItems
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    justifyContent: "space-around",
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
  },
})
