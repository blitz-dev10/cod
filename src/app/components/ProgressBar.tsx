import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div style={styles.progressContainer}>
      <div style={styles.progressText}>
        <span>Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div style={styles.progressTrack}>
        <div 
          style={{
            ...styles.progressFill,
            width: `${progress}%`
          }}
        />
      </div>
    </div>
  );
};

const styles = {
  progressContainer: {
    width: '100%',
    marginTop: 'auto',
  },
  progressText: {
    display: 'flex',
    justifyContent: 'space-between',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
  },
  progressTrack: {
    width: '100%',
    height: '6px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    transition: 'width 0.3s ease',
  },
};

export default ProgressBar;