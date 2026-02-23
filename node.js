const { PythonShell } = require("python-shell");

function predictGender(inputFeatures) {
  return new Promise((resolve, reject) => {

    const options = {
      mode: "text",
      pythonOptions: ["-u"],
      scriptPath: __dirname,   // safer than "."
      args: [JSON.stringify(inputFeatures)]
    };

    let output = "";
    let errorOutput = "";

    const pyshell = new PythonShell("predictor.py", options);

    pyshell.on("message", message => {
      output += message;
    });

    pyshell.on("stderr", message => {
      errorOutput += message;
    });

    pyshell.end(err => {
      if (err) {
        return reject("Python error: " + err.message + "\n" + errorOutput);
      }

      try {
        const parsed = JSON.parse(output.trim());
        resolve(parsed);
      } catch (e) {
        reject("Invalid JSON from Python:\n" + output);
      }
    });
  });
}


// ---------------- TEST ----------------
const inputFeatures = {
  'battery_level': 83, 'device_tier': 4, 'device_recency': 4, 'device_manufacturer': 'Samsung', 'visit_count': 11, 'device_name': 'Galaxy A55 5G', 'location_region': 'UP', 'location_country': 'IN', 'location_city_tier': 'Tier 2', 'associated_region': 'Northern Plains', 'os_version': '15.0.0', 'network_provider': 'Jio', 'internet_speed': '4g', 'channel': 'google', 'primary_language': 'en-IN', 'city': 'Delhi', 'person_score': 80
};

predictGender(inputFeatures)
  .then(result => console.log("✅ Prediction:", result))
  .catch(err => console.error("❌ Error:", err));