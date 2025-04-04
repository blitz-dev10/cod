"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
interface User {
  username: string;
  email: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const router = useRouter();
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const phrases = [
    "Learn to code. Build your future.",
    "Master programming. Unlock opportunities.",
    "Debug problems. Create solutions.",
    "Think logically. Build creatively.",
    "Start coding. Transform ideas into reality."
  ];
  const typingSpeed = 100;
  const pauseDelay = 1500;
  const coursesRef = useRef<HTMLDivElement>(null);

  // Handle scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Modified typewriter effect
  useEffect(() => {
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let timeout: NodeJS.Timeout;
  
    const type = () => {
      const currentPhrase = phrases[currentPhraseIndex];
      
      if (!isDeleting && currentCharIndex <= currentPhrase.length) {
        setText(currentPhrase.substring(0, currentCharIndex));
        currentCharIndex++;
        timeout = setTimeout(type, typingSpeed);
      } 
      else if (isDeleting && currentCharIndex >= 0) {
        setText(currentPhrase.substring(0, currentCharIndex));
        currentCharIndex--;
        timeout = setTimeout(type, typingSpeed / 2);
      } 
      else if (currentCharIndex > currentPhrase.length) {
        isDeleting = true;
        timeout = setTimeout(type, pauseDelay);
      } 
      else {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        currentCharIndex = 0;
        timeout = setTimeout(type, typingSpeed);
      }
    };
  
    timeout = setTimeout(type, typingSpeed);
    return () => clearTimeout(timeout);
  }, []);

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

  // Check for user login
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push("/login");
  };

  const handleCourseClick = (path: string) => {
    if (!user) {
      // Show sweet alert (simple alert for now, you can replace with a library)
      window.alert("Please login first to access courses");
    } else {
      router.push(path);
    }
  };

  const scrollToCourses = () => {
    if (coursesRef.current) {
      coursesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Progress Bar */}
      <div style={{
        ...styles.progressBar,
        width: `${scrollProgress}%`,
      }}></div>

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
          {user ? (
            <button 
              onClick={handleLogout} 
              style={styles.navButton}
            >
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

      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.content}>
          {user ? (
            <h1 style={styles.title}>Welcome back, <span style={styles.username}>{user.username}</span>!</h1>
          ) : (
            <h1 style={styles.title}>Welcome to <span style={styles.highlight}>Codium Studio</span></h1>
          )}
          
          <div style={styles.typewriterContainer}>
            <span style={styles.typewriter}>{text}</span>
            <span style={styles.cursor}>|</span>
          </div>
          
          <p style={styles.subtitle}>
            Master in-demand programming skills through interactive lessons and projects
          </p>
          
          {!user && (
            <div style={styles.authButtons}>
              <Link href="/signup">
                <button style={styles.primaryButton}>Get Started</button>
              </Link>
              <Link href="/login">
                <button style={styles.secondaryButton}>Login</button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* New About Section */}
  <div style={styles.aboutSection}>
    <div style={styles.aboutContent}>
      <div style={styles.aboutText}>
        <h2 style={styles.aboutTitle}>Your Journey to Becoming a Developer Starts Here</h2>
        <p style={styles.aboutDescription}>
          Codium Studio is your comprehensive platform for learning programming. 
          Whether you're a complete beginner or looking to expand your skills, 
          our interactive lessons, real-time coding environments, and project-based 
          learning approach will help you master the art of programming.
        </p>
        <div style={styles.features}>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>📚</span>
            <span>Interactive Lessons</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>💻</span>
            <span>Live Coding Environment</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>🎯</span>
            <span>Project-Based Learning</span>
          </div>
        </div>
      </div>
      <div style={styles.aboutImage}>
        <img 
          src="/coding-illustration.svg" 
          alt="Coding Illustration" 
          style={styles.illustration}
        />
      </div>
    </div>
  </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLogo}>Codium</div>
          <p style={styles.footerText}>&copy; {new Date().getFullYear()} Codium Studio. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        .card-hover:hover {
          transform: translateY(-5px);
          transition: transform 0.3s ease;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
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
  // about styling
  aboutSection: {
    padding: '6rem 2rem',
    backgroundColor: '#0f172a',
    position: 'relative' as const,
  },
  aboutContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    alignItems: 'center',
  },
  aboutText: {
    color: '#ffffff',
  },
  aboutTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
    color: '#ffffff',
    lineHeight: '1.2',
  },
  aboutDescription: {
    fontSize: '1.1rem',
    color: '#94a3b8',
    lineHeight: '1.8',
    marginBottom: '2rem',
  },
  features: {
    display: 'grid',
    gap: '1rem',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontSize: '1.1rem',
    color: '#e2e8f0',
  },
  featureIcon: {
    fontSize: '1.5rem',
  },
  aboutImage: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '12px',
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
  }
};