import React from "react"
import { View, Text, StyleSheet } from "react-native"
import AppText from "./shared/AppText"
import { FontName } from "../constants/Fonts"

interface TableProps {
  headers: string[]
  data: string[][]
  columnWidths: number | string[]
}

const Table: React.FC<TableProps> = ({ headers, data, columnWidths }) => {
  const colsN = data[0].length
  const rowsN = data.length

  return (
    <View style={styles.table}>
      <View style={styles.tableRow}>
        {headers.map((header, index) => (
          <View
            key={index}
            style={[
              styles.tableHeaderCell,
              { maxWidth: columnWidths[index], minWidth: columnWidths[index] },
              index === colsN - 1 ? { borderRightWidth: 0 } : {},
            ]}
          >
            <AppText>{header}</AppText>
          </View>
        ))}
      </View>
      {data.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.tableRow}>
          {row.map((cell, cellIndex) => (
            <View
              key={cellIndex}
              style={[
                styles.tableCell,
                {
                  maxWidth: columnWidths[cellIndex],
                  minWidth: columnWidths[cellIndex],
                },
                cellIndex === colsN - 1 ? { borderRightWidth: 0 } : {},
              ]}
            >
              <AppText
                style={{
                  fontFamily: FontName.MontserratRegular,
                }}
              >
                {cell}
              </AppText>
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}

const tableBorderColor = "#B9B9B9"
const tableBorderWidth = 1

const sharedCellStyle = {
  padding: 10,
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  //   height: "100%",
}

const styles = StyleSheet.create({
  table: {
    borderWidth: tableBorderWidth,
    // borderRightWidth: 2,
    borderRadius: 7,
    borderColor: tableBorderColor,
    // margin: 10,

    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderColor: tableBorderColor,
  },

  tableHeaderCell: {
    ...sharedCellStyle, // Include shared cell styles
    // fontWeight: "bold",
    fontFamily: FontName.MontserratMedium,
    fontSize: 12,
    borderRightWidth: tableBorderWidth,
    borderColor: tableBorderColor,

    backgroundColor: "rgba(0,0,0,0.06)",
  },
  tableCell: {
    ...sharedCellStyle, // Include shared cell styles
    borderWidth: 0,
    borderTopWidth: tableBorderWidth,
    borderRightWidth: tableBorderWidth,
    borderColor: tableBorderColor,
    // backgroundColor: "orange",
  },
})

export default Table
