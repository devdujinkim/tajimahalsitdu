import React, { useState } from 'react';

const CodeFormatter = () => {
  const [code, setCode] = useState("");
  const [formattedCode, setFormattedCode] = useState("");

  const transformInsertData = (code) => {
    return code.split('\n').map(line => {
      const elements = line.split('\t');
      const transformed = elements.filter(el => el !== '').map(el => {
        if (el === 'NULL') {
          return 'NULL';
        } else {
          return `'${el.trim()}'`;
        }
      });
      return `(${transformed.join(', ')})`;
    }).join('\n');
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

export default CodeFormatter;
