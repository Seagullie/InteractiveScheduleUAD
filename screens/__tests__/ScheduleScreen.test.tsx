import React from "react"
import { View } from "react-native"
import renderer, { ReactTestRendererJSON } from "react-test-renderer"
import ScheduleScreen from "../ScheduleScreen"
import App from "../../App"

function SampleApp() {
  return <View>Sample App</View>
}

describe("<SampleApp />", () => {
  it("has 1 child", () => {
    const tree: ReactTestRendererJSON = renderer.create(<SampleApp />).toJSON()!
    expect(tree.children.length).toBe(1)
  })
})

describe("<ScheduleScreen />", () => {
  it("has 1 child", () => {
    const tree: ReactTestRendererJSON = renderer.create(<ScheduleScreen isEditable={false} />).toJSON()!
    expect(tree.children.length).toBe(1)
  })
})

// import * as React from 'react'
// import {Button, Text, TextInput, View} from 'react-native'
// import {render, screen, fireEvent} from '@testing-library/react-native'

// function Example() {
//   const [name, setUser] = React.useState('')
//   const [show, setShow] = React.useState(false)

//   return (
//     <View>
//       <TextInput value={name} onChangeText={setUser} testID="input" />
//       <Button
//         title="Print Username"
//         onPress={() => {
//           // let's pretend this is making a server request, so it's async
//           // (you'd want to mock this imaginary request in your unit tests)...
//           setTimeout(() => {
//             setShow(true)
//           }, Math.floor(Math.random() * 200))
//         }}
//       />
//       {show && <Text testID="printed-username">{name}</Text>}
//     </View>
//   )
// }

// test('examples of some things', async () => {
//   const expectedUsername = 'Ada Lovelace'

//   render(<Example />)

//   fireEvent.changeText(screen.getByTestId('input'), expectedUsername)
//   fireEvent.press(screen.getByText('Print Username'))

//   // Using `findBy` query to wait for asynchronous operation to finish
//   const usernameOutput = await screen.findByTestId('printed-username')

//   // Using `toHaveTextContent` matcher from `@testing-library/jest-native` package.
//   expect(usernameOutput).toHaveTextContent(expectedUsername)

//   expect(screen.toJSON()).toMatchSnapshot()
// })
