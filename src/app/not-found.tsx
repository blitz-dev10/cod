"use client";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.errorCode}>404</h1>
        <h2 style={styles.title}>Page Not Found</h2>
        <p style={styles.description}>Oops! The page you're looking for doesn't exist.</p>
        <button 
          onClick={() => router.push("/")}
          style={styles.button}
        >
          Return Home
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#0f172a', // Dark blue from your theme
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Inter', sans-serif",
    padding: '2rem',
  },
  content: {
    textAlign: 'center' as const,
    color: '#ffffff',
    maxWidth: '600px',
  },
  errorCode: {
    fontSize: '8rem',
    fontWeight: '800',
    color: '#7c3aed', // Purple from your theme
    marginBottom: '1rem',
    lineHeight: '1',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '1rem',
    color: '#ffffff',
  },
  description: {
    fontSize: '1.1rem',
    color: '#94a3b8', // Gray from your theme
    marginBottom: '2.5rem',
    lineHeight: '1.6',
  },
  button: {
    backgroundColor: '#7c3aed', // Purple from your theme
    color: 'white',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)',
    '&:hover': {
      backgroundColor: '#6d28d9', // Darker purple for hover
    },
  },
};