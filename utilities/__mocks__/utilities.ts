// mock getContentfulClient function, but reexport everything else for now

import { AssetCollection } from "contentful"

// TODO: add type
const exampleItems = [
  {
    fields: {
      title: "test title",
      body: "test body",
    },
    sys: {
      createdAt: "2021-04-30T20:00:00.000Z",
    },
  },
]

const exampleAssets: AssetCollection<undefined, string> = {
  items: [
    {
      fields: {
        title: "test title",
        file: {
          url: "example.com",
          fileName: "schedule.json",
        },
      },
      sys: {
        revision: 1,
        createdAt: "2021-04-30T20:00:00.000Z",
        updatedAt: "2021-04-30T20:00:00.000Z",
      },
    },
  ],
}

const mockContentful = {
  createClient: () => {
    return {
      getEntries: () => {
        return Promise.resolve({
          items: exampleItems,
        })
      },

      getAssets: () => {
        return Promise.resolve({
          exampleAssets,
        })
      },
    }
  },
}

console.log("[CONTENTFUL MOCK] Loading contentful mock...")

function getContentfulClient() {
  const client = mockContentful.createClient()
  return client
}

// export * from "../utilities"
const actual = jest.requireActual("../utilities")

const exportObj = {
  ...actual,
  getContentfulClient,
}

module.exports = exportObj
