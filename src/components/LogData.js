import React from 'react';
import Button from 'react-bootstrap/Button';
import { clearLogs } from '../services/logService';
import { verifyPassword } from '../services/fileService'; // 필요한 함수를 임포트합니다.
import { convertLogsToHTML } from '../utils/helpers';

const LogData = ({ logs, setLogs }) => {
  const handleClearLogs = async () => {
    const passwordInput = prompt("Please enter the password to clear logs:");
    if (passwordInput) {
      const isPasswordValid = await verifyPassword(passwordInput, 'clearLogs');
      if (isPasswordValid) {
        try {
          await clearLogs();
          setLogs('');
        } catch (error) {
          alert(error.message);
        }
      } else {
        alert('Invalid password');
      }
    }
  };

  const logsHTML = logs ? convertLogsToHTML(logs) : '';

  return (
    <div className="log-data">
      <h2>Today's Logs</h2>
      <div dangerouslySetInnerHTML={{ __html: logsHTML }} />
      <Button onClick={handleClearLogs} className="button-style">Clear Logs</Button>
    </div>
  );
};

export default LogData;
