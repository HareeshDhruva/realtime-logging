import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const backend = import.meta.env.VITE_BACKEND;
const socket = io(backend);

const App = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${backend}/logs`)
      .then((response) => {
        setLogs(response.data.logs);
        setLoading(false);
      })
      .catch((error) => console.error(error));

    socket.on('newLog', (newLog) => {
      setLogs((prevLogs) => [newLog, ...prevLogs]);
    });

    return () => socket.off('newLog');
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="app-container">
      <h1>Event Logs (Real-Time)</h1>
      <table className="logs-table">
        <thead>
          <tr>
            <th>Event Type</th>
            <th>Timestamp</th>
            <th>Source App</th>
            <th>Previous Hash</th>
            <th>Current Hash</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td>{log.eventType}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>{log.sourceAppId}</td>
              <td className="hash">{log.previousHash}</td>
              <td className="hash">{log.currentHash}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
