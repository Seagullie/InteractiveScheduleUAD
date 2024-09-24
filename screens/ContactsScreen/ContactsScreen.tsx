import React from "react"
import { View, FlatList, Linking, Pressable } from "react-native"
import Separator from "../../components/shared/Separator"
import EntypoIcon from "react-native-vector-icons/Entypo"
import { Ionicons, Octicons } from "@expo/vector-icons"
import { globalStyles, palette } from "../../styles/global"
import { imageIcons } from "../../constants/Images"
import AppText from "../../components/shared/AppText"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { Image } from "react-native-elements"
import OptionPickerModal from "../../components/OptionPickerModalComponent/OptionPickerModal"
import {
  ModalItem,
  accountingModalItems,
  admissionsCommitteeModalItems,
  contractEducationDepartmentModalItems,
  corpsModalItems,
  internationalAffairsAndInformationDepartmentModalItems,
  preparationDepartmentModalItems,
  rectorateModalItems,
  socialMediaModalItems,
  studentCouncilModalItems,
  studentUnionModalItems,
} from "../../constants/Contacts"
import { isMail } from "../../utilities/utilities"
import { useNavigation } from "@react-navigation/native"
import { FontName } from "../../constants/Fonts"
import { styles } from "./Styles"
import WarningBar from "../../components/WarningBar"

type CategoryProps = {
  title: string
  titleIcon: React.JSX.Element
  subcategories?: string[]
  onPress?: () => void
  children?: React.JSX.Element[]
}

function Category({ title, titleIcon, subcategories, onPress, children }: CategoryProps) {
  return (
    <View style={styles.category}>
      <View style={styles.categoryTitle}>
        {titleIcon}
        <AppText style={[{ fontSize: 14, fontFamily: FontName.Montserrat600, marginLeft: 5 }]}>{title}</AppText>
      </View>
      <FlatList
        data={children}
        style={[globalStyles.card, { paddingHorizontal: 10, paddingVertical: 10 }]}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => {
          return <Separator color="rgba(217, 217, 217, 0.4)" upperElement={true} lowerElement={true} /> // TODO: Refactor
        }}
        renderItem={({ item }) => {
          const itemOnPress = item.props.onPress
          const ItemType = item.type

          const itemWithoutOnPress = <ItemType {...item.props} onPress={() => null} />

          return (
            <TouchableOpacity
              onPress={() => {
                itemOnPress() // hoist the onPress handler to parent for larger hitbox
              }}
              style={styles.subcategoryButtonContainer}
            >
              <AppText style={[{ fontSize: 15 }]}>{itemWithoutOnPress}</AppText>
              <EntypoIcon name="chevron-small-right" style={globalStyles.grayIcon}></EntypoIcon>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

const constructModalItem = (item: ModalItem, idx: number) => {
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

function constructContentPresenterModal(
  headerText: string,
  isOpen: boolean,
  onCloseModal: () => void,
  initialOptions: ModalItem[],
  displaySeparators = false
) {
  return (
    <OptionPickerModal
      headerText={headerText}
      isOpen={isOpen}
      hasSearchBar={false}
      displaySeparators={displaySeparators}
      onCloseModal={onCloseModal}
      options={initialOptions}
      renderItem={constructModalItem}
      isOptionSelectable={false}
    />
  )
}

export default function ContactsScreen() {
  const navigation = useNavigation()

  const [corpsModalIsOpen, setCorpsModalIsOpen] = React.useState(false)

  const [rectorateModalIsOpen, setRectorateModalIsOpen] = React.useState(false)
  const [admissionCommitteeModalIsOpen, setAdmissionCommitteeModalIsOpen] = React.useState(false)
  const [preparationDepartmentModalIsOpen, setPreparationDepartmentModalIsOpen] = React.useState(false)
  const [
    internationalAffairsAndInformationDepartmentModalIsOpen,
    setInternationalAffairsAndInformationDepartmentModalIsOpen,
  ] = React.useState(false)

  const [accountingModalIsOpen, setAccountingModalIsOpen] = React.useState(false)
  const [contractEducationModalIsOpen, setContractEducationModalIsOpen] = React.useState(false)
  const [studentUnionModalIsOpen, setStudentUnionModalIsOpen] = React.useState(false)
  const [studentCouncilModalIsOpen, setStudentCouncilModalIsOpen] = React.useState(false)
  const [socialMediaModalIsOpen, setSocialMediaModalIsOpen] = React.useState(false)

  const structureAndSubdivisionsSubcategories = [
    "Ректорат",
    "Приймальна комісія",
    "Підготовче відділення",
    "Відділ міжнародних зв'язків та інф. забезпечення",
    "Бухгалтерія",
    "Відділ платної форми навчання",
    "Профком студентів",
  ]

  const studentCommunitiesSubcategories = ["Студентська рада", "Соц. мережі академії"]

  return (
    <View style={styles.screenBodyContainer}>
      {/*  */}
      <WarningBar text="Триває оновлення даних у зв'язку з реогранізацією." />

      <ScrollView style={styles.container}>
        <Category
          title="Корпуси та факультети"
          titleIcon={
            <Image
              style={{
                width: 14,
                height: 14,
                opacity: 0.5,
              }}
              source={imageIcons.museum}
            />
          }
        >
          <Pressable onPress={() => setCorpsModalIsOpen(true)}>
            <AppText style={styles.subcategoryTitle}>Корпуси академії</AppText>

            {constructContentPresenterModal(
              "Корпуси академії",
              corpsModalIsOpen,
              () => setCorpsModalIsOpen(false),
              corpsModalItems
            )}
          </Pressable>

          <AppText
            onPress={(e) => {
              console.log("executing on press handler as child")

              // @ts-expect-error
              navigation.push("Факультети")
              // e.stopPropagation()
              // e.preventDefault()

              return true
            }}
            style={styles.subcategoryTitle}
          >
            Факультети академії
          </AppText>
        </Category>

        <Category
          title="Структура і підрозділи"
          titleIcon={<Ionicons name="git-merge-outline" size={16} color={palette.text} />}
          subcategories={structureAndSubdivisionsSubcategories}
        >
          <Pressable onPress={() => setRectorateModalIsOpen(true)}>
            {constructContentPresenterModal(
              "Ректорат",
              rectorateModalIsOpen,
              () => setRectorateModalIsOpen(false),
              rectorateModalItems
            )}
            <AppText style={styles.subcategoryTitle}>Ректорат</AppText>
          </Pressable>

          <Pressable onPress={() => setAdmissionCommitteeModalIsOpen(true)}>
            {constructContentPresenterModal(
              "Приймальна комісія",
              admissionCommitteeModalIsOpen,
              () => setAdmissionCommitteeModalIsOpen(false),
              admissionsCommitteeModalItems
            )}
            <AppText style={styles.subcategoryTitle}>Приймальна комісія</AppText>
          </Pressable>

          <Pressable onPress={() => setPreparationDepartmentModalIsOpen(true)}>
            {constructContentPresenterModal(
              "Підготовче відділення",
              preparationDepartmentModalIsOpen,
              () => setPreparationDepartmentModalIsOpen(false),
              preparationDepartmentModalItems
            )}
            <AppText style={styles.subcategoryTitle}>Підготовче відділення</AppText>
          </Pressable>

          <Pressable onPress={() => setInternationalAffairsAndInformationDepartmentModalIsOpen(true)}>
            {constructContentPresenterModal(
              "Відділ міжнародних звʼязків та інф. забезпечення",
              internationalAffairsAndInformationDepartmentModalIsOpen,
              () => setInternationalAffairsAndInformationDepartmentModalIsOpen(false),
              internationalAffairsAndInformationDepartmentModalItems
            )}
            <AppText style={[styles.subcategoryTitle]}>Відділ міжнародних звʼязків{"\n"}та інф. забезпечення</AppText>
          </Pressable>

          <Pressable onPress={() => setAccountingModalIsOpen(true)}>
            {constructContentPresenterModal(
              "Бухгалтерія",
              accountingModalIsOpen,
              () => setAccountingModalIsOpen(false),
              accountingModalItems
            )}
            <AppText style={styles.subcategoryTitle}>Бухгалтерія</AppText>
          </Pressable>

          <Pressable onPress={() => setContractEducationModalIsOpen(true)}>
            {constructContentPresenterModal(
              "Відділ платної форми навчання",
              contractEducationModalIsOpen,
              () => setContractEducationModalIsOpen(false),
              contractEducationDepartmentModalItems
            )}
            <AppText style={styles.subcategoryTitle}>Відділ платної форми навчання</AppText>
          </Pressable>

          <Pressable onPress={() => setStudentUnionModalIsOpen(true)}>
            {constructContentPresenterModal(
              "Профком студентів",
              studentUnionModalIsOpen,
              () => setStudentUnionModalIsOpen(false),
              studentUnionModalItems
            )}
            <AppText style={styles.subcategoryTitle}>Профком студентів</AppText>
          </Pressable>
        </Category>

        <Category
          title="Студентські спільноти"
          titleIcon={<Octicons name="accessibility" size={16} color={palette.text} />}
          onPress={() => {}}
        >
          <Pressable onPress={() => setStudentCouncilModalIsOpen(true)}>
            {constructContentPresenterModal(
              "Студентська рада",
              studentCouncilModalIsOpen,
              () => setStudentCouncilModalIsOpen(false),
              studentCouncilModalItems
            )}
            <AppText style={styles.subcategoryTitle}>Студентська рада</AppText>
          </Pressable>

          <Pressable onPress={() => setSocialMediaModalIsOpen(true)}>
            {constructContentPresenterModal(
              "Соц. мережі академії",
              socialMediaModalIsOpen,
              () => setSocialMediaModalIsOpen(false),
              socialMediaModalItems
            )}
            <AppText style={styles.subcategoryTitle}>Соц. мережі академії</AppText>
          </Pressable>
        </Category>
      </ScrollView>
    </View>
  )
}
