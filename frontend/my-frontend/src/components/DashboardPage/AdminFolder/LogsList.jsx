import React from 'react';
import './LogsList.css'; // Импорт стилей

const LogsList = () => {
  const logs = [
    { id: 4545, name: 'John Doe', action: 'request', type: 'patient' },
    { id: 1234, name: 'Jane Smith', action: 'update', type: 'doctor' },
    { id: 6789, name: 'Bob Johnson', action: 'delete', type: 'patient' },
    // Добавьте другие данные, если нужно
  ];

  return (
    <div className="logs-list">
      <h1 className="logs-title">Logs</h1>
      <table className="logs-table">
        <thead>
          <tr>
            <th>Log User ID</th>
            <th>Log User Name</th>
            <th>Log Action</th>
            <th>Log User Type</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.name}</td>
              <td>{log.action}</td>
              <td>{log.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogsList;
