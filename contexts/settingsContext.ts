import React from "react"
import SettingsService from "../services/SettingsService"

export const SettingsContext = React.createContext<SettingsService | null>(null)
