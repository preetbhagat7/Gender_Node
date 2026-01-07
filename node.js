const { PythonShell } = require("python-shell");

function predictGender(inputFeatures) {
  return new Promise((resolve, reject) => {
    const options = {
      mode: "text",
      pythonOptions: ["-u"],
      scriptPath: ".",
      args: [JSON.stringify(inputFeatures)]
    };

    let output = "";

    const pyshell = new PythonShell("predictor.py", options);

    pyshell.on("message", message => {
      output += message;
    });

    pyshell.end(err => {
      if (err) return reject(err);
      try {
        resolve(JSON.parse(output));
      } catch (e) {
        reject("Invalid JSON from Python: " + output);
      }
    });
  });
}

// ---------------- TEST ----------------
const inputFeatures = {
  "s.brand": "w-for-women",
  "device_tier": 4,
  "device_name": "Reno10 Pro 5G",
  "device_recency": 4,
  "device_manufacturer": "Oppo",
  "visit_count": 10,
  "session_duration_sec": 24,
  "channel": "facebook",
  "location_city": "Varanasi",
  "location_region": "UP",
  "location_country": "IN",
  "location_city_tier": "Tier 3",
  "landing_page_handle": "red-embellished-flared-kurta",
  "is_bounced": 0,
  "is_engaged": 1,
  "person_score": 70,
  "intent_score": 61,
  "os_name": "Android",
  "os_version": "15.0.0",
  "network_provider": "Jio",
  "internet_speed": "4g",
  "battery_level": 74,
  "is_battery_charging": 0,
  "primary_language": "en-GB",
  "associated_region": "Northern Plains",
  "is_engaged_session": 1,
  "is_bounced_session": 0,
  "hour_key": 0,
  "is_returned": 0,
  "session_intensity": 0
};

predictGender(inputFeatures)
  .then(result => console.log("✅ Prediction:", result))
  .catch(err => console.error("❌ Error:", err));
