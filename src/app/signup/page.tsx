"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const handleNavigation = (path: string) => {
    if (!user && (path === '/course' || path === '/htmlplayground' || path === '/codingplayground')) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!username || !email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.status === 201) {
        router.push("/login");
      } else if (res.status === 400 && data.message.includes("Username already taken")) {
        setError("Username already exists. Please choose a different username.");
      } else {
        setError(data.message || "Something went wrong!");
      }
    } catch (error) {
      setError("Failed to connect to the server.");
    }

    setLoading(false);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (error.includes("Username already exists")) {
      setError("");
    }
  };

  return (
    <div style={styles.container}>
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
          {user ? (
            <button onClick={handleLogout} style={styles.navButton}>
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

      <div style={styles.formContainer}>
        <div style={styles.formWrapper}>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Join our community of developers</p>
          
          {error && <div style={styles.errorMessage}>{error}</div>}
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label} htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label} htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label} htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={loading ? { ...styles.submitButton, ...styles.buttonDisabled } : styles.submitButton}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            <p style={styles.loginText}>
              Already have an account?{" "}
              <Link href="/login">
                <span style={styles.loginLink}>Log in</span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
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
  formContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '90vh',
    padding: '2rem'
  },
  formWrapper: {
    backgroundColor: '#1e293b',
    padding: '2.5rem',
    borderRadius: '1rem',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  },
  title: {
    color: '#ffffff',
    fontSize: '2rem',
    fontWeight: '700',
    textAlign: 'center' as const,
    marginBottom: '0.5rem'
  },
  subtitle: {
    color: '#94a3b8',
    textAlign: 'center' as const,
    marginBottom: '2rem',
    fontSize: '0.975rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem'
  },
  label: {
    color: '#e2e8f0',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  input: {
    padding: '0.75rem',
    backgroundColor: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: '0.5rem',
    color: '#ffffff',
    fontSize: '1rem',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s ease'
  },
  submitButton: {
    backgroundColor: '#7c3aed',
    color: '#ffffff',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    marginTop: '1rem'
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed'
  },
  errorMessage: {
    backgroundColor: '#991b1b',
    color: '#ffffff',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    textAlign: 'center' as const,
    marginBottom: '1rem'
  },
  loginText: {
    color: '#94a3b8',
    textAlign: 'center' as const,
    fontSize: '0.875rem',
    marginTop: '1rem'
  },
  loginLink: {
    color: '#7c3aed',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none'
  }
};