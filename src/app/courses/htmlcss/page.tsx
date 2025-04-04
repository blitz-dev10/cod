// "use client";
// import { useEffect, useState, useRef } from "react";
// import { Lesson } from "@/types/lesson";
// import Swal from "sweetalert2";
// import dynamic from 'next/dynamic';

// const lessons = require("../../../lessons/html_lesson.json");

// // Dynamically import Monaco Editor to avoid SSR issues
// const MonacoEditor = dynamic(
//   () => import('@monaco-editor/react'),
//   { ssr: false }
// );

// export default function HTMLCourses() {
//   const [htmlLessons, setHTMLLessons] = useState<Lesson[]>([]);
//   const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
//   const [progress, setProgress] = useState<Record<string, boolean>>({});
//   const [userId, setUserId] = useState<number | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [htmlCode, setHTMLCode] = useState("");
//   const iframeRef = useRef<HTMLIFrameElement>(null);

//   // Get user from localStorage on component mount
//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     if (userData) {
//       const user = JSON.parse(userData);
//       setUserId(user.id);
//     }
//   }, []);

//   // Load lessons and progress
//   useEffect(() => {
//     const loadLessonsAndProgress = async () => {
//       const htmlLessons = lessons.map((lesson: Lesson) => ({
//     ...lesson,
//     courseId: 'html' // Add courseId to each lesson
//   }));
//       setHTMLLessons(htmlLessons);
//       if (htmlLessons.length > 0) {
//         setSelectedLesson(htmlLessons[0]);
//         setHTMLCode(htmlLessons[0].test?.code || "");
//       }

//       if (userId) {
//         try {
//           const response = await fetch(`/api/progress?userId=${userId}&courseId=html`);
//           if (!response.ok) throw new Error("Failed to fetch progress");
//           const data = await response.json();
//           const progressMap = data.reduce(
//             (acc: Record<string, boolean>, item: any) => {
//               acc[item.lesson_id] = item.completed;
//               return acc;
//             },
//             {}
//           );
//           setProgress(progressMap);
//         } catch (error) {
//           Swal.fire({
//             icon: "error",
//             title: "Oops...",
//             text: "Failed to load progress data",
//           });
//         }
//       }
//     };

//     loadLessonsAndProgress();
//   }, [userId]);

//   // Update preview when lesson changes
//   useEffect(() => {
//     if (selectedLesson) {
//       setHTMLCode(selectedLesson.test?.code || "");
//       updatePreview(selectedLesson.test?.code || "");
//     }
//   }, [selectedLesson]);

//   const updatePreview = (code: string) => {
//     const iframe = iframeRef.current;
//     if (iframe) {
//       const iframeDoc = iframe.contentDocument;
//       iframeDoc?.open();
//       iframeDoc?.write(code);
//       iframeDoc?.close();
//     }
//   };

//   const handleRunClick = async () => {
//     if (!selectedLesson || !userId) return;
//     setIsLoading(true);

//     try {
//       // Mark as completed when Run is clicked
//       const progressResponse = await fetch("/api/progress", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId,
//           lessonId: selectedLesson.id,
//           courseId: 'python', // Add this line
//           completed: true,
//           score: 100,
//         }),
//       });

//       if (!progressResponse.ok) throw new Error("Failed to update progress");

//       // Update points
//       const pointsResponse = await fetch("/api/users/update-points", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, points: 10 }),
//       });

//       if (!pointsResponse.ok) throw new Error("Failed to update points");

//       // Update local user data in localStorage
//       const userData = localStorage.getItem("user");
//       if (userData) {
//         const user = JSON.parse(userData);
//         user.points = (user.points || 0) + 10;
//         localStorage.setItem("user", JSON.stringify(user));
//       }

//       // Update local state
//       setProgress((prev) => ({
//         ...prev,
//         [selectedLesson.id]: true,
//       }));

//       Swal.fire({
//         icon: "success",
//         title: "Good job!",
//         text: "You've completed this exercise and earned 10 points!",
//         timer: 2000,
//       });
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "An error occurred. Please try again.",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Calculate progress percentage
//   const progressPercentage =
//     htmlLessons.length > 0
//       ? (Object.values(progress).filter(Boolean).length / htmlLessons.length) *
//         100
//       : 0;

//   return (
//     <div className="flex h-screen bg-gray-900 overflow-hidden">
//       {/* Sidebar Toggle Button */}
//       <button
//         className="my-4 fixed z-50 top-4 left-4 p-2 rounded-md bg-gray-800 text-white"
//         onClick={() => setSidebarOpen(!sidebarOpen)}
//       >
//         {sidebarOpen ? (
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//         ) : (
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M4 6h16M4 12h16M4 18h16"
//             />
//           </svg>
//         )}
//       </button>

//       {/* Sidebar */}
//       <div
//         className={`w-64 bg-gray-800 p-4 overflow-y-auto fixed md:relative h-full transition-all duration-300 z-40 ${
//           sidebarOpen ? "left-0" : "-left-64 md:-left-16"
//         }`}
//       >
//         <h1 className="text-2xl font-semibold text-white mb-6">HTML/CSS Lessons</h1>

//         {/* Reset Progress Button */}
//         <div className="flex justify-end mb-4">
//           <button
//             className="text-sm text-red-400 hover:text-red-300"
//             onClick={async () => {
//               if (!userId) return;
              
//               const { isConfirmed } = await Swal.fire({
//                 title: 'Are you sure?',
//                 text: "This will reset all your progress and points!",
//                 icon: 'warning',
//                 showCancelButton: true,
//                 confirmButtonColor: '#d33',
//                 cancelButtonColor: '#3085d6',
//                 confirmButtonText: 'Yes, reset it!'
//               });

//               if (isConfirmed) {
//                 try {
//                   setIsLoading(true);
//                   const response = await fetch('/api/progress/reset', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ userId, courseId: 'html' }) // Add courseId
//                   });

//                   if (!response.ok) throw new Error('Failed to reset progress');

//                   // Reset local state
//                   setProgress({});
                  
//                   // Update local user points
//                   const userData = localStorage.getItem("user");
//                   if (userData) {
//                     const user = JSON.parse(userData);
//                     user.points = 0;
//                     localStorage.setItem("user", JSON.stringify(user));
//                   }

//                   Swal.fire({
//                     icon: 'success',
//                     title: 'Reset!',
//                     text: 'Your progress has been reset.',
//                     timer: 2000
//                   });
//                 } catch (error) {
//                   Swal.fire({
//                     icon: 'error',
//                     title: 'Error',
//                     text: 'Failed to reset progress',
//                   });
//                 } finally {
//                   setIsLoading(false);
//                 }
//               }
//             }}
//             disabled={isLoading}
//           >
//             {isLoading ? 'Resetting...' : 'Reset Progress'}
//           </button>
//         </div>

//         {/* Progress Bar */}
//         <div className="mb-6">
//           <div className="flex justify-between text-sm text-gray-300 mb-1">
//             <span>Progress</span>
//             <span>{Math.round(progressPercentage)}%</span>
//           </div>
//           <div className="w-full bg-gray-700 rounded-full h-2.5">
//             <div
//               className="bg-purple-600 h-2.5 rounded-full"
//               style={{ width: `${progressPercentage}%` }}
//             ></div>
//           </div>
//         </div>

//         {/* Lessons List */}
//         <div className="space-y-2">
//           {htmlLessons.map((lesson) => (
//             <div
//               key={lesson.id}
//               className={`p-3 rounded-lg cursor-pointer ${
//                 selectedLesson?.id === lesson.id
//                   ? "bg-purple-600 text-white"
//                   : progress[lesson.id]
//                   ? "bg-green-900 text-green-200"
//                   : "bg-gray-700 text-gray-300 hover:bg-gray-600"
//               }`}
//               onClick={() => setSelectedLesson(lesson)}
//             >
//               <div className="flex justify-between items-center">
//                 <h2 className="font-medium">{lesson.title}</h2>
//                 {progress[lesson.id] && (
//                   <span className="text-green-400">✓</span>
//                 )}
//               </div>
//               <p className="text-sm mt-1">{lesson.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Main Content Area - Split Screen */}
//       <div className="flex-1 flex overflow-hidden">
//         {/* Lesson Content (Left Panel) */}
//         <div className={`flex-1 overflow-y-auto p-8 transition-all duration-300 ${
//           sidebarOpen ? "ml-0 md:ml-0" : "ml-0"
//         }`}>
//           {selectedLesson ? (
//             <div className="text-white">
//               {/* Completion Status */}
//               {progress[selectedLesson.id] && (
//                 <div className="bg-green-900 text-green-200 p-2 rounded-lg mb-4">
//                   You've completed this lesson!
//                 </div>
//               )}

//               <h1 className="text-3xl font-semibold mb-6">{selectedLesson.title}</h1>

//               {/* Lesson Content */}
//               <div className="space-y-4">
//                 {selectedLesson.content.map((item, index) => (
//                   <div key={index} className="mb-6">
//                     {item.type === "text" ? (
//                       <p className="text-gray-300">{item.content}</p>
//                     ) : (
//                       <div>
//                         <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
//                           <code className="text-green-400">{item.content}</code>
//                         </pre>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <div className="text-white text-center mt-10">
//               <p>Select a lesson from the sidebar to view its content</p>
//             </div>
//           )}
//         </div>

//         {/* Test Section (Right Panel) */}
//         {selectedLesson?.test && (
//           <div className="w-1/2 bg-gray-800 p-8 overflow-y-auto border-l border-gray-700">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold text-white">Practice Area</h2>
//               <button
//                 className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded"
//                 onClick={handleRunClick}
//                 disabled={isLoading || progress[selectedLesson.id]}
//               >
//                 {isLoading ? 'Processing...' : progress[selectedLesson.id] ? 'Completed' : 'Mark Complete'}
//               </button>
//             </div>
            
//             <div className="mb-4">
//               <MonacoEditor
//                 height="300px"
//                 language="html"
//                 value={htmlCode}
//                 onChange={(value) => {
//                   setHTMLCode(value || "");
//                   updatePreview(value || "");
//                 }}
//                 theme="vs-dark"
//                 options={{
//                   minimap: { enabled: false },
//                   fontSize: 14,
//                   automaticLayout: true,
//                 }}
//               />
//             </div>
            
//             <h3 className="text-lg font-medium text-white mb-2">Preview</h3>
//             <div className="border border-gray-700 rounded-lg overflow-hidden">
//               <iframe 
//                 ref={iframeRef}
//                 title="HTML Preview"
//                 className="w-full h-96 bg-white"
//                 sandbox="allow-same-origin allow-scripts"
//               />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



"use client";
import { useEffect, useState, useRef } from "react";
import { Lesson } from "@/types/lesson";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import dynamic from 'next/dynamic';

const lessons = require("../../../lessons/html_lesson.json");

const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  { ssr: false }
);

interface User {
  username: string;
  email: string;
  id: number;
  points?: number;
}

export default function HTMLCourses() {
  const [htmlLessons, setHTMLLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [htmlCode, setHTMLCode] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      Swal.fire({
        icon: 'warning',
        title: 'Access Denied',
        text: 'Please login first to access HTML/CSS Course',
        confirmButtonText: 'Go to Login'
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/login');
        }
      });
    } else {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setUserId(userData.id);
    }
  }, [router]);

  useEffect(() => {
    const loadLessonsAndProgress = async () => {
      const htmlLessons = lessons.map((lesson: Lesson) => ({
        ...lesson,
        courseId: 'html'
      }));
      setHTMLLessons(htmlLessons);
      if (htmlLessons.length > 0) {
        setSelectedLesson(htmlLessons[0]);
        setHTMLCode(htmlLessons[0].test?.code || "");
      }

      if (userId) {
        try {
          const response = await fetch(`/api/progress?userId=${userId}&courseId=html`);
          if (!response.ok) throw new Error("Failed to fetch progress");
          const data = await response.json();
          const progressMap = data.reduce(
            (acc: Record<string, boolean>, item: any) => {
              acc[item.lesson_id] = item.completed;
              return acc;
            },
            {}
          );
          setProgress(progressMap);
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed to load progress data",
          });
        }
      }
    };

    loadLessonsAndProgress();
  }, [userId]);

  useEffect(() => {
    if (selectedLesson) {
      setHTMLCode(selectedLesson.test?.code || "");
      updatePreview(selectedLesson.test?.code || "");
    }
  }, [selectedLesson]);

  const updatePreview = (code: string) => {
    const iframe = iframeRef.current;
    if (iframe) {
      const iframeDoc = iframe.contentDocument;
      iframeDoc?.open();
      iframeDoc?.write(code);
      iframeDoc?.close();
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

  const handleRunClick = async () => {
    if (!selectedLesson || !userId) return;
    setIsLoading(true);

    try {
      const progressResponse = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          lessonId: selectedLesson.id,
          courseId: 'html',
          completed: true,
          score: 100,
        }),
      });

      if (!progressResponse.ok) throw new Error("Failed to update progress");

      const pointsResponse = await fetch("/api/users/update-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, points: 10 }),
      });

      if (!pointsResponse.ok) throw new Error("Failed to update points");

      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        user.points = (user.points || 0) + 10;
        localStorage.setItem("user", JSON.stringify(user));
      }

      setProgress((prev) => ({
        ...prev,
        [selectedLesson.id]: true,
      }));

      Swal.fire({
        icon: "success",
        title: "Good job!",
        text: "You've completed this exercise and earned 10 points!",
        timer: 2000,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  const progressPercentage = htmlLessons.length > 0
    ? (Object.values(progress).filter(Boolean).length / htmlLessons.length) * 100
    : 0;

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
          <div style={styles.navItem} onClick={() => handleNavigation('/course')}>
            Courses
          </div>
          <div style={styles.navItem} onClick={() => handleNavigation('/htmlplayground')}>
            HTML Playground
          </div>
          <div style={styles.navItem} onClick={() => handleNavigation('/codingplayground')}>
            Coding Playground
          </div>
        </div>
        <div style={styles.navbarRight}>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.mainContainer}>
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={styles.toggleButton}
        >
          {sidebarOpen ? '×' : '☰'}
        </button>

        {/* Sidebar */}
        <div style={{
          ...styles.sidebar,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          width: sidebarOpen ? '300px' : '0'
        }}>
          <div style={styles.sidebarHeader}>
            <h2 style={styles.sidebarTitle}>HTML/CSS Course</h2>
            
            <button 
              style={styles.resetButton}
              onClick={async () => {
                if (!userId) return;
                
                const { isConfirmed } = await Swal.fire({
                  title: 'Are you sure?',
                  text: "This will reset your HTML/CSS progress!",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#d33',
                  cancelButtonColor: '#3085d6',
                  confirmButtonText: 'Yes, reset it!'
                });

                if (isConfirmed) {
                  try {
                    setIsLoading(true);
                    const response = await fetch('/api/progress/reset', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ userId, courseId: 'html' })
                    });

                    if (!response.ok) throw new Error('Failed to reset progress');
                    setProgress({});
                    
                    const userData = localStorage.getItem("user");
                    if (userData) {
                      const user = JSON.parse(userData);
                      user.points = Math.max(0, (user.points || 0) - 10);
                      localStorage.setItem("user", JSON.stringify(user));
                    }

                    Swal.fire({
                      icon: 'success',
                      title: 'Reset!',
                      text: 'Your HTML/CSS progress has been reset.',
                      timer: 2000
                    });
                  } catch (error) {
                    Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      text: 'Failed to reset progress',
                    });
                  } finally {
                    setIsLoading(false);
                  }
                }
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Progress'}
            </button>
          </div>

          <div style={styles.progressBar}>
            <div style={styles.progressText}>
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div style={styles.progressTrack}>
              <div 
                style={{
                  ...styles.progressFill,
                  width: `${progressPercentage}%`
                }}
              />
            </div>
          </div>

          <div style={styles.lessonList}>
            {htmlLessons.map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => {
                  setSelectedLesson(lesson);
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
                style={{
                  ...styles.lessonItem,
                  ...(selectedLesson?.id === lesson.id ? styles.lessonItemActive : {}),
                  ...(progress[lesson.id] ? styles.lessonItemCompleted : {})
                }}
              >
                <div style={styles.lessonItemContent}>
                  <h3 style={styles.lessonItemTitle}>{lesson.title}</h3>
                  <p style={styles.lessonItemDescription}>{lesson.description}</p>
                </div>
                {progress[lesson.id] && (
                  <span style={styles.completionCheck}>✓</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{
          ...styles.mainContent,
          marginLeft: sidebarOpen ? '300px' : '0'
        }}>
          <div style={styles.contentWrapper}>
            {/* Left side: Lesson Content */}
            <div style={styles.lessonContent}>
              {selectedLesson ? (
                <>
                  {progress[selectedLesson.id] && (
                    <div style={styles.completionBanner}>
                      You've completed this lesson!
                    </div>
                  )}
                  
                  <h1 style={styles.lessonTitle}>{selectedLesson.title}</h1>
                  
                  <div style={styles.lessonItems}>
                    {selectedLesson.content.map((item, index) => (
                      <div key={index} style={styles.lessonItem}>
                        {item.type === "text" ? (
                          <p style={styles.textContent}>{item.content}</p>
                        ) : (
                          <pre style={styles.codeBlock}>
                            <code style={styles.code}>{item.content}</code>
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={styles.noLessonSelected}>
                  Select a lesson from the sidebar to begin
                </div>
              )}
            </div>

            {/* Right side: Test Section */}
            {selectedLesson?.test && (
              <div style={styles.testSection}>
                <div style={styles.testHeader}>
                  <h2 style={styles.testTitle}>Practice Area</h2>
                  <button
                    onClick={handleRunClick}
                    disabled={isLoading || progress[selectedLesson.id]}
                    style={{
                      ...styles.runButton,
                      ...(isLoading || progress[selectedLesson.id] ? styles.buttonDisabled : {})
                    }}
                  >
                    {isLoading ? 'Processing...' : 
                     progress[selectedLesson.id] ? 'Completed' : 'Mark Complete'}
                  </button>
                </div>

                <div style={styles.editorContainer}>
                  <MonacoEditor
                    height="300px"
                    language="html"
                    value={htmlCode}
                    onChange={(value) => {
                      setHTMLCode(value || "");
                      updatePreview(value || "");
                    }}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      automaticLayout: true,
                    }}
                  />
                </div>

                <h3 style={styles.previewTitle}>Preview</h3>
                <div style={styles.previewContainer}>
                  <iframe 
                    ref={iframeRef}
                    title="HTML Preview"
                    style={styles.preview}
                    sandbox="allow-same-origin allow-scripts"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
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
  },
  navbarLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  navbarCenter: {
    display: 'flex',
    gap: '2rem',
  },
  navbarRight: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#7c3aed',
    cursor: 'pointer',
  },
  navItem: {
    color: '#e2e8f0',
    cursor: 'pointer',
    padding: '0.5rem',
    transition: 'color 0.3s ease',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    color: '#f43f5e',
    border: '2px solid #f43f5e',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  mainContainer: {
    position: 'relative' as const,
    minHeight: 'calc(100vh - 64px)',
  },
  toggleButton: {
    position: 'fixed' as const,
    top: '80px',
    left: '20px',
    zIndex: 99,
    backgroundColor: '#1e293b',
    border: 'none',
    color: '#ffffff',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  sidebar: {
    position: 'fixed' as const,
    top: '64px',
    left: 0,
    height: 'calc(100vh - 64px)',
    backgroundColor: '#1e293b',
    transition: 'all 0.3s ease',
    overflowY: 'auto' as const,
    zIndex: 98,
    boxShadow: '4px 0 8px rgba(0, 0, 0, 0.2)',
  },
  sidebarHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  sidebarTitle: {
    margin: '0 0 1rem 0',
    color: '#ffffff',
    fontSize: '1.5rem',
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: 'transparent',
    color: '#f43f5e',
    border: '1px solid #f43f5e',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'all 0.3s ease',
  },
  progressBar: {
    padding: '1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  progressText: {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#94a3b8',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
  },
  progressTrack: {
    width: '100%',
    height: '6px',
    backgroundColor: '#2d3748',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7c3aed',
    transition: 'width 0.3s ease',
  },
  lessonList: {
    padding: '1rem',
  },
  lessonItem: {
    padding: '1rem',
    backgroundColor: '#2d3748',
    borderRadius: '8px',
    marginBottom: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  lessonItemActive: {
    backgroundColor: '#7c3aed',
  },
  lessonItemCompleted: {
    backgroundColor: '#065f46',
  },
  lessonItemContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
  },
  lessonItemTitle: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: '500',
    color: '#ffffff',
  },
  lessonItemDescription: {
    margin: 0,
    fontSize: '0.875rem',
    color: '#94a3b8',
  },
  completionCheck: {
    color: '#10b981',
    marginLeft: '0.5rem',
  },
  mainContent: {
    transition: 'margin-left 0.3s ease',
    minHeight: 'calc(100vh - 64px)',
    backgroundColor: '#0f172a',
  },
  contentWrapper: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    padding: '2rem',
    maxWidth: '1800px',
    margin: '0 auto',
  },
  lessonContent: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '2rem',
    height: 'fit-content',
  },
  completionBanner: {
    backgroundColor: '#065f46',
    color: '#10b981',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
  },
  lessonTitle: {
    color: '#ffffff',
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '2rem',
  },
  lessonItems: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  textContent: {
    color: '#94a3b8',
    lineHeight: '1.7',
    fontSize: '1rem',
    margin: 0,
  },
  codeBlock: {
    backgroundColor: '#2d3748',
    padding: '1rem',
    borderRadius: '8px',
    overflow: 'auto' as const,
    margin: 0,
  },
  code: {
    color: '#10b981',
    fontFamily: 'monospace',
  },
  testSection: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '2rem',
  },
  testHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  testTitle: {
    color: '#ffffff',
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: 0,
  },
  runButton: {
    backgroundColor: '#7c3aed',
    color: '#ffffff',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  buttonDisabled: {
    backgroundColor: '#4b5563',
    cursor: 'not-allowed',
  },
  editorContainer: {
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '1.5rem',
  },
  previewTitle: {
    color: '#ffffff',
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  previewContainer: {
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  preview: {
    width: '100%',
    height: '400px',
    border: 'none',
  },
  noLessonSelected: {
    textAlign: 'center' as const,
    color: '#94a3b8',
    padding: '4rem 2rem',
  },
};