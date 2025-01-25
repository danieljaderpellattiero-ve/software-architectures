import React from 'react'
import './LogsList.css'
const LogsList = () => {
    const logs = [
        { userid: 4545, username: 'John Doe', usertype: 'patient' , useraction: 'request'},  ];
  return (
    <div className='logs-list'>
        {logs.map((log) => (
        <div className='log-card'>
             <div className='log-info'>
                <span className='log-title'>Log User ID: </span><span className='log-detail'>{log.userid}</span>
                <span className='log-title'>Log User Name: </span><span className='log-detail' >{log.username}</span>
                <span className='log-title'>Log Action:  </span><span className='log-detail'>{log.useraction}</span>
                <span className='log-title'>Log User Type: </span><span className='log-detail'>{log.usertype}</span>
             </div>
        </div>
        ))}
        
    </div>
  )
}

export default LogsList