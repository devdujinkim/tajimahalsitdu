const apiURL = "https://api.tajimahalsitdu.it";

// 파일 리스트 가져오기
export const fetchFileList = async () => {
  try {
    const response = await fetch(`${apiURL}/files`);
    if (!response.ok) {
      throw new Error(`Failed to fetch file list: ${response.status}`);
    }
    const files = await response.json();
    return files.filter(file => file.startsWith('upload/')).map(file => file.replace('upload/', ''));
  } catch (e) {
    console.error("Error fetching file list:", e);
    throw e;
  }
};

// 파일 업로드
export const uploadFile = async (formData) => {
    try {
      const response = await fetch(`${apiURL}/upload`, {
        method: 'POST',
        body: formData, // headers를 설정하지 않습니다.
      });
  
      if (!response.ok) {
        // 서버 응답 에러를 출력합니다.
        console.error('Server responded with status:', response.status);
        throw new Error('Server responded with an error!');
      }
  
      return await response.json();
    } catch (error) {
      // 에러를 출력합니다.
      console.error('Upload failed:', error);
      throw error; // 이 에러를 상위 컴포넌트에서 캐치하여 처리할 수 있습니다.
    }
  };


// 파일 다운로드
export const downloadFile = (fileName) => {
  const downloadUrl = `${apiURL}/download/${fileName}`;
  window.open(downloadUrl, '_blank');
};

// 파일 삭제
export const deleteFile = async (fileName, password) => {
    const isPasswordValid = await verifyPassword(password, 'delete');
    if (!isPasswordValid) {
      return { success: false, error: 'Invalid password' };
    }
  
    try {
      const response = await fetch(`${apiURL}/delete-file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName: fileName, password: password }),
      });
  
      if (!response.ok) {
        throw new Error('File deletion failed');
      }
      
      return { success: true };
    } catch (error) {
      console.error('File deletion failed:', error);
      return { success: false, error: 'File deletion failed' };
    }
  };
  
  


// 비밀번호 검증
export const verifyPassword = async (passwordInput, action) => {
  try {
    const response = await fetch(`${apiURL}/verify-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: passwordInput, action: action }),
    });
    const data = await response.json();
    return data.isValid;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
};