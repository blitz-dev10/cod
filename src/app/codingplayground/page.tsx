"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Editor } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { executeCode } from "../../../api";
import { LANGUAGE_VERSIONS, CODE_SNIPPETS } from "../../../constants";
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css';

interface User {
  username: string;
  email: string;
}

export default function CodePlayground() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [output, setOutput] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      Swal.fire({
        icon: 'warning',
        title: 'Access Denied',
        text: 'Please login first to access the Code Playground',
        confirmButtonText: 'Go to Login'
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/login');
        }
      });
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    if (editorRef.current) {
      editorRef.current.setValue(CODE_SNIPPETS[language]);
    }
  };

  const runCode = async () => {
    if (!editorRef.current) return;
    const sourceCode = editorRef.current.getValue();
    
    try {
      setIsLoading(true);
      setIsError(false);
      const { run: result } = await executeCode(selectedLanguage, sourceCode);
      const outputLines = result.output.split("\n");
      setOutput(outputLines);
      
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = (path: string) => {
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Access Denied',
        text: 'Please login first to access this feature',
      });
    } else {
      router.push(path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push("/");
  };

  if (!user) return null;

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navbarLeft}>
          <Link href="/">
            <div style={styles.logo}>Codium</div>
          </Link>
        </div>
        <div style={styles.navbarCenter}>
          <Link href="/">
            <div style={styles.navItem}>Home</div>
          </Link>
          <div 
            style={styles.navItem} 
            onClick={() => handleNavigation('/course')}
          >
            Courses
          </div>
          <div 
            style={styles.navItem}
            onClick={() => handleNavigation('/htmlplayground')}
          >
            HTML Playground
          </div>
          <div 
            style={styles.navItem}
            onClick={() => handleNavigation('/codingplayground')}
          >
            Coding Playground
          </div>
        </div>
        <div style={styles.navbarRight}>
          <button 
            onClick={handleLogout} 
            style={styles.navButton}
          >
            Logout
          </button>
          <div style={styles.darkModeToggle}>
            <input 
              type="checkbox"
              id="darkMode"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              style={styles.darkModeInput}
            />
            <label htmlFor="darkMode" style={styles.darkModeLabel}>
              {darkMode ? '☀️' : '🌙'}
            </label>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <h1 style={{...styles.title, color: darkMode ? '#ffffff' : '#1e293b'}}>
          Code Playground
        </h1>
        <p style={styles.subtitle}>
          Write, compile and run code in multiple programming languages
        </p>

        <div style={styles.editorContainer}>
          <div style={styles.controls}>
            <div style={styles.controlsLeft}>
              <div style={styles.selectWrapper}>
                <select 
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  style={styles.languageSelect}
                >
                  {Object.keys(LANGUAGE_VERSIONS).map((lang) => (
                    <option key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
                <span style={styles.selectArrow}></span>
              </div>
              <button
                onClick={runCode}
                disabled={isLoading}
                style={{
                  ...styles.runButton,
                  ...(isLoading ? styles.runButtonDisabled : {}),
                  ...(isError ? styles.runButtonError : {})
                }}
              >
                {isLoading ? (
                  <span style={styles.loadingSpinner}>⟳</span>
                ) : 'Run Code'}
              </button>
            </div>
          </div>

          <div style={styles.splitView}>
            <div style={styles.editorWrapper}>
              <Editor
                height="calc(100vh - 220px)"
                theme={darkMode ? "vs-dark" : "light"}
                language={selectedLanguage}
                defaultValue={CODE_SNIPPETS[selectedLanguage]}
                onMount={(editor) => {
                  editorRef.current = editor;
                  editor.focus();
                }}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  automaticLayout: true,
                  padding: { top: 10 },
                }}
              />
            </div>

            <div style={styles.outputSection}>
              <h3 style={styles.outputTitle}>Output</h3>
              <div style={{
                ...styles.outputContent,
                backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                color: darkMode ? '#e2e8f0' : '#1e293b',
              }}>
                {output.length > 0 ? (
                  output.map((line, i) => (
                    <div key={i} style={styles.outputLine}>
                      {line}
                    </div>
                  ))
                ) : (
                  <div style={styles.outputPlaceholder}>
                    Your code output will appear here...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#0f172a',
    minHeight: '100vh',
    color: '#ffffff',
    fontFamily: "'Inter', sans-serif",
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    backdropFilter: 'blur(10px)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
  },
  navbarLeft: {
    display: 'flex',
    alignItems: 'center'
  },
  navbarCenter: {
    display: 'flex',
    gap: '2rem'
  },
  navbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#7c3aed',
    cursor: 'pointer'
  },
  navItem: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#e2e8f0',
    cursor: 'pointer',
    padding: '0.5rem',
    transition: 'color 0.3s ease'
  },
  navButton: {
    backgroundColor: 'transparent',
    color: '#f43f5e',
    border: '2px solid #f43f5e',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  mainContent: {
    padding: '2rem',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '0.5rem',
    textAlign: 'center' as const
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#94a3b8',
    marginBottom: '2rem',
    textAlign: 'center' as const
  },
  editorContainer: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    padding: '1.5rem'
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  languageSelect: {
    backgroundColor: '#2d3748',
    color: '#ffffff',
    border: '1px solid #4a5568',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    outline: 'none'
  },
  runButton: {
    backgroundColor: '#7c3aed',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  runButtonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed'
  },
  runButtonError: {
    backgroundColor: '#ef4444'
  },
  editorWrapper: {
    border: '1px solid #4a5568',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  outputContainer: {
    marginTop: '1.5rem'
  },
  outputTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: '0.5rem'
  },
  outputLine: {
    padding: '2px 0'
  },
  outputPlaceholder: {
    color: '#64748b',
    fontStyle: 'italic'
  },
  splitView: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    height: 'calc(100vh - 220px)',
  },
  selectWrapper: {
    position: 'relative' as const,
    display: 'inline-block',
  },
  selectArrow: {
    position: 'absolute' as const,
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
    pointerEvents: 'none',
    fontSize: '0.8rem',
  },
  controlsLeft: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  darkModeToggle: {
    marginLeft: '1rem',
  },
  darkModeInput: {
    display: 'none',
  },
  darkModeLabel: {
    cursor: 'pointer',
    fontSize: '1.2rem',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease',
  },
  loadingSpinner: {
    display: 'inline-block',
    animation: 'spin 1s linear infinite',
  },
  outputSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
  },
  outputContent: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #4a5568',
    fontFamily: 'monospace',
    fontSize: '0.9rem',
  },
};