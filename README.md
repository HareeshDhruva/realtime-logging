﻿# realtime-event-logging
 
Event Logging System Setup and Testing Guide
This guide walks you through the setup and testing process for the Event Logging System, including frontend access, sending logs via API, and verifying the logs.

## Overview
The Event Logging System allows you to send event logs from client applications and stores them in a tamper-proof way. The logs are accessible via a web frontend, and they can be queried or displayed in real-time.

Frontend URL: https://realtime-logging.onrender.com
Backend API URL: https://realtime-logging.onrender.com/logs/
## Frontend Access
You can access the Event Logging System’s frontend using the following URL:

https://realtime-logging.onrender.com

This page allows you to view the event logs in real-time, with new logs being added dynamically.

## Send Event Data to the Backend
To test the logging system, you will send event data via the POST method to the /logs/ API endpoint.

API Endpoint:
POST https://realtime-logging.onrender.com/logs/
Request Payload (JSON):
Use the following JSON structure to send event logs:

```
{
  "eventType": "userVerified",
  "sourceAppId": "app_400",
  "dataPayload": {
    "userId": "u_678"
  }
}
```
