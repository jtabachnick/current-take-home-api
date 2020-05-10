const { Datastore } = require("@google-cloud/datastore");
const FuzzySearch = require("fuzzy-search");
const { v4: uuid } = require("uuid");

const datastore = new Datastore();

const getVisit = async (visitId) => {
  const query = datastore
    .createQuery("location")
    .filter("visitId", "=", visitId);
  const data = await datastore.runQuery(query);
  return cleanData(data[0]);
};

// exported functions
const saveVisit = async (userId, location) => {
  const locationKey = datastore.key("location");
  const visitId = uuid();
  const created = Date.now();
  const visit = {
    key: locationKey,
    data: {
      userId: userId,
      name: location,
      visitId: visitId,
      visitDate: created,
    },
  };

  await datastore.upsert(visit);
  return { visitId: visitId };
};

const searchVisits = async (userId, searchString) => {
  const data = await listVisits(userId);
  console.log(data[0]);
  let sortedData = sortVisits(data[0]);
  const searcher = new FuzzySearch(sortedData, ["name"], {
    caseSensitive: false,
  });
  const searched = searcher.search(searchString);
  const cleaned = cleanData(searched);
  return cleaned;
};


// helpers 
const cleanData = (visits) => {
  visits.forEach((visit) => {
    delete visit.visitDate;
  });
  return visits;
};

const listVisits = (userId) => {
  const query = datastore.createQuery("location").filter("userId", "=", userId);
  return datastore.runQuery(query);
};

const sortVisits = (visits) => {
  let sortedData = visits.sort((a, b) => (a.visitDate > b.visitDate ? -1 : 1));
  return sortedData.length > 5 ? sortedData.slice(0,5) : sortedData;
};


exports.getVisit = getVisit;
exports.searchVisits = searchVisits;
exports.saveVisit = saveVisit;
