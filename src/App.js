import React, { useState, useEffect } from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import NavBar from './NavBar';
import { debounce } from 'lodash';

function App() {
  const [fileList, setFileList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const apiURL = "https://api.tajimahalsitdu.it";
  const [todayLogs, setTodayLogs] = useState("");

  const fetchTodayLogs = debounce(async () => {
    try {
      const response = await fetch(`${apiURL}/today-logs`);
      const logs = await response.text();
      setTodayLogs(convertLogsToHTML(logs));
    } catch (error) {
      console.error('Error fetching today logs:', error);
      setError(error.message);
    }
  }, 2000);

  function convertLogsToHTML(logs) {
    return logs.split('\n').map(log => {
      if (log.includes('Country Flag:')) {
        const imageUrl = log.split('Country Flag: ')[1].split(', ')[0];
        return log.replace(`Country Flag: ${imageUrl}`, `<img src="${imageUrl}" alt="Country Flag" style="height:20px;">`);
      }
      return log;
    }).join('<br>');
  }

  useEffect(() => {
    fetchTodayLogs();
  }, []);

  const fetchFileList = async () => {
    try {
      const response = await fetch(`${apiURL}/files`);
      if (!response.ok) {
        throw new Error('Failed to fetch file list');
      }
      const files = await response.json();
      setFileList(files.filter(file => file !== 'upload/').map(file => file.replace('upload/', '')));
    } catch (error) {
      console.error('Error fetching file list:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchFileList();
  }, [selectedFile]);

  const handleFileSelect = (fileName) => {
    setSelectedFile(fileName);
  };

  const verifyPassword = async (inputPassword) => {
    try {
      const response = await fetch(`${apiURL}/verify-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: inputPassword }),
      });
      const data = await response.json();
      return data.isValid;
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  };

  // 파일 다운로드 처리 함수
  const handleDownload = async () => {
    if (!selectedFile) {
      alert('Please select a file.');
      return;
    }
    const passwordInput = prompt("Please enter the password:");
    if (passwordInput) {
      const isPasswordValid = await verifyPassword(passwordInput);
      if (!isPasswordValid) {
        alert('Invalid password');
        return;
      }
      const confirmDownload = window.confirm(`Would you like to download the file: ${selectedFile}?`);
      if (confirmDownload) {
        const fileName = selectedFile.replace('upload/', '');
        const downloadUrl = `${apiURL}/download/${fileName}`;
        var a = document.createElement("a");
        a.href = downloadUrl;
        a.download = fileName.split('/').pop();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } else {
      alert('Password required for downloading files.');
    }
  };

  // 파일 업로드 처리 함수
  const handleFileUpload = async (event) => {
    const passwordInput = prompt("Please enter the password:");
    if (passwordInput) {
      const isPasswordValid = await verifyPassword(passwordInput);
      if (!isPasswordValid) {
        alert('Invalid password');
        return;
      }
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        try {
          const response = await fetch(`${apiURL}/upload`, {
            method: 'POST',
            body: formData,
          });
          if (!response.ok) {
            throw new Error('File upload failed');
          }
          await response.json();
          console.log('File uploaded successfully');
          fetchFileList();
        } catch (error) {
          console.error('Error:', error);
          setError(error.message);
        }
      }
    } else {
      alert('Password required for uploading files.');
    }
  };

  // 파일 삭제 처리 함수
  const handleDelete = async () => {
    if (!selectedFile) {
      alert('Please select a file to delete.');
      return;
    }
    const passwordInput = prompt("Please enter the password:");
    if (passwordInput) {
      const isPasswordValid = await verifyPassword(passwordInput);
      if (!isPasswordValid) {
        alert('Invalid password');
        return;
      }

      const confirmDelete = window.confirm(`Are you sure you want to delete the file: ${selectedFile}?`);
      if (confirmDelete) {
        try {
          const response = await fetch(`${apiURL}/delete-file`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileName: selectedFile.replace('upload/', '') }),
          });
          if (!response.ok) {
            throw new Error('File deletion failed');
          }
          console.log('File deleted successfully');
          fetchFileList();
        } catch (error) {
          console.error('Error:', error);
          setError(error.message);
          alert('Deletion failed: ' + error.message);
        }
      }
    } else {
      alert('Password required for deleting files.');
    }
  };

  // 로그 클리어 처리 함수
  const handleClearLogs = async () => {
    const password = prompt("Please enter the password to clear logs:");
    if (password) {
      try {
        const response = await fetch(`${apiURL}/clear-logs`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password }),
        });

        if (response.ok) {
          setTodayLogs("");
          console.log('Logs have been cleared');
        } else {
          alert('Failed to clear logs: ' + response.status);
        }
      } catch (error) {
        console.error('Error when trying to clear logs:', error);
        alert('Error when trying to clear logs: ' + error);
      }
    } else {
      alert('Password is required to clear logs');
    }
  };

  const CodeFormatter = () => {
    const [code, setCode] = useState("");
    const [formattedCode, setFormattedCode] = useState("");
  
    const transformInsertData = (code) => {
      return code.split('\n').map(line => {
        // 모든 연속된 탭을 하나의 탭으로 변환합니다.
        const standardizedLine = line.replace(/\t+/g, '\t');
        // 변환된 단일 탭을 기준으로 문자열을 분리합니다.
        const rawElements = standardizedLine.split('\t');
        const transformed = rawElements.map(el => {
          // 'NULL'이 아닌 모든 값을 따옴표로 묶음
          return el === 'NULL' ? 'NULL' : `'${el.trim()}'`;
        });
        // 분리된 문자열에서 빈 문자열을 처리합니다.
        const finalTransformed = transformed.map(el => el.trim() === '' ? "''" : el);
        // 변환된 값들을 쉼표로 구분하여 괄호 안에 넣음
        return `(${finalTransformed.join(', ')})`;
      }).join(',\n');
    };
    
    
    const handleFormatClick = () => {
      const transformedCode = transformInsertData(code);
      setFormattedCode(transformedCode);
    };
    
    
    
    

    return (
      <div id="code-formatter">
        <div className="split-container">
          <textarea
            className="textarea-left"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <div className="result-container">
            {formattedCode === 'Formatting failed' ? (
              <div className="error">Formatting failed</div>
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  __html: formattedCode.replace(/\n/g, '<br>')
                }}
              />
            )}
          </div>
        </div>
        <button onClick={handleFormatClick} className="button-style">Format Code</button>
      </div>
    );
  };

  return (
    <div className="App">
      <NavBar />
      <header className="App-header">
        <img src="/33.png" className="image-size" alt="Header Image" />
      </header>
      <main className="App-main">
        <div className="File-operations">
          <div className="File-list">
            {fileList.map((file, index) => (
              <div
                key={index}
                className={`File-item ${file === selectedFile ? 'selected' : ''}`}
                onClick={() => handleFileSelect(file)}
              >
                {file}
              </div>
            ))}
          </div>
          <label htmlFor="file-upload" className="button-style">
            Upload File
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <div className="button-container">
            <Button className="button-style" onClick={handleDownload}>
              Download Selected File
            </Button>
            <Button className="button-style" onClick={handleDelete}>
              Delete Selected File
            </Button>
          </div>
        </div>
        <CodeFormatter />
        <div className="log-data">
          <h2>Today's Logs</h2>
          <div dangerouslySetInnerHTML={{ __html: todayLogs }} />
        </div>
        <footer className="App-footer">
          <Button onClick={handleClearLogs} className="button-style">Clear Logs</Button>
        </footer>
      </main>
    </div>
  );
            }
          
export default App;