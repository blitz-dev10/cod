// "use client";
// import { useEffect, useState, useRef } from "react";
// import { Lesson } from "@/types/lesson";
// import Swal from "sweetalert2";
// import JavaScriptScriptEditor from "../../components/editors/JavaScriptscriptEditor/JavaScriptScriptEditor";

// const lessons = require("../../../lessons/javascriptscript_lesson.json");

// export default function JavaScriptScriptCourses() {
//   const [javascriptscriptLessons, setJavaScriptScriptLessons] = useState<Lesson[]>([]);
//   const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
//   const [progress, setProgress] = useState<Record<string, boolean>>({});
//   const [userId, setUserId] = useState<number | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [lastOutput, setLastOutput] = useState<string | null>(null);
//   const editorRef = useRef<any>(null);

//   // Reset lastOutput when lesson changes
//   useEffect(() => {
//     setLastOutput(null);
//   }, [selectedLesson]);

//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     if (userData) {
//       const user = JSON.parse(userData);
//       setUserId(user.id);
//     }
    
//     const handleResize = () => {
//       setSidebarOpen(window.innerWidth >= 768);
//     };
    
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     const loadLessonsAndProgress = async () => {
//       const jsLessons = lessons.map((lesson: Lesson) => ({
//         ...lesson,
//         courseId: 'javascriptscript'
//       }));
//       setJavaScriptScriptLessons(jsLessons);
//       if (jsLessons.length > 0) setSelectedLesson(jsLessons[0]);

//       if (userId) {
//         try {
//           const response = await fetch(`/api/progress?userId=${userId}&courseId=javascriptscript`);
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

//   const handleCodeSubmit = async (codeOutput: string) => {
//     if (!selectedLesson || !userId) return;
//     setIsLoading(true);

//     const isCorrect = codeOutput.trim() === selectedLesson.test.expected_output;

//     try {
//       const progressResponse = await fetch("/api/progress", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId,
//           lessonId: selectedLesson.id,
//           courseId: 'javascriptscript',
//           completed: isCorrect,
//           score: isCorrect ? 100 : 0,
//         }),
//       });

//       if (!progressResponse.ok) throw new Error("Failed to update progress");

//       if (isCorrect) {
//         const pointsResponse = await fetch("/api/users/update-points", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ userId, points: 10 }),
//         });

//         if (!pointsResponse.ok) throw new Error("Failed to update points");

//         const userData = localStorage.getItem("user");
//         if (userData) {
//           const user = JSON.parse(userData);
//           user.points = (user.points || 0) + 10;
//           localStorage.setItem("user", JSON.stringify(user));
//         }

//         Swal.fire({
//           icon: "success",
//           title: "Correct!",
//           text: "You earned 10 points!",
//           timer: 2000,
//         });
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "Oops...",
//           text: "Incorrect answer. Try again.",
//         });
//       }

//       setProgress((prev) => ({
//         ...prev,
//         [selectedLesson.id]: isCorrect,
//       }));

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

//   const progressPercentage =
//     javascriptscriptLessons.length > 0
//       ? (Object.values(progress).filter(Boolean).length / javascriptscriptLessons.length) *
//         100
//       : 0;

//   return (
//     <div className="flex h-screen bg-gray-900 overflow-hidden">
//       <button
//         className="fixed z-50 top-4 left-4 p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition-colors"
//         onClick={() => setSidebarOpen(!sidebarOpen)}
//         aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
//       >
//         {sidebarOpen ? (
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         ) : (
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//           </svg>
//         )}
//       </button>

//       <div
//         className={`bg-gray-800 overflow-y-auto fixed h-full z-40 transition-all duration-300 ease-in-out shadow-lg ${
//           sidebarOpen
//             ? "w-64 left-0" 
//             : "w-0 -left-64 md:w-14 md:left-0"
//         }`}
//       >
//         <div className={`p-4 ${sidebarOpen ? "opacity-100" : "opacity-0 md:opacity-0"} transition-opacity duration-200 overflow-hidden`}>
//           <h1 className="text-2xl font-semibold text-white mb-6">JavaScriptScript Lessons</h1>

//           <div className="flex justify-end mb-4">
//             <button
//               className="text-sm text-red-400 hover:text-red-300"
//               onClick={async () => {
//                 if (!userId) return;
                
//                 const { isConfirmed } = await Swal.fire({
//                   title: 'Are you sure?',
//                   text: "This will reset your JavaScriptScript progress!",
//                   icon: 'warning',
//                   showCancelButton: true,
//                   confirmButtonColor: '#d33',
//                   cancelButtonColor: '#3085d6',
//                   confirmButtonText: 'Yes, reset it!'
//                 });

//                 if (isConfirmed) {
//                   try {
//                     setIsLoading(true);
//                     const response = await fetch('/api/progress/reset', {
//                       method: 'POST',
//                       headers: { 'Content-Type': 'application/json' },
//                       body: JSON.stringify({ userId, courseId: 'javascriptscript' })
//                     });

//                     if (!response.ok) throw new Error('Failed to reset progress');
//                     setProgress({});
                    
//                     const userData = localStorage.getItem("user");
//                     if (userData) {
//                       const user = JSON.parse(userData);
//                       user.points = 0;
//                       localStorage.setItem("user", JSON.stringify(user));
//                     }

//                     Swal.fire({
//                       icon: 'success',
//                       title: 'Reset!',
//                       text: 'Your JavaScriptScript progress has been reset.',
//                       timer: 2000
//                     });
//                   } catch (error) {
//                     Swal.fire({
//                       icon: 'error',
//                       title: 'Error',
//                       text: 'Failed to reset progress',
//                     });
//                   } finally {
//                     setIsLoading(false);
//                   }
//                 }
//               }}
//               disabled={isLoading}
//             >
//               {isLoading ? 'Resetting...' : 'Reset Progress'}
//             </button>
//           </div>

//           <div className="mb-6">
//             <div className="flex justify-between text-sm text-gray-300 mb-1">
//               <span>Progress</span>
//               <span>{Math.round(progressPercentage)}%</span>
//             </div>
//             <div className="w-full bg-gray-700 rounded-full h-2.5">
//               <div
//                 className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
//                 style={{ width: `${progressPercentage}%` }}
//               ></div>
//             </div>
//           </div>

//           <div className="space-y-2">
//             {javascriptscriptLessons.map((lesson) => (
//               <div
//                 key={lesson.id}
//                 className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
//                   selectedLesson?.id === lesson.id
//                     ? "bg-purple-600 text-white"
//                     : progress[lesson.id]
//                     ? "bg-green-900 text-green-200"
//                     : "bg-gray-700 text-gray-300 hover:bg-gray-600"
//                 }`}
//                 onClick={() => {
//                   setSelectedLesson(lesson);
//                   if (window.innerWidth < 768) {
//                     setSidebarOpen(false);
//                   }
//                 }}
//               >
//                 <div className="flex justify-between items-center">
//                   <h2 className="font-medium truncate">{lesson.title}</h2>
//                   {progress[lesson.id] && (
//                     <span className="text-green-400 ml-1 flex-shrink-0">✓</span>
//                   )}
//                 </div>
//                 <p className="text-sm mt-1 truncate">{lesson.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
        
//         <div className={`py-4 ${!sidebarOpen ? "md:block" : "hidden"} transition-opacity duration-200 hidden`}>
//           {javascriptscriptLessons.map((lesson) => (
//             <div
//               key={lesson.id}
//               className={`mx-auto w-8 h-8 mb-3 rounded-lg cursor-pointer flex items-center justify-center transition-colors duration-200 ${
//                 selectedLesson?.id === lesson.id
//                   ? "bg-purple-600 text-white"
//                   : progress[lesson.id]
//                   ? "bg-green-900 text-green-200"
//                   : "bg-gray-700 text-gray-300 hover:bg-gray-600"
//               }`}
//               onClick={() => setSelectedLesson(lesson)}
//               title={lesson.title}
//             >
//               {lesson.title.charAt(0)}
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className={`flex-1 flex flex-col md:flex-row overflow-hidden transition-all duration-300 ${
//         sidebarOpen ? "ml-0 md:ml-64" : "ml-0 md:ml-14"
//       }`}>
//         <div className="flex-1 overflow-y-auto p-4 md:p-8 md:w-1/2">
//           {selectedLesson ? (
//             <div className="text-white mt-8 md:mt-0">
//               {progress[selectedLesson.id] && (
//                 <div className="bg-green-900 text-green-200 p-2 rounded-lg mb-4">
//                   You've completed this lesson!
//                 </div>
//               )}

//               <h1 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6">{selectedLesson.title}</h1>

//               <div className="space-y-4">
//                 {selectedLesson.content.map((item, index) => (
//                   <div key={index} className="mb-4 md:mb-6">
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

//         {selectedLesson?.test && !progress[selectedLesson.id] && (
//           <div className="md:w-1/2 bg-gray-800 p-4 md:p-8 overflow-y-auto border-t md:border-t-0 md:border-l border-gray-700">
//             <h2 className="text-xl font-semibold mb-4 md:mb-6 text-white">Test Your Knowledge</h2>
//             <p className="mb-4 text-gray-300">{selectedLesson.test.question}</p>
            
//             <div className="space-y-4">
//               <JavaScriptScriptEditor 
//                 defaultValue="// Write your code here"
//                 onExecute={(output, error) => {
//                   if (!error) {
//                     setLastOutput(output);
//                   } else {
//                     Swal.fire({
//                       icon: "error",
//                       title: "Execution Error",
//                       text: error,
//                     });
//                   }
//                 }}
//                 ref={editorRef}
//               />
              
//               <div className="flex space-x-4">
//                 <button
//                   onClick={() => {
//                     if (lastOutput) {
//                       handleCodeSubmit(lastOutput);
//                     } else {
//                       Swal.fire({
//                         icon: "warning",
//                         title: "No Output",
//                         text: "Please run your code first before submitting",
//                       });
//                     }
//                   }}
//                   disabled={isLoading || progress[selectedLesson?.id]}
//                   className={`px-4 py-2 rounded transition-colors ${
//                     isLoading || progress[selectedLesson?.id]
//                       ? 'bg-gray-500 cursor-not-allowed'
//                       : 'bg-green-600 hover:bg-green-700 text-white'
//                   }`}
//                 >
//                   {isLoading ? 'Submitting...' : 
//                    progress[selectedLesson?.id] ? 'Completed ✓' : 
//                    'Submit Solution'}
//                 </button>
//               </div>
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
import JavaScriptEditor from "../../components/editors/JavascriptEditor/JavaScriptEditor";


const lessons = require("../../../lessons/javascript_lesson.json");

interface User {
  username: string;
  email: string;
  id: number;
  points?: number;
}

export default function JavaScriptCourses() {
  const [javascriptLessons, setJavaScriptLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [lastOutput, setLastOutput] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const editorRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      Swal.fire({
        icon: 'warning',
        title: 'Access Denied',
        text: 'Please login first to access JavaScript Course',
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

    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [router]);

  useEffect(() => {
    const loadLessonsAndProgress = async () => {
      const javascriptLessons = lessons.map((lesson: Lesson) => ({
        ...lesson,
        courseId: 'javascript'
      }));
      setJavaScriptLessons(javascriptLessons);
      if (javascriptLessons.length > 0) setSelectedLesson(javascriptLessons[0]);

      if (userId) {
        try {
          const response = await fetch(`/api/progress?userId=${userId}&courseId=javascript`);
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
    setLastOutput(null);
  }, [selectedLesson]);

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

  const handleCodeSubmit = async (codeOutput: string) => {
    if (!selectedLesson || !userId) return;
    setIsLoading(true);

    const isCorrect = codeOutput.trim() === selectedLesson.test.expected_output;

    try {
      const progressResponse = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          lessonId: selectedLesson.id,
          courseId: 'javascript',
          completed: isCorrect,
          score: isCorrect ? 100 : 0,
        }),
      });

      if (!progressResponse.ok) throw new Error("Failed to update progress");

      if (isCorrect) {
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
          title: "Correct!",
          text: "You earned 10 points!",
          timer: 2000,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Incorrect answer. Try again.",
        });
      }
    } catch (error) {
      console.error("Error submitting code:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to submit code. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  const progressPercentage = javascriptLessons.length > 0
    ? (Object.values(progress).filter(Boolean).length / javascriptLessons.length) * 100
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
            <h2 style={styles.sidebarTitle}>JavaScript Course</h2>
            
            <button 
              style={styles.resetButton}
              onClick={async () => {
                if (!userId) return;
                
                const { isConfirmed } = await Swal.fire({
                  title: 'Are you sure?',
                  text: "This will reset your JavaScript progress!",
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
                      body: JSON.stringify({ userId, courseId: 'javascript' })
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
                      text: 'Your JavaScript progress has been reset.',
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
            {javascriptLessons.map((lesson) => (
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
            {selectedLesson?.test && !progress[selectedLesson.id] && (
              <div style={styles.testSection}>
                <h2 style={styles.testTitle}>Test Your Knowledge</h2>
                <p style={styles.testQuestion}>{selectedLesson.test.question}</p>
                <p style={styles.outputHint}>Expected Output: {selectedLesson.test.expected_output}</p>
                
                <div style={styles.editorContainer}>
                  <JavaScriptEditor 
                    defaultValue="// Write your code here"
                    onExecute={(output, error) => {
                      if (!error) {
                        setLastOutput(output);
                      } else {
                        Swal.fire({
                          icon: "error",
                          title: "Execution Error",
                          text: error,
                        });
                      }
                    }}
                    ref={editorRef}
                  />
                  
                  <div style={styles.buttonContainer}>
                    <button
                      onClick={() => {
                        if (lastOutput) {
                          handleCodeSubmit(lastOutput);
                        } else {
                          Swal.fire({
                            icon: "warning",
                            title: "No Output",
                            text: "Please run your code first before submitting",
                          });
                        }
                      }}
                      disabled={isLoading || progress[selectedLesson?.id]}
                      style={{
                        ...styles.submitButton,
                        ...(isLoading || progress[selectedLesson?.id] ? styles.buttonDisabled : {})
                      }}
                    >
                      {isLoading ? 'Submitting...' : 
                       progress[selectedLesson?.id] ? 'Completed ✓' : 
                       'Submit Solution'}
                    </button>
                  </div>
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
  outputHint: {
    color: '#94a3b8',
    fontSize: '0.9rem',
    padding: '0.5rem',
    backgroundColor: '#1f2937',
    borderRadius: '4px',
    marginBottom: '1rem',
    borderLeft: '4px solid #7c3aed',
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
    height: 'fit-content',
  },
  testTitle: {
    color: '#ffffff',
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  testQuestion: {
    color: '#94a3b8',
    marginBottom: '1.5rem',
    lineHeight: '1.6',
  },
  editorContainer: {
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  buttonContainer: {
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  submitButton: {
    backgroundColor: '#10b981',
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
  noLessonSelected: {
    textAlign: 'center' as const,
    color: '#94a3b8',
    padding: '4rem 2rem',
  },
};