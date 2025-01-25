import React, { useState } from 'react';
import './LogsList.css'; // Подключение CSS

const LogsList = () => {
  const [logs, setLogs] = useState([
    { id: 4545, name: 'John Doe', action: 'request', type: 'patient' },
    { id: 1234, name: 'Alice Smith', action: 'approve', type: 'doctor' },
    { id: 5678, name: 'Bob Johnson', action: 'reject', type: 'patient' },
    // Добавьте больше данных
  ]);
  const [activeSort, setActiveSort] = useState({ column: '', direction: '' });

  // Функция для сортировки
  const sortLogs = (column) => {
    let direction = 'asc';
    if (activeSort.column === column) {
      if (activeSort.direction === 'asc') direction = 'desc';
      else if (activeSort.direction === 'desc') direction = ''; // Убираем сортировку
    }

    if (direction === '') {
      setActiveSort({ column: '', direction: '' });
      return; // Возвращаем исходный порядок
    }

    const sortedLogs = [...logs].sort((a, b) => {
      if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setLogs(sortedLogs);
    setActiveSort({ column, direction });
  };

  return (
    <div className="logs-list">
      <h2 className="logs-title">Logs</h2>
      <table className="logs-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Log User ID</th>
            <th>Log User Name</th>
            <th onClick={() => sortLogs('action')} className="sortable">
              Log Action{' '}
              {activeSort.column === 'action'
                ? activeSort.direction === 'asc'
                  ? '↑'
                  : activeSort.direction === 'desc'
                  ? '↓'
                  : ''
                : '↕'}
            </th>
            <th onClick={() => sortLogs('type')} className="sortable">
              Log User Type{' '}
              {activeSort.column === 'type'
                ? activeSort.direction === 'asc'
                  ? '↑'
                  : activeSort.direction === 'desc'
                  ? '↓'
                  : ''
                : '↕'}
            </th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={log.id}>
              <td>{index + 1}</td>
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
