const request = require("request");

exports.handler = function(event, context, callback) {
  // const key = "1QTF579Jt7SFprh2ITQ6SJLwKPBXsE9yS7QmoMlct4TU";
  // const url = "https://spreadsheets.google.com/feeds/list/"+key+"/od6/public/values?alt=json&key=AIzaSyC5BT5fHmDf2FBUTIlqLpPUdz2twCV8oms";
  const url = "https://sheets.googleapis.com/v4/spreadsheets/1QTF579Jt7SFprh2ITQ6SJLwKPBXsE9yS7QmoMlct4TU/values/Sheet1?alt=json&key=AIzaSyC5BT5fHmDf2FBUTIlqLpPUdz2twCV8oms";

  request({
    json: true,
    url: url
  }, function (error, response, body) {
    if (error || response.statusCode !== 200) return

    console.log(body)
    return

    let parsed = body.feed.entry.map( (entry) => {
      let columns = {
        "updated": entry.updated["$t"]
      }
      console.log('entry ', entry)

      // Dynamically add all relevant columns from the Sheets to the response
      Object.keys( entry ).forEach( (key) => {
        if ( /gsx\$/.test(key) ) {
          let newKey = key.replace("gsx$", "");
          columns[newKey] = entry[key]["$t"];
        }
      });

      return columns;
    })

    callback(null, parsed);
  });
};
