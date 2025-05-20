'use client'
import React, { useState } from 'react';

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
      setLogs([...logs].sort((a, b) => a.id - b.id)); // Возвращаем исходный порядок по ID
      return;
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
    <div className="p-5 font-sans">
      <h2 className="text-2xl font-bold mb-5">Logs</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 text-left">№</th>
            <th className="border border-gray-300 p-2 text-left">Log User ID</th>
            <th className="border border-gray-300 p-2 text-left">Log User Name</th>
            <th
              onClick={() => sortLogs('action')}
              className="border border-gray-300 p-2 text-left cursor-pointer relative hover:underline"
            >
              Log Action{' '}
              <span className="ml-1 text-gray-600">
                {activeSort.column === 'action'
                  ? activeSort.direction === 'asc'
                    ? '↑'
                    : activeSort.direction === 'desc'
                      ? '↓'
                      : '↕'
                  : '↕'}
              </span>
            </th>
            <th
              onClick={() => sortLogs('type')}
              className="border border-gray-300 p-2 text-left cursor-pointer relative hover:underline"
            >
              Log User Type{' '}
              <span className="ml-1 text-gray-600">
                {activeSort.column === 'type'
                  ? activeSort.direction === 'asc'
                    ? '↑'
                    : activeSort.direction === 'desc'
                      ? '↓'
                      : '↕'
                  : '↕'}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={log.id}>
              <td className="border border-gray-300 p-2">{index + 1}</td>
              <td className="border border-gray-300 p-2">{log.id}</td>
              <td className="border border-gray-300 p-2">{log.name}</td>
              <td className="border border-gray-300 p-2">{log.action}</td>
              <td className="border border-gray-300 p-2">{log.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogsList;