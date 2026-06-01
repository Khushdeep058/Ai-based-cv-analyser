import React from 'react';
import { GitBranch, Star, GitFork } from 'lucide-react';

const RepoCard = ({ repo }) => {
  if (!repo) return null;

  return (
    <div style={styles.card} className="glass-panel">
      <div style={styles.header}>
        <GitBranch size={20} color="var(--primary)" />
        <h3 style={styles.title}>
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer" style={styles.link}>
            {repo.name}
          </a>
        </h3>
      </div>
      <p style={styles.description}>{repo.description || "No description provided."}</p>
      <div style={styles.footer}>
        {repo.language && (
          <span style={styles.badge}>{repo.language}</span>
        )}
        <div style={styles.stats}>
          <span style={styles.stat}><Star size={14} /> {repo.stargazers_count}</span>
          <span style={styles.stat}><GitFork size={14} /> {repo.forks_count}</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    padding: '1.25rem',
    borderRadius: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    height: '100%',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  title: {
    margin: 0,
    fontSize: '1.125rem',
  },
  link: {
    color: 'var(--on-surface)',
    textDecoration: 'none',
  },
  description: {
    fontSize: '0.875rem',
    color: 'var(--on-surface-variant)',
    margin: 0,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: '0.5rem',
  },
  badge: {
    fontSize: '0.75rem',
    padding: '0.25rem 0.5rem',
    backgroundColor: 'var(--surface-container-high)',
    color: 'var(--primary)',
    borderRadius: '0.5rem',
    fontWeight: '600',
  },
  stats: {
    display: 'flex',
    gap: '1rem',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.875rem',
    color: 'var(--on-surface-variant)',
  }
};

export default RepoCard;
