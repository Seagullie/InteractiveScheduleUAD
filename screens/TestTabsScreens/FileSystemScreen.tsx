import { useEffect } from "react"
import React from "react"

import { View, Text, StyleSheet, NativeSyntheticEvent, TextInputFocusEventData, Pressable } from "react-native"
import AppText from "../../components/shared/AppText"

import * as FileSystem from "expo-file-system"
import { Button } from "@rneui/themed"
import { Input } from "react-native-elements"
import ContentViewModal from "../../components/ContentViewModal"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { createClient } from "contentful/dist/contentful.browser.min.js"
import { AssetFile, ContentfulClientApi } from "contentful"
import Expander from "../../components/shared/Expander"
import ScheduleLoaderService from "../../services/ScheduleLoaderService/ScheduleLoaderService"
import FlatButton from "../../components/shared/Button"

const pathToSchedules = `assets/schedules/`
// const istSchedule = FileSystem.readAsStringAsync(pathToSchedules + "IST-51M.json")
// const bundledAssetsInfo = FileSystem.getInfoAsync("")

export default function FileSystemScreen() {
  const [bundledAssetsInfo, setBundledAssetsInfo] = React.useState([])

  const [fileContentModalVisible, setFileContentModalVisible] = React.useState(false)
  const [selectedFileContent, setSelectedFileContent] = React.useState("selected file content")

  const [currentDir, setCurrentDir] = React.useState<string>(FileSystem.documentDirectory)
  const [allFiles, setAllFiles] = React.useState<string[]>([])

  const [firstFieldText, setFirstFieldText] = React.useState("")
  const [secondFieldText, setSecondFieldText] = React.useState("")

  const [contentfulSchedule, setContentfulSchedule] = React.useState("")
  const [contentfulScheduleAsAsset, setContentfulScheduleAsAsset] = React.useState("")
  const [contentfulScheduleAsDownloadedAsset, setContentfulScheduleAsDownloadedAsset] = React.useState("")
  const [allContentfulAssets, setAllContentfulAssets] = React.useState("")

  const saveToFile = async () => {
    const text = firstFieldText + "\n" + secondFieldText

    const path = FileSystem.documentDirectory + "test.txt"
    const content = text

    await FileSystem.writeAsStringAsync(path, content)

    const info = await FileSystem.getInfoAsync(path)
    console.log("save successful. file info:")
    console.log(info)
  }

  useEffect(() => {
    async function init() {
      // const info = await FileSystem.readDirectoryAsync(FileSystem.bundleDirectory)
      // console.log("bundled assets info:")
      // console.log(info)

      let allFiles = await FileSystem.readDirectoryAsync(currentDir)

      console.log("all files:")
      console.log(allFiles)
      setAllFiles(allFiles)

      const client: ContentfulClientApi<undefiend> = createClient({
        space: "ude6y2h1h61l",
        environment: "master", // defaults to 'master' if not set
        accessToken: "hQc8OI2VQrAnLLSWSpflQyByQUZ_t5ct1Ed8axAu7M0",
      })

      client
        .getEntry("4DlBdNKIvYPma8B18WwQsJ")
        .then((entry) => {
          console.log(entry)
          setContentfulSchedule(JSON.stringify(entry, null, 4))
        })
        .catch((e) => {
          console.error("fetching contentful schedule failed:")
          console.error(e)
        })

      client
        .getAsset("2wFiyBYGXQbdRvtnSAS8Xm")
        .then((asset) => {
          console.log(asset)
          setContentfulScheduleAsAsset(JSON.stringify(asset, null, 4))
          const file: AssetFile = asset.fields.file

          const protocol = "https:"
          const linkToFile = file.url
          FileSystem.downloadAsync(protocol + linkToFile, FileSystem.documentDirectory + file.fileName, {}).then(
            (res) => {
              console.log("downloaded file:")
              console.log(res)

              FileSystem.readAsStringAsync(res.uri).then((content) => {
                setContentfulScheduleAsDownloadedAsset(content)
              })
            }
          )
        })
        .catch((e) => {
          console.error("fetching contentful schedule as asset failed:")
          console.error(e)

          setContentfulScheduleAsAsset("failed to download the asset")
          setContentfulScheduleAsDownloadedAsset("failed to download the asset")
        })

      client.getAssets().then((assets) => {
        console.log(assets)

        let assetNames: string[] = []

        if (assets.items.length !== 0) {
          assetNames = assets.items.map((a) => a.fields.file.fileName)
        }

        setAllContentfulAssets(JSON.stringify(assetNames, null, 4))
      })

      await initFields()

      // for testing purposes:
      let scheudleLoaderInstance = ScheduleLoaderService.GetInstance()
    }

    init()
  }, [])

  async function initFields() {
    // read from test.txt
    const path = FileSystem.documentDirectory + "test.txt"

    let content: string

    try {
      content = await FileSystem.readAsStringAsync(path)
    } catch (e) {
      content = "a\nb"
    }
    const lines = content.split("\n")

    setFirstFieldText(lines[0])
    setSecondFieldText(lines[1])
  }

  return (
    <View style={styles.container}>
      <View>
        <Input onChangeText={(text) => setFirstFieldText(text)} value={firstFieldText} />
        <Input onChangeText={(text) => setSecondFieldText(text)} value={secondFieldText} />
      </View>
      <View style={{ flexDirection: "row" }}>
        <Button color={"success"} title={"Зберегти"} onPress={() => saveToFile()} />
        <Button color={"error"} title={"Скасувати"} onPress={() => initFields()} />
      </View>
      <View>
        <FlatButton
          text={"Усі Файли"}
          onPress={() => {
            setCurrentDir(FileSystem.documentDirectory)
            FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then((content) => {
              setAllFiles(content)
            })
          }}
        />
        <ScrollView>
          {allFiles.map((f, idx) => (
            <TouchableOpacity
              key={idx}
              onLongPress={() => {
                FileSystem.deleteAsync(currentDir + f).then(() => {
                  setAllFiles(allFiles.filter((file) => file !== f))
                })
              }}
              onPress={async () => {
                let isFolder = (await FileSystem.getInfoAsync(FileSystem.documentDirectory + f)).isDirectory

                if (isFolder) {
                  setCurrentDir(FileSystem.documentDirectory + f + "/")
                  FileSystem.readDirectoryAsync(FileSystem.documentDirectory + f).then((content) => {
                    setAllFiles(content)
                  })
                } else {
                  FileSystem.readAsStringAsync(currentDir + f).then((content) => {
                    setSelectedFileContent(content)
                    setFileContentModalVisible(true)
                  })
                }
              }}
            >
              <AppText>{f}</AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View>
        <AppText style={{ color: "red" }}>Файли, що йдуть разом з додатком (не працює):</AppText>
        <View></View>
      </View>
      <View>
        <Expander header="Contentful Entry тест">
          <ScrollView style={{ height: 500 }}>
            <AppText>{contentfulSchedule}</AppText>
          </ScrollView>
        </Expander>
      </View>
      <View>
        <Expander header="Contentful Asset Test">
          <ScrollView style={{ height: 200 }}>
            <AppText>{contentfulScheduleAsAsset}</AppText>
          </ScrollView>
        </Expander>
      </View>
      <View>
        <Expander header="Contentful Asset As Downloaded File Test">
          <ScrollView style={{ height: 200 }}>
            <AppText>{contentfulScheduleAsDownloadedAsset}</AppText>
          </ScrollView>
        </Expander>
      </View>
      <View>
        <Expander header="All Contentful Assets">
          <ScrollView style={{ height: 200 }}>
            <AppText>{allContentfulAssets}</AppText>
          </ScrollView>
        </Expander>
      </View>

      <ContentViewModal visible={fileContentModalVisible} closeModal={() => setFileContentModalVisible(false)}>
        <AppText>{selectedFileContent}</AppText>
      </ContentViewModal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
