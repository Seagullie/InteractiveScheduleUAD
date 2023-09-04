import { View, StyleSheet, TouchableOpacity } from "react-native"
import { globalStyles, palette } from "../styles/global"
import AppText from "../shared/AppText"
import { useState } from "react"

function UnfoldableCard({ title, bodyComponent }: { title: string; bodyComponent: JSX.Element }) {
  let [isBodyRevealed, setIsBodyRevealed] = useState(false)

  return (
    <View style={{ marginBottom: 12 }}>
      <View style={styles.unfoldableCard}>
        {/* title | question */}

        <View style={[globalStyles.horizontalCenteredFlex]}>
          <AppText style={{ fontFamily: "raleway-medium", fontSize: 15, flex: 1, lineHeight: 20 }}>{title}</AppText>

          {/* reveal button */}
          <TouchableOpacity onPress={() => setIsBodyRevealed(!isBodyRevealed)} style={styles.revealButton}>
            <AppText style={{ fontFamily: "century-gothic", color: palette.textOnBackground, fontSize: 36 }}>
              {!isBodyRevealed ? "+" : "-"}
            </AppText>
          </TouchableOpacity>
        </View>

        {/* answer */}

        {isBodyRevealed ? <AppText style={styles.unfoldableCardText}> {bodyComponent} </AppText> : <></>}
      </View>
    </View>
  )
}

export default function QnAScreen() {
  return (
    <View style={styles.container}>
      <UnfoldableCard
        bodyComponent={
          <AppText style={styles.unfoldableCardText}>
            Для швидкого скасування всіх змін, що ви внесли в редакторі, необхідно видалити та повторно викачати
            застосунок з Google Play.
          </AppText>
        }
        title={"Як анулювати всі зміни, які я зробив у редакторі розкладу?"}
      />

      <UnfoldableCard
        bodyComponent={
          <AppText style={styles.unfoldableCardText}>
            Для швидкого скасування всіх змін, що ви внесли в редакторі, необхідно видалити та повторно викачати
            застосунок з Google Play.
          </AppText>
        }
        title={"Як зрозуміти, в якому корпусі буде проходити пара?"}
      />

      <UnfoldableCard
        bodyComponent={
          <AppText style={styles.unfoldableCardText}>
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.backgroundLight,
    padding: 10,
    paddingTop: 16,
  },

  unfoldableCard: {
    ...globalStyles.card,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  unfoldableCardText: {
    marginVertical: 15,
    fontFamily: "raleway-regular",
    fontSize: 14,
    lineHeight: 1.3 * 14,
  },

  revealButton: {
    ...globalStyles.navigationButton,
    width: 30,
    borderColor: "transparent", // TODO: create separate reveal button instead of transforming navigation button to desired shape
    paddingVertical: 0,
  },
})
