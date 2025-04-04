"use client";
import React, { useState, useRef } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import 'bootstrap/dist/css/bootstrap.min.css';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  { ssr: false }
);

const HTMLEditor: React.FC = () => {
  const [code, setCode] = useState<string>(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HTML Preview</title>
  <style>
    /* Add your CSS here */
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f0f0f0;
    }
    h1 {
      color: navy;
    }
  </style>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is an HTML preview.</p>
</body>
</html>`);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Function to update the preview
  const updatePreview = () => {
    const iframe = iframeRef.current;
    if (iframe) {
      const iframeDoc = iframe.contentDocument;
      iframeDoc?.open();
      iframeDoc?.write(code);
      iframeDoc?.close();
    }
  };

  // Handle editor options including auto-completion
  const editorOptions = {
    minimap: { enabled: false },
    automaticLayout: true,
    tabSize: 2,
    fontSize: 14,
    autoClosingBrackets: 'always',
    autoClosingQuotes: 'always',
    formatOnPaste: true,
    formatOnType: true,
  };

  return (
    <div className={`container-fluid p-0 min-vh-100 ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <Head>
        <title>HTML Editor</title>
        <meta name="description" content="Web-based HTML/CSS editor" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'} border-bottom`}>
        <div className="container-fluid">
          <span className="navbar-brand">HTML Editor</span>
          <div className="d-flex">
            <div className="form-check form-switch me-3">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="darkModeSwitch" 
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)} 
              />
              <label className="form-check-label" htmlFor="darkModeSwitch">Dark Mode</label>
            </div>
            <button 
              className="btn btn-primary" 
              onClick={updatePreview}
            >
              Update Preview
            </button>
          </div>
        </div>
      </nav>

      <div className="row g-0 h-100">
        <div className="col-md-6 border-end">
          <div style={{ height: 'calc(100vh - 56px)' }}>
            <MonacoEditor
              height="100%"
              language="html"
              value={code}
              onChange={(value) => setCode(value || '')}
              theme={darkMode ? 'vs-dark' : 'light'}
            //   options={editorOptions}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="p-3 h-100 overflow-auto">
            <h5>Preview</h5>
            <iframe 
              ref={iframeRef}
              title="HTML Preview" 
              className="w-100 h-100 border-0"
              sandbox="allow-same-origin allow-scripts"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HTMLEditor;