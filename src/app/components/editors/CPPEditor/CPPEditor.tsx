// src/app/components/editors/CPPEditor/CPPEditor.tsx
"use client";
import { useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { executeCode } from "../../../../../api";
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css';

interface CPPEditorProps {
  defaultValue?: string;
  onExecute?: (output: string, error?: string) => void;
}

const CPPEditor = ({ defaultValue = "", onExecute }: CPPEditorProps) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [output, setOutput] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const runCode = async () => {
    if (!editorRef.current) return;
    const sourceCode = editorRef.current.getValue();
    
    try {
      setIsLoading(true);
      setIsError(false);
      const { run: result } = await executeCode("cpp", sourceCode);
      const outputLines = result.output.split("\n");
      setOutput(outputLines);
      
      if (onExecute) {
        onExecute(result.output, result.stderr || undefined);
      }
      
      if (result.stderr) {
        setIsError(true);
        Swal.fire({
          icon: "error",
          title: "Execution Error",
          text: result.stderr,
        });
      }
    } catch (error) {
      setIsError(true);
      const errorMessage = error instanceof Error ? error.message : "Failed to run code";
      
      if (onExecute) {
        onExecute("", errorMessage);
      }
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="code-editor-container">
      <div className="editor-section mb-3">
        <Editor
          height="300px"
          theme="vs-dark"
          language="cpp"
          defaultValue={defaultValue || `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`}
          onMount={(editor) => {
            editorRef.current = editor;
            editor.focus();
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            automaticLayout: true
          }}
        />
      </div>
      
      <div className="controls-section mb-3">
        <button
          className={`btn btn-sm ${isError ? 'btn-danger' : 'btn-primary'} ${isLoading ? 'disabled' : ''}`}
          onClick={runCode}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Running...
            </>
          ) : (
            "Run Code"
          )}
        </button>
      </div>
      
      <div className="output-section">
        <h6 className="output-title">Output</h6>
        <div className={`output-content ${isError ? 'error-output' : ''}`}>
          {output.length > 0 ? (
            output.map((line, i) => <div key={i} className="output-line">{line}</div>)
          ) : (
            <div className="output-placeholder">Your output will appear here</div>
          )}
        </div>
      </div>

      <style jsx>{`
        .code-editor-container {
          border: 1px solid #444;
          border-radius: 4px;
          padding: 15px;
          background: #1e1e1e;
        }
        .editor-section {
          border: 1px solid #444;
          border-radius: 4px;
          overflow: hidden;
        }
        .output-section {
          margin-top: 15px;
        }
        .output-title {
          color: #aaa;
          margin-bottom: 5px;
          font-weight: bold;
        }
        .output-content {
          background: #1e1e1e;
          border: 1px solid #444;
          border-radius: 4px;
          padding: 10px;
          min-height: 100px;
          font-family: monospace;
          white-space: pre-wrap;
          color: #d4d4d4;
        }
        .error-output {
          border-color: #ff5555;
        }
        .output-line {
          margin: 2px 0;
        }
        .output-placeholder {
          color: #666;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default CPPEditor;