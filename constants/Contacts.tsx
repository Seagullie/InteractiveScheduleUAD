import { FontAwesome, Ionicons } from "@expo/vector-icons"
import React from "react"
import { Image } from "react-native-elements"
import { imageIcons, palette } from "../styles/global"
import AppText from "../shared/AppText"
import { View } from "react-native"

export type ModalItem = {
  icon: JSX.Element
  text: string
  isPhone?: boolean
  isLink?: boolean
  linkName?: string
}

let academyCorps = [
  "вул. Під Голоском, 19",
  "вул. Підвальна, 17",
  "вул. Личаківська, 3",
  "вул. Коцюбинського, 21",
  "вул. Винниченка, 12",
]

// Корпуси академії
export const corpsModalItems = academyCorps.map((corps) => {
  return {
    text: corps,
    icon: <Ionicons name="location" color={palette.grayedOut} size={16} />,
  }
})

// Ректорат
export const rectorateModalItems: ModalItem[] = [
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
export const preparationDepartmentModalItems: ModalItem[] = [
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
export const internationalAffairsAndInformationDepartmentModalItems: ModalItem[] = [
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
export const admissionsCommitteeModalItems: ModalItem[] = [
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
export const accountingModalItems: ModalItem[] = [
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
export const contractEducationDepartmentModalItems: ModalItem[] = [
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
export const studentUnionModalItems: ModalItem[] = [
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
export const studentCouncilModalItems: ModalItem[] = [
  {
    icon: <FontAwesome name="instagram" color={palette.grayedOut} size={16} />,
    text: "https://www.instagram.com/uad_lviv/",
    isLink: true,
    linkName: "uad_lviv",
  },
]

// Соц. мережі академії
export const socialMediaModalItems: ModalItem[] = [
  {
    icon: (
      <View style={{ marginLeft: 2 }}>
        <FontAwesome name="instagram" color={palette.grayedOut} size={16} />
      </View>
    ),

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
