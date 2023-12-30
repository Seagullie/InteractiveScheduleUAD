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
  const pathToFontsFolder = "../assets/fonts/"

  const FONTS = {
    [FontName.LatoRegular]: require(`${pathToFontsFolder}Lato-Regular.ttf`),
    [FontName.LatoBold]: require(`${pathToFontsFolder}Lato-Bold.ttf`),
    [FontName.CinzelRegular]: require(`${pathToFontsFolder}CinzelDecorative-Regular.ttf`),

    [FontName.MontserratRegular]: require(`${pathToFontsFolder}Montserrat-Regular.ttf`),
    [FontName.MontserratMedium]: require(`${pathToFontsFolder}Montserrat-Medium.ttf`),
    [FontName.MontserratSemiBold]: require(`${pathToFontsFolder}Montserrat-SemiBold.ttf`),

    [FontName.RalewayRegular]: require(`${pathToFontsFolder}Raleway-Regular.ttf`),
    [FontName.RalewayMedium]: require(`${pathToFontsFolder}Raleway-Medium.ttf`),
    [FontName.Raleway500]: require(`${pathToFontsFolder}Raleway-Regular.ttf`),
    [FontName.Raleway600]: require(`${pathToFontsFolder}Raleway-Medium.ttf`),

    [FontName.Montserrat500]: require(`${pathToFontsFolder}Montserrat-Medium.ttf`),
    [FontName.Montserrat600]: require(`${pathToFontsFolder}Montserrat-SemiBold.ttf`),
    [FontName.MontserratBold]: require(`${pathToFontsFolder}Montserrat-Bold.ttf`),

    [FontName.CenturyGothic]: require(`${pathToFontsFolder}CenturyGothic.ttf`),
    [FontName.CenturyGothicBold]: require(`${pathToFontsFolder}GOTHICB.ttf`),
    [FontName.CenturyGothicItalic]: require(`${pathToFontsFolder}GOTHICI.ttf`),
  }

  return FONTS
}
