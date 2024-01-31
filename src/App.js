import React, { useState, useEffect } from 'react';
import './App.css';
import NavBar from './NavBar';
import FileOperations from './components/FileOperations';
import FileList from './components/FileList'; // FileList 컴포넌트를 임포트합니다.
import LogData from './components/LogData';
import CodeFormatter from './components/CodeFormatter';
import { fetchTodayLogs } from './services/logService';
import { fetchFileList } from './services/fileService';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [todayLogs, setTodayLogs] = useState("");
  const [fileList, setFileList] = useState([]);

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

  // 파일을 선택할 때 호출되는 함수
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
        <FileList fileList={fileList} selectedFile={selectedFile} handleFileSelect={handleFileSelect} />
        <FileOperations selectedFile={selectedFile} />
        <CodeFormatter />
        <LogData logs={todayLogs} setLogs={setTodayLogs} />
      </main>
    </div>
  );
}

export default App;
