# current-take-home-api

## base url: `https://current-take-home-api.uk.r.appspot.com/`

### possible requests

1. GET `<url>/visit?visitId=<visitId>`

   - returns single object in an array containing name of the location, userId and visitId

   ```
        [{
            userId: "sampleUser",
            name: "locationName",
            visitID: "2f37ca50-e2f2-4395-acd9-3ab8b79f2dc1"
        }]
    ```

2. GET `<url>/visit?userId=<userId>&searchString=<searchString>`
    - returns an array of filtered objects belonging to a user which will fuzzy match the search term

   ```
        [{
            userId: "sampleUser",
            name: "locationName",
            visitID: "2f37ca50-e2f2-4395-acd9-3ab8b79f2dc1"
        },{
            userId: "sampleUser",
            name: "locationName2",
            visitID: "521e3e4a-615c-476b-aacf-44580b44dad1"
        },{
            userId: "sampleUser",
            name: "locationName3",
            visitID: "06302ec0-1393-49c7-b86f-1aabb5741f51"
        }]
    ```

3. POST `<url>/vist`
    - Body: 
    ```
    {
        "userId": <userId>,
        "name": <location name>
    }
    ```
    - Will add a new visit to the database responding with the visitId 
    ```
    {visitId: "00481c40-f970-4a90-bed9-b68d91f43346"}
    ```


## Technical details
This API is built with Express and Google Datastore. The data model in Datastore looks like this 
```
{
    userId: string;
    name: string;
    visitId: UUID;
    visitedDate: number;
}
```

The properties in the data model are all indexed, although this is probably not necessary for the date and name as those are not used for queries in the this implementation. These could be useful as queryable properties in an expanded version of this API so they are indexed now to prevent spending time indexing in the future. 

### Running the API
To run the API locally clone this repository and run the following commands:
```
npm install
```

and 

```
node server.js or npm run start
```


Additionally, you will need a `key.json` file which will allow access to my database (can be provided upon request), alternatively you could supply your own on [Google Cloud Platform](https://cloud.google.com/datastore/).

### Running tests

There are unit tests for the API they can be run by running the following command
```
npm run test
```

Notes on testing: I would have liked to get more test coverage, which probably could have been accomplished by creating wrappers for all of the external packages and using jest to mock them. However I ran short on time and was unable to do this. 

### Dependencies

- [Google Cloud Datastore](https://www.npmjs.com/package/@google-cloud/datastore)
  - NoSQL database managed by Google
  - This project could certainly have been done with a SQL database, but this API was easy to use and I like the flexibility it provide while working through the problem. 
- [Body Parser](https://www.npmjs.com/package/body-parser)
  - Used to parse the JSON body of the incoming post request
- [Express](https://www.npmjs.com/package/express)
  - API framework for handling request, respose and routing. 
- [Fuse.js](https://www.npmjs.com/package/fuse.js)
  - Simple implemenation of fuzzy search that met requirements with no additional dependencies.
  - tried out [Fuzzy-Search](https://www.npmjs.com/package/fuzzy-search) as well, but did not handle spaces well
- [UUID](https://www.npmjs.com/package/uuid)
  - Used to create unique ID for each visit
  - I could have found a way create/display the built in unique identifier from Google's Datastore, but I found using this package made for a simpler implementation
