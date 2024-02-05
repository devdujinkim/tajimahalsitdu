const apiURL = "https://api.tajimahalsitdu.it";

// 오늘의 로그 데이터 가져오기
export const fetchTodayLogs = async () => {
  const response = await fetch(`${apiURL}/today-logs`);
  if (!response.ok) {
    throw new Error('Error fetching today logs');
  }
  const logs = await response.text();
  return logs;
};

// 로그 데이터 클리어하기
// logService.js
export const clearLogs = async (password) => {
    const response = await fetch(`${apiURL}/clear-logs`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: password }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to clear logs');
    }
    return response.ok;
  };
  