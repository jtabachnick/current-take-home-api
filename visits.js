const { Datastore } = require("@google-cloud/datastore");
const Fuse = require("fuse.js");
const { v4: uuid } = require("uuid");

const datastore = new Datastore();

const getVisit = async (visitId) => {
  // create the db query of location entities
  // filtering by visitId
  const query = datastore
    .createQuery("location")
    .filter("visitId", "=", visitId);

  // running the query and waiting for the repsonse
  const data = await datastore.runQuery(query);

  // cleaning out unneeded properties for response
  return cleanData(data[0]);
};

// exported functions
const saveVisit = async (userId, location) => {
  // database key needed for import
  const locationKey = datastore.key("location");

  // unique identifier for individual gets
  const visitId = uuid();

  // created date for recency sorting on search
  const created = Date.now();
  
  // creating entity
  const visit = {
    key: locationKey,
    data: {
      userId: userId,
      name: location,
      visitId: visitId,
      visitDate: created,
    },
  };

  // saving entity
  await datastore.upsert(visit);

  //return unique identifier
  return { visitId: visitId };
};

const searchVisits = async (userId, searchString) => {
  // retrieve the visits by user before sorting and searching
  const data = await listVisits(userId);

  // sort by most recent and return the 5 most recent
  let sortedData = sortVisits(data[0]);

  // fuzzy search the sorted list
  const fuse = new Fuse(sortedData, {
    keys: ['name']
  });
  const searched = fuse.search(searchString);

  // clean the searched list for response
  return cleanData(searched.map(s => s.item));
};


// helpers 
const cleanData = (visits) => {
  // visit date is only used for sorting by date not needed in response
  visits.forEach((visit) => {
    delete visit.visitDate;
  });
  return visits;
};

// gets all visits by user
const listVisits = (userId) => {
  const query = datastore.createQuery("location").filter("userId", "=", userId);
  return datastore.runQuery(query);
};

// sorts visits by date
const sortVisits = (visits) => {
  let sortedData = visits.sort((a, b) => (a.visitDate > b.visitDate ? -1 : 1));
  return sortedData.length > 5 ? sortedData.slice(0,5) : sortedData;
};


exports.getVisit = getVisit;
exports.searchVisits = searchVisits;
exports.saveVisit = saveVisit;
