import React from "react"
import { FallbackProps } from "react-error-boundary"
import { Text } from "react-native"
import { ScrollView } from "react-native-gesture-handler"

export function showErrorView({ error, resetErrorBoundary }: FallbackProps) {
  const e = error
  return (
    <ScrollView>
      <Text style={{ color: "red" }}>
        Something went wrong. Something went wrong. Something went wrong. Something went wrong. Something went wrong.
        Something went wrong.
      </Text>
      <Text style={{ color: "red" }}>
        Something went wrong. Something went wrong. Something went wrong. Something went wrong. Something went wrong.
        Something went wrong.
      </Text>
      <Text style={{ color: "red" }}>
        Something went wrong. Something went wrong. Something went wrong. Something went wrong. Something went wrong.
        Something went wrong.
      </Text>
      <Text>
        {JSON.stringify(e.message, null, 4)}
        {JSON.stringify(e.stack, null, 4)}
      </Text>
    </ScrollView>
  )
}
