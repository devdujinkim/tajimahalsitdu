const apiURL = "https://api.tajimahalsitdu.it";

// 파일 리스트 가져오기
export const fetchFileList = async () => {
  const response = await fetch(`${apiURL}/files`);
  if (!response.ok) {
    throw new Error('Failed to fetch file list');
  }
  const files = await response.json();
  return files.filter(file => file !== 'upload/').map(file => file.replace('upload/', ''));
};

// 파일 업로드
export const uploadFile = async (file, formData) => {
  const response = await fetch(`${apiURL}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('File upload failed');
  }
  return response.json();
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
