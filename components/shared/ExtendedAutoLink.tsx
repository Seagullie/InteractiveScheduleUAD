import React from "react"
import Autolink, { AutolinkComponentProps } from "react-native-autolink"
import AppText from "../../components/shared/AppText"

type Part = { text: string; url: string }

/**
 * CustomAutolink component. In addition to the functionality of the Autolink component, it also supports Markdown-style links.
 */
export const CustomAutolink = (props: AutolinkComponentProps) => {
  const { text, ...rest } = props

  // Regular expression to match Markdown-style links
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g

  // Parse the text to handle Markdown-style links
  const parseMarkdownLinks = (inputText: string) => {
    let lastIndex = 0
    const result: (Part | string)[] = []

    inputText.replace(markdownLinkRegex, (match, linkText, url, offset) => {
      if (offset > lastIndex) {
        result.push(inputText.slice(lastIndex, offset))
      }
      result.push({ text: linkText, url })
      lastIndex = offset + match.length

      return ""
    })

    if (lastIndex < inputText.length) {
      result.push(inputText.slice(lastIndex))
    }

    return result
  }

  const parsedText = parseMarkdownLinks(text)

  return (
    <AppText>
      {parsedText.map((part, index) => {
        if (typeof part === "string") {
          return <Autolink key={index} text={part} {...rest} />
        } else {
          return (
            <AppText key={index} style={props.linkStyle} onPress={() => props.onPress && props.onPress(part.url, null)}>
              {part.text}
            </AppText>
          )
        }
      })}
    </AppText>
  )
}

// function constructLinkElement(text: string, link: string) {
//   return (
//     <AppText
//       onPress={() => {
//         Linking.openURL(link)
//       }}
//       style={[{ textDecorationLine: "none", marginBottom: 0 }]}
//     >
//       {text}
//     </AppText>
//   )
// }
