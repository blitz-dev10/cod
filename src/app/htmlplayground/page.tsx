"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HTMLEditor from "../components/editors/HTMLEditor/HTMLEditor";
import Swal from "sweetalert2";


interface User {
  username: string;
  email: string;
}

export default function HTMLPlayground() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      Swal.fire({
        icon: 'warning',
        title: 'Access Denied',
        text: 'Please login first to access the HTML Playground',
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push("/");
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

  if (!user) {
    return null; // Don't render anything if user is not logged in
  }

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
        </div>
      </nav>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <h1 style={styles.title}>HTML Playground</h1>
        <p style={styles.subtitle}>
          Write, preview, and experiment with HTML code in real-time
        </p>
        <div style={styles.editorContainer}>
          <HTMLEditor />
        </div>
      </div>
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
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
  }
};