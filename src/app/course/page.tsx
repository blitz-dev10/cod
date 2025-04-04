"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import ProgressBar from '../components/ProgressBar';


// Import your lesson files
const pythonLessons = require('../../lessons/python_lesson.json');
const javaLessons = require('../../lessons/java_lesson.json');
const cppLessons = require('../../lessons/cpp_lesson.json');
const javascriptLessons = require('../../lessons/javascript_lesson.json');
const htmlLessons = require('../../lessons/html_lesson.json');
const csharpLessons = require('../../lessons/csharp_lesson.json')

interface CourseProgress {
  [key: string]: number;
}

interface User {
  username: string;
  email: string;
}

export default function Courses() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [courseProgress, setCourseProgress] = useState<CourseProgress>({});

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUserId(userData.id);
    }
  }, []);

  useEffect(() => {
    const fetchAllProgress = async () => {
      if (!userId) return;

      const courses = ['python', 'java', 'cpp', 'javascript', 'html', 'csharp'];
      const progressData: CourseProgress = {};

      for (const course of courses) {
        try {
          const response = await fetch(`/api/progress?userId=${userId}&courseId=${course}`);
          if (!response.ok) throw new Error(`Failed to fetch ${course} progress`);
          
          const data = await response.json();
          const completedLessons = data.filter((item: any) => item.completed).length;
          
          // Get total lessons for each course
          let totalLessons = 0;
          switch(course) {
            case 'python': totalLessons = pythonLessons.length; break;
            case 'java': totalLessons = javaLessons.length; break;
            case 'cpp': totalLessons = cppLessons.length; break;
            case 'javascript': totalLessons = javascriptLessons.length; break;
            case 'html': totalLessons = htmlLessons.length; break;
            case 'csharp': totalLessons = csharpLessons.length; break;
          }
          
          progressData[course] = (completedLessons / totalLessons) * 100;
        } catch (error) {
          console.error(`Error fetching ${course} progress:`, error);
          progressData[course] = 0;
        }
      }

      setCourseProgress(progressData);
    };

    fetchAllProgress();
  }, [userId]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleCourseClick = (path: string) => {
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Access Denied',
        text: 'Please login first to access courses',
      });
    } else {
      router.push(path);
    }
  };

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
          <Link href="/course">
          <div style={styles.navItem}>Courses</div>
          </Link>
          <Link href="/htmlplayground">
          <div style={styles.navItem}>HTML Playground</div>
          </Link>
          <Link href="/codingplayground">
          <div style={styles.navItem}>Coding Playground</div>
          </Link>
        </div>
        <div style={styles.navbarRight}>
          {user ? (
            <button onClick={() => {
              localStorage.removeItem("user");
              document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
              router.push("/");
            }} style={styles.navButton}>
              Logout
            </button>
          ) : (
            <>
              <Link href="/login">
                <button style={styles.loginButton}>Login</button>
              </Link>
              <Link href="/signup">
                <button style={styles.signupButton}>Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Courses Content */}
      <div style={styles.coursesContainer}>
        <h1 style={styles.title}>Available Courses</h1>
        <p style={styles.subtitle}>Choose from our selection of programming courses</p>
        
        <div style={styles.coursesGrid}>
  {[
    { 
      id: 'python',
      title: "Python", 
      description: "Learn Python from scratch with interactive lessons",
      color: "#3776AB",
      path: "/courses/python",
      icon: "🐍",
      image: '/python.png'
    },
    { 
      id: 'java',
      title: "Java", 
      description: "Master Java, a powerful programming language",
      color: "#E76F00",
      path: "/courses/java",
      icon: "☕",
      image: '/java.png'
    },
    { 
      id: 'cpp',
      title: "C++", 
      description: "Learn high-performance systems programming",
      color: "#00599C",
      path: "/courses/cpp",
      icon: "⚙️",
      image: '/cpp.png'
    },
    { 
      id: 'javascript',
      title: "JavaScript", 
      description: "Build web applications with JavaScript",
      color: "#F7DF1E",
      path: "/courses/javascript",
      icon: "🌐",
      image: '/javascript.png'
    },
    { 
      id: 'html',
      title: "HTML", 
      description: "Create beautiful websites from scratch",
      color: "#E34F26",
      path: "/courses/html",
      icon: "🎨",
      image: '/html.png'
    },
    { 
      id: "csharp",
      title: "C#",
      description: "Master C# programming for modern applications",
      color: "#239120",
      path: "/courses/csharp",
      icon: "⚡",
      image: "/csharp.png"
    }
    
  ].map((course) => (
    <div
      key={course.title}
      onClick={() => handleCourseClick(course.path)}
      style={{
        ...styles.courseCard,
        backgroundColor: course.color,
        boxShadow: `0 4px 15px ${hexToRgba(course.color, 0.4)}`
      }}
      className="card-hover"
    >
      <div style={styles.courseIcon}>{course.icon}</div>
      <h2 style={styles.courseTitle}>{course.title}</h2>
      <p style={styles.courseDescription}>{course.description}</p>
      <ProgressBar progress={courseProgress[course.id] || 0} />
    </div>
  ))}
</div>
      </div>
    </div>
  );
}

// Helper function for rgba colors
function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const styles = {

  coursesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
    marginTop: '3rem',
  },
  courseCard: {
    padding: '2rem',
    borderRadius: '12px',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
    }
  },
  courseIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  courseTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '1rem',
    color: 'white'
  },
  courseDescription: {
    fontSize: '1rem',
    opacity: 0.9,
    lineHeight: '1.5',
    marginBottom: '1.5rem'
  },
  courseCard: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'scale(1.02)',
    }
  },
  courseImage: {
    width: '100px',
    height: '100px',
    objectFit: 'contain' as const,
    marginBottom: '1rem',
  },
  courseTitle: {
    color: '#ffffff',
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  container: {
    backgroundColor: '#0f172a',
    fontFamily: "'Inter', sans-serif",
    color: '#ffffff',
    minHeight: '100vh',
    position: 'relative' as const,
    overflowX: 'hidden' as const
  },
  progressBar: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    height: '4px',
    backgroundColor: '#7c3aed',
    zIndex: 1000,
    transition: 'width 0.2s ease'
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
  loginButton: {
    backgroundColor: 'transparent',
    color: '#7c3aed',
    border: '2px solid #7c3aed',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  signupButton: {
    backgroundColor: '#7c3aed',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },
  heroSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '90vh',
    padding: '2rem',
    textAlign: 'center' as const
  },
  content: {
    maxWidth: '800px',
    width: '100%',
    marginTop: '-4rem'
  },
  typewriterContainer: {
    height: '3rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  typewriter: {
    fontSize: '2rem',
    fontWeight: '300',
    color: '#94a3b8'
  },
  cursor: {
    fontSize: '2rem',
    fontWeight: '300',
    color: '#7c3aed',
    marginLeft: '2px',
    animation: 'blink 1s infinite'
  },
  highlight: {
    color: '#7c3aed'
  },
  username: {
    color: '#7c3aed'
  },
  courseSection: {
    padding: '4rem 2rem',
    backgroundColor: '#10192c',
  },
  sectionTitle: {
    fontSize: '2.2rem',
    fontWeight: '700',
    textAlign: 'center' as const,
    marginBottom: '0.5rem',
    color: '#ffffff'
  },
  sectionSubtitle: {
    fontSize: '1.1rem',
    color: '#94a3b8',
    textAlign: 'center' as const,
    marginBottom: '3rem'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#0f172a'
  },
  spinner: {
    border: '4px solid rgba(255, 255, 255, 0.1)',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    borderLeftColor: '#7c3aed',
    animation: 'spin 1s linear infinite'
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: '1rem',
    lineHeight: '1.1'
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#94a3b8',
    marginBottom: '2.5rem',
    lineHeight: '1.6',
    maxWidth: '600px',
    margin: '0 auto 2.5rem'
  },
  authButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '2rem'
  },
  primaryButton: {
    backgroundColor: '#7c3aed',
    color: 'white',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)'
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: '#7c3aed',
    border: '2px solid #7c3aed',
    padding: '14px 28px',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  cardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  card: {
    padding: '1.8rem',
    borderRadius: '12px',
    color: 'white',
    textAlign: 'left' as const,
    position: 'relative' as const,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    minHeight: '200px'
  },
  cardIcon: {
    fontSize: '2rem',
    marginBottom: '1rem'
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '0.75rem',
    position: 'relative' as const,
    zIndex: 2
  },
  cardDescription: {
    fontSize: '1rem',
    opacity: 0.9,
    marginBottom: '1.5rem',
    position: 'relative' as const,
    zIndex: 2,
    lineHeight: '1.5'
  },
  cardArrow: {
    position: 'absolute' as const,
    right: '1.5rem',
    bottom: '1.5rem',
    fontSize: '1.5rem',
    fontWeight: '700',
    transition: 'transform 0.3s ease',
    zIndex: 2
  },
  footer: {
    backgroundColor: '#0c1524',
    padding: '2rem',
    marginTop: '2rem'
  },
  footerContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem'
  },
  footerLogo: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#7c3aed'
  },
  footerText: {
    color: '#94a3b8',
    fontSize: '0.9rem'
  },
  // Add new styles specific to courses page:

  coursesContainer: {
    padding: '4rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  courseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
    marginTop: '3rem',
  },
  courseCard: {
    padding: '2rem',
    borderRadius: '12px',
    color: 'white',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  },
  courseIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  courseTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '1rem',
  },
  courseDescription: {
    fontSize: '1rem',
    opacity: 0.9,
    lineHeight: '1.5',
  },
};