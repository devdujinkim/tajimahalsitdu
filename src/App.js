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
  const [uploadedFileName, ] = useState("");
  const [formatType, setFormatType] = useState('insert'); // 기본 포맷 타입을 'insert'로 변경

  const [todayLogs, setTodayLogs] = useState("");

  const fetchTodayLogs = debounce(async () => {
    try {
      const response = await fetch(`${apiURL}/today-logs`);
      const logs = await response.text();
      setTodayLogs(logs);
    } catch (error) {
      console.error('Error fetching today logs:', error);
      setError(error.message);
    }
  }, 2000);
  useEffect(() => {
    fetchTodayLogs();
  }, []);

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

  function convertLogsToHTML(logs) {
    return logs.split('\n').map(log => {
      if (log.includes('Country Flag:')) {
        const imageUrl = log.split('Country Flag: ')[1].split(', ')[0];
        const imageHtml = `<img src="${imageUrl}" alt="Country Flag" style="height:20px;">`;
        return log.replace(`Country Flag: ${imageUrl}`, imageHtml);
      }
      return log;
    }).join('<br>');
  }

  useEffect(() => {
    const htmlLogs = convertLogsToHTML(todayLogs);
    setTodayLogs(htmlLogs);
  }, [todayLogs]);

  const [logData, setLogData] = useState([]);

  const fetchLogData = async () => {
    try {
      const response = await fetch(`${apiURL}/today-logs`);
      if (!response.ok) {
        throw new Error('Today log data fetch failed');
      }
      const logs = await response.text();
    } catch (error) {
      console.error('Error fetching today logs:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchLogData();
  }, []);

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
        // 파일 삭제 요청을 서버로 전송하는 로직
        try {
          const response = await fetch(`${apiURL}/delete-file`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileName: selectedFile.replace('upload/', '') }), // 'upload/' 접두사 제거
          });
          if (!response.ok) {
            throw new Error('File deletion failed');
          }
          console.log('File deleted successfully');
          fetchFileList(); // 파일 목록을 다시 불러옴
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

  useEffect(() => {
    fetchFileList();
  }, [selectedFile]);

  const fetchFileList = async () => {
    try {
      const response = await fetch(`${apiURL}/files`);
      if (!response.ok) {
        throw new Error('File list fetch failed');
      }
      const files = await response.json();

      const filteredFiles = files
        .filter(file => file !== 'upload/')
        .map(file => file.replace('upload/', ''));

      setFileList(filteredFiles);
      setError(null);
    } catch (error) {
      console.error('Error fetching file list:', error);
      setError(error.message);
    }
  };

  const handleFileSelect = (fileName) => {
    setSelectedFile(fileName);
  };

  const handleDownload = async () => {
    const passwordInput = prompt("Please enter the password:");
    if (passwordInput) {
      const isPasswordValid = await verifyPassword(passwordInput);
      if (!isPasswordValid) {
        alert('Invalid password');
        return;
      }
      if (!selectedFile) {
        alert('Please select a file.');
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

  const CodeFormatter = () => {
    const [code, setCode] = useState("");
    const [formattedCode, setFormattedCode] = useState("");

    const handleFormatClick = async () => {
      const transformInsertData = (code) => {
        return code.split('\n').map(line => {
          const rawElements = line.split(/   +/);
          const transformed = rawElements.map(el => {
            return el === 'NULL' ? el : `'${el}'`;
          });
      
          return `(${transformed.join(', ')})`;
        }).join('\n');
      };
      
      // Insert 포맷팅 로직
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
        <button onClick={handleFormatClick}>Format Code</button>
      </div>
    );
  };

  return (
    <div className="App">
      <NavBar />
      <div id="home"></div>
      <header className="App-header">
        <img src="/33.png" className="image-size" />
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
            {uploadedFileName || "Upload"}
          </label>
          <div className="button-container">
            <input
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <Button className="button-style" onClick={handleDownload}>
              Download Selected File
            </Button>
            <Button className="button-style" onClick={handleDelete}>
              Delete Selected File
            </Button>
            {error && <div className="error">{error}</div>}
          </div>
        </div>
        <CodeFormatter />
        <div className="log-data">
          <div>
            <h2>Today's Logs</h2>
            <div dangerouslySetInnerHTML={{ __html: todayLogs }} />
          </div>
        </div>
      </main>
      <footer className="App-footer">
        <p></p>
        <Button onClick={handleClearLogs}>Clear</Button>
      </footer>
    </div>
  );
}

export default App;
