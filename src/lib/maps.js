const googleMapsClient = require("@google/maps").createClient({
  key: process.env.GMAPS_APIKEY,
  Promise: Promise
});

const findPlace = async function(inputText) {
  try {
    if (inputText && inputText !== "") {
      const response = await googleMapsClient
        .findPlace({
          input: inputText,
          inputtype: "textquery",
          language: "fr",
          fields: ["formatted_address", "place_id"]
        })
        .asPromise();

      const { json } = response;

      return json.candidates;
    }

    return [];
  } catch (err) {
    console.log("err", err);
  }
};

module.exports = {
  findPlace
};
