import React, { useState, useEffect } from 'react';
import './App.css';
import NavBar from './NavBar';
import FileOperations from './components/FileOperations';
import FileList from './components/FileList';
import LogData from './components/LogData';
import CodeFormatter from './components/CodeFormatter';
import { fetchTodayLogs } from './services/logService';
import { fetchFileList } from './services/fileService';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [todayLogs, setTodayLogs] = useState("");
  const [fileList, setFileList] = useState([]);
  const apiURL = "https://api.tajimahalsitdu.it";

  useEffect(() => {
    const fetchAndSetFileList = async () => {
      try {
        const files = await fetchFileList();
        setFileList(files); 
      } catch (error) {
        console.error('Error fetching file list:', error);
      }
    };
  
    fetchAndSetFileList();
    fetchTodayLogs().then(data => {
      setTodayLogs(data);
    });
  }, []);

  const onFileListUpdate = async () => {
    try {
      // 캐시를 방지하기 위해 쿼리 파라미터에 현재 시각을 추가합니다.
      const timestamp = new Date().getTime();
      const files = await fetchFileList(apiURL + '/files?_=' + timestamp);
      setFileList(files);
    } catch (error) {
      console.error('Error updating file list:', error);
    }
  };
  
  

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  return (
    <div className="App">
      <NavBar />
      <header className="App-header">
        <img src="/33.png" className="image-size" alt="Header" />
      </header>
      <main className="App-main">
        <FileList 
          fileList={fileList} 
          selectedFile={selectedFile} 
          handleFileSelect={handleFileSelect} 
        />
        <FileOperations 
          selectedFile={selectedFile} 
          onFileListUpdate={onFileListUpdate}  // 여기에 prop으로 함수를 전달합니다.
        />
        <CodeFormatter />
        {/* <LogData 
          logs={todayLogs} 
          setLogs={setTodayLogs} 
        /> */}
      </main>
    </div>
  );
}

export default App;
