const express = require('express');
const router = express.Router();
const { PythonShell } = require('python-shell');

router.post('/', async (req, res) => {
  try {
    const { Magnitude, 'Total Deaths': totalDeaths, 'Total Affected': totalAffected, 'Disaster Type': disasterType, Location } = req.body;

    // Validate input
    if (!Magnitude || !totalDeaths || !totalAffected || !disasterType || !Location) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const options = {
      mode: 'text',
      pythonOptions: ['-u'],
      scriptPath: './models',
      args: [
        JSON.stringify({
          magnitude: Magnitude,
          deaths: totalDeaths,
          affected: totalAffected,
          disaster_type: disasterType,
          location: Location
        })
      ]
    };

    PythonShell.run('predict.py', options, (err, results) => {
      if (err) {
        console.error("Python error:", err);
        return res.status(500).json({ error: "Model prediction failed" });
      }

      try {
        const prediction = parseFloat(results[0]);
        if (isNaN(prediction)) {
          throw new Error("Invalid prediction format");
        }

        res.json({
          prediction,
          input_parameters: {
            Magnitude,
            'Total Deaths': totalDeaths,
            'Total Affected': totalAffected,
            'Disaster Type': disasterType,
            Location
          }
        });
      } catch (parseError) {
        console.error("Parse error:", parseError);
        res.status(500).json({ error: "Invalid model output" });
      }
    });
  } catch (error) {
    console.error("Route error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;