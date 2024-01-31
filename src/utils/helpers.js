// 로그 문자열을 HTML로 변환
export const convertLogsToHTML = (logs) => {
    return logs.split('\n').map(log => {
      if (log.includes('Country Flag:')) {
        const imageUrl = log.split('Country Flag: ')[1].split(', ')[0];
        return log.replace(`Country Flag: ${imageUrl}`, `<img src="${imageUrl}" alt="Country Flag" class="flag-icon" style="height:20px;">`);
      }
      return log;
    }).join('<br>');
  };
  