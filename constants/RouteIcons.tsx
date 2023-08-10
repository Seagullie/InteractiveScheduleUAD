import { Ionicons, FontAwesome5 } from "@expo/vector-icons"
import { DrawerRoutes } from "../routes/DrawerRoutes"

const RouteIcons = {
  [DrawerRoutes.VIEWER]: <Ionicons name="calendar" color={"white"} size={18} />,
  [DrawerRoutes.REGLAMENT]: <Ionicons name="time-sharp" color={"white"} size={18} />,
  [DrawerRoutes.TEACHERS]: <FontAwesome5 name="user-graduate" color={"white"} size={18} />,
  [DrawerRoutes.CONTACTS]: <Ionicons name="call" color={"white"} size={18} />,
  [DrawerRoutes.NEWS]: <Ionicons name="chatbox-ellipses" color={"white"} size={18} />,

  [DrawerRoutes.TESTS]: <Ionicons name="flask" color={"white"} size={18} />,
  [DrawerRoutes.EDITOR]: <Ionicons name="options" color={"white"} size={18} />,
  [DrawerRoutes.SETTINGS]: <FontAwesome5 name="cog" color={"white"} size={18} />,
  [DrawerRoutes.ABOUT]: <Ionicons name="information-circle" color={"white"} size={18} />,
}

export default RouteIcons
