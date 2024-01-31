const apiURL = "https://api.tajimahalsitdu.it";

// 파일 리스트 가져오기
export const fetchFileList = async () => {
    try {
      const response = await fetch(`${apiURL}/files`);
      if (!response.ok) {
        throw new Error(`Failed to fetch file list: ${response.status}`);
      }
      const files = await response.json();
      return files.filter(file => file !== 'upload/').map(file => file.replace('upload/', ''));
    } catch (e) {
      console.error("Error fetching file list:", e);
      throw e; // 에러를 다시 throw하여 상위 컴포넌트에서 처리할 수 있게 합니다.
    }
  };
  
  

// 파일 업로드
// services/fileService.js

export const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await fetch(`${apiURL}/upload`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`File upload failed: ${response.status}`);
      }
  
      return response.json();
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };
  
  
  

// 파일 다운로드
export const downloadFile = (fileName) => {
  const downloadUrl = `${apiURL}/download/${fileName}`;
  var a = document.createElement("a");
  a.href = downloadUrl;
  a.download = fileName.split('/').pop();
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// 파일 삭제
export const deleteFile = async (fileName) => {
  const response = await fetch(`${apiURL}/delete-file`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileName: fileName.replace('upload/', '') }),
  });
  if (!response.ok) {
    throw new Error('File deletion failed');
  }
  return response.json();
};

export const verifyPassword = async (passwordInput) => {
    try {
      const response = await fetch(`${apiURL}/verify-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await response.json();
      return data.isValid;
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  };