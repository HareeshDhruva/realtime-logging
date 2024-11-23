const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  eventType: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  sourceAppId: { type: String, required: true },
  dataPayload: { type: Object, required: true },
  previousHash: { type: String, required: true },
  currentHash: { type: String, required: true },
});

module.exports = mongoose.model("Log", logSchema);
