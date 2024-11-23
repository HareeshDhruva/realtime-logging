const express = require('express');
const router = express.Router();
const Log = require('../model/log');
const { generateHash } = require('../utils/hashing');

router.post('/', async (req, res) => {
  try {
    const { eventType, sourceAppId, dataPayload } = req.body;
    if (!eventType || !sourceAppId || !dataPayload) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const lastLog = await Log.findOne().sort({ timestamp: -1 });
    const previousHash = lastLog ? lastLog.currentHash : 'GENESIS_HASH';
    const newLog = new Log({
      eventType,
      timestamp: new Date(),
      sourceAppId,
      dataPayload,
      previousHash,
      currentHash: generateHash({ eventType, sourceAppId, dataPayload, previousHash }),
    });

    await newLog.save();
    if (req.io) {
      req.io.emit('newLog', newLog);
    }

    res.status(201).json({ message: 'Log created successfully', log: newLog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { eventType, sourceAppId, startDate, endDate, page = 1, limit = 10 } = req.query;
    const query = {};
    if (eventType) query.eventType = eventType;
    if (sourceAppId) query.sourceAppId = sourceAppId;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const logs = await Log.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ timestamp: -1 });

    const total = await Log.countDocuments(query);

    res.status(200).json({ total, page, logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
