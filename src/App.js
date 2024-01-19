import React, { useState, useEffect } from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import NavBar from './NavBar'; 


function App() {
  const [fileList, setFileList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const apiURL = "https://api.tajimahalsitdu.it";
  const [uploadedFileName, ] = useState("");
  const [formatType, setFormatType] = useState('mssql');

  const [logData, setLogData] = useState([]);
  useEffect(() => {
    const fetchLogData = async () => {
      try {
        const response = await fetch(`${apiURL}/logs`);
        if (!response.ok) {
          throw new Error('Log data fetch failed');
        }
        const logs = await response.json();
        setLogData(logs);
      } catch (error) {
        console.error('Error fetching log data:', error);
        setError(error.message);
      }
    };
    
    fetchLogData();
  }, []);

  const transformInsertData = (code) => {
    return code.split('\n').map(line => {
      // 세 개의 공백으로 데이터를 분리
      const rawElements = line.split(/   +/);
      const transformed = rawElements.map(el => {
        // NULL은 그대로 유지하고, 나머지는 따옴표로 감싸줌
        return el === 'NULL' ? el : `'${el}'`;
      });
  
      return `(${transformed.join(', ')})`;
    }).join('\n');
  };
  
  
  
  

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
          //const responseData = await response.json();
          //alert(responseData.message); // 성공 메시지를 사용자에게 알림
          console.log('File deleted successfully');
          fetchFileList(); // 파일 목록을 다시 불러옴
        } catch (error) {
          console.error('Error:', error);
          setError(error.message);
          alert('Deletion failed: ' + error.message); // 사용자에게 오류 메시지를 표시
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
  
  // useEffect(() => {
  //   fetchRandomImage(); 
  // }, []); 
  

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
      a.download = fileName.split('/').pop(); // Set the file name for download
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

  // const fetchRandomImage = () => {
  //   fetch(`${apiURL}/random-image`) 
  //    .then(response => {
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       return response.json();
  //     })
  //     .then(data => {
  //       if (data && data.urls && data.urls.regular) {
  //         const imageUrl = data.urls.regular;
  
  //         document.body.style.backgroundImage = `url('${imageUrl}')`;
  //         document.body.style.backgroundPosition = 'center center';
  //         document.body.style.backgroundRepeat = 'no-repeat';
  //         document.body.style.backgroundAttachment = 'fixed';
  //         document.body.style.backgroundSize = 'cover'; 
  //       } else {
  //         throw new Error('Invalid data structure from Unsplash API');
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error:', error);
  //     });
  // };
  
  const CodeFormatter = () => {
    
    const [code, setCode] = useState("");
  
    const handleFormatClick = async () => {
      if (formatType === 'mssql') {
      try {
        const response = await fetch('https://api.tajimahalsitdu.it/format-sql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sql: code }),
        });
        const data = await response.json();
        if (response.ok) {
          setCode(data.formattedSQL);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error('Formatting failed:', error);
      }
    }
    else if (formatType === 'insert') {
      const transformedCode = transformInsertData(code);
      setCode(transformedCode);
    }
    };
  
    return (
      <div id="code-formatter">
        <textarea value={code} onChange={(e) => setCode(e.target.value)} />
        <button onClick={handleFormatClick}>Format Code</button>
      </div>
    );
  };


  return (
    <div className="App">
       <NavBar /> {
        
       }
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
      style={{ display: 'none' }} // 실제 input은 숨김 처리
    />
    <select value={formatType} onChange={e => setFormatType(e.target.value)}>
        <option value="mssql">MSSQL</option>
        <option value="insert">Insert</option>
      </select>
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
        <h2>Log Data</h2>
        <div className="log-list">
          {logData.map((log, index) => (
            <div key={index} className="log-item">
              {log}
            </div>
          ))}
        </div>
      </div>
      </main>
      <footer className="App-footer">
        <p></p>
      </footer>
    </div>
  );
}

export default App;
