import React from 'react';
import Button from 'react-bootstrap/Button';
import { clearLogs } from '../services/logService';
import { verifyPassword } from '../services/fileService';
import { convertLogsToHTML } from '../utils/helpers';
import useApi from '../hooks/useApi'; // useApi 훅을 임포트합니다.

const LogData = ({ logs, setLogs }) => {
  // clearLogs API 호출을 위한 useApi 훅을 사용합니다. 에러 상태도 함께 관리됩니다.
  const { request: clearLogsRequest, error: clearLogsError } = useApi(clearLogs);

  const handleClearLogs = async () => {
    const passwordInput = prompt("Please enter the password to clear logs:");
    if (!passwordInput) return;

    const isPasswordValid = await verifyPassword(passwordInput, 'delete');
    if (!isPasswordValid) {
      alert('Invalid password');
      return;
    }

    // useApi 훅을 사용하여 로그 클리어 API 호출을 수행합니다.
    await clearLogsRequest(passwordInput);
    // 에러가 없으면 로그 상태를 초기화합니다.
    if (!clearLogsError) {
      setLogs('');
    } else {
      // 에러가 있으면 에러 메시지를 표시합니다.
      alert(`Error clearing logs: ${clearLogsError}`);
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
