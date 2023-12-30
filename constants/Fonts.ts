export enum FontName {
  LatoRegular = "lato-regular",
  LatoBold = "lato-bold",
  CinzelRegular = "cinzel-regular",

  MontserratRegular = "montserrat-regular",
  MontserratMedium = "montserrat-medium",
  MontserratSemiBold = "montserrat-semibold",

  RalewayRegular = "raleway-regular",
  RalewayMedium = "raleway-medium",

  Montserrat500 = "montserrat-500",
  Montserrat600 = "montserrat-600",

  MontserratBold = "montserrat-bold",
  Raleway500 = "raleway-500",
  Raleway600 = "raleway-600",

  CenturyGothic = "century-gothic",
  CenturyGothicBold = "century-gothic-bold",
  CenturyGothicItalic = "century-gothic-italic",
}

export function GetAllAppFonts() {
  //   const pathToFontsFolder = "../assets/fonts/"
  //  path to fonts folder is hardcoded  because  require() doesn't work with interpolated strings

  const FONTS = {
    [FontName.LatoRegular]: require("../assets/fonts/Lato-Regular.ttf"),
    [FontName.LatoBold]: require("../assets/fonts/Lato-Bold.ttf"),
    [FontName.CinzelRegular]: require("../assets/fonts/CinzelDecorative-Regular.ttf"),

    [FontName.MontserratRegular]: require("../assets/fonts/Montserrat-Regular.ttf"),
    [FontName.MontserratMedium]: require("../assets/fonts/Montserrat-Medium.ttf"),
    [FontName.MontserratSemiBold]: require("../assets/fonts/Montserrat-SemiBold.ttf"),

    [FontName.RalewayRegular]: require("../assets/fonts/Raleway-Regular.ttf"),
    [FontName.RalewayMedium]: require("../assets/fonts/Raleway-Medium.ttf"),
    [FontName.Raleway500]: require("../assets/fonts/Raleway-Regular.ttf"),
    [FontName.Raleway600]: require("../assets/fonts/Raleway-Medium.ttf"),

    [FontName.Montserrat500]: require("../assets/fonts/Montserrat-Medium.ttf"),
    [FontName.Montserrat600]: require("../assets/fonts/Montserrat-SemiBold.ttf"),
    [FontName.MontserratBold]: require("../assets/fonts/Montserrat-Bold.ttf"),

    [FontName.CenturyGothic]: require("../assets/fonts/CenturyGothic.ttf"),
    [FontName.CenturyGothicBold]: require("../assets/fonts/GOTHICB.ttf"),
    [FontName.CenturyGothicItalic]: require("../assets/fonts/GOTHICI.ttf"),
  }

  return FONTS
}
