// you can use their client as reference:

// export default class ContentfulClient {
//   private client: ContentfulClientApi;

//     private static instance: ContentfulClient;

//   GetInstance(): ContentfulClient {
//     if (!ContentfulClient.instance) {
//         ContentfulClient.instance = new ContentfulClient();
//     }
//     return ContentfulClient.instance}

//   constructor() {
//     this.client = createClient({
//       space: process.env.CONTENTFUL_SPACE_ID,
//       accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
//     });
//   }

//   async getEntries<T>(query: QueryOptions): Promise<EntryCollection<T>> {
//     return this.client.getEntries<T>(query);
//   }
// }
