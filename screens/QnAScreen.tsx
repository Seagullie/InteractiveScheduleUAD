import { View, StyleSheet, TouchableOpacity } from "react-native"
import { globalStyles, palette } from "../styles/global"
import AppText from "../shared/AppText"
import { useState } from "react"
import Table from "../components/Table"
import { ScrollView } from "react-native-gesture-handler"
import UnfoldableCard, { UCStyles } from "../components/UnfoldableCard"

export default function QnAScreen() {
  return (
    <ScrollView style={UCStyles.container}>
      <UnfoldableCard
        bodyComponent={
          <View style={{ marginTop: 15 }}>
            <Table
              headers={["Адреса корпусу УАД", "Позначення аудиторії в розкладі"]}
              data={[
                ["вул. Під Голоском 19", "а. ХХХ"],
                ["вул. Підвальна 17", "a. Х або а. XX"],
                ["вул. Личаківська 3", "Л. Х"],
                ["вул. Коцюбинського 21", "К. Х"],
                ["вул. Винниченка 12", "В. Х"],
              ]}
              columnWidths={["50%", "50%"]}
            />

            <AppText style={UCStyles.unfoldableCardText}>
              де ХХХ – трицифровий номер аудиторії,{"\n"}Х та ХХ – одно- та двоцифровий номери{"\n"}а Л, К, В – перші
              літери адрес корпусів
            </AppText>
          </View>
        }
        title={"Як зрозуміти, в якому корпусі буде проходити пара?"}
      />

      <UnfoldableCard
        bodyComponent={
          <AppText style={UCStyles.unfoldableCardText}>
            Для швидкого скасування всіх змін, що ви внесли в редакторі, видаліть та повторно завантажте застосунок з
            Google Play.
          </AppText>
        }
        title={"Як анулювати всі зміни, які я зробив у редакторі розкладу?"}
      />

      <UnfoldableCard
        bodyComponent={
          <AppText style={UCStyles.unfoldableCardText}>
            Спробуйте поміняти розклад на суміжній, наприклад: КСГ-33 на КСГ-33_2
          </AppText>
        }
        title={"Багато невідповідностей в розкладі, що робити?"}
      />

      <UnfoldableCard
        bodyComponent={
          <AppText style={UCStyles.unfoldableCardText}>
            Переконайтесь, що в налаштуваннях застосунку у вас: {"\n"}- Увімкнений перемикач «нагадувати про початок
            пари» {"\n"}- Налаштований необхідний час, за який вас застосунок має заздалегідь сповіщати про початок
            пари. {"\n\n"}
            Якщо все так, проте сповіщення все одно не приходять, перевірте налаштування телефону, а саме чи наданий
            дозвіл на сповіщення застосунку «Розклад УАД».{"\n\n"}
            Якщо і ця порада вам не допомогла, напишіть нам на schedule.uad@gmail.com
          </AppText>
        }
        title={"Що робити, якщо мені не приходять сповіщення про початок пар?"}
      />
    </ScrollView>
  )
}
