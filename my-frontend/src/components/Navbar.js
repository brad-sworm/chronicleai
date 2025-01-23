import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';

const Navbar = () => {
  const { user } = useUser(); // Get the user from the context

  return (
    <nav style={styles.nav}>
      <ul style={styles.ul}>
        <li style={styles.li}><Link to="/authpage" style={styles.link}>Sign Up</Link></li>
        <li style={styles.li}><Link to="/journal" style={styles.link}>Journal Entry</Link></li>
        <li style={styles.li}><Link to="/dashboard" style={styles.link}>Stored Entries</Link></li>
        <li style={styles.li}><Link to="/insights" style={styles.link}>Insights</Link></li>
        {user && <li style={styles.username}>{user.username}</li>}
      </ul>
    </nav>
  );
};

const styles = {
  nav: {
    background: '#333',
    padding: '10px',
  },
  ul: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'space-around',
  },
  li: {
    display: 'inline',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '18px',
  },
  username: {
    color: '#fff',
    fontSize: '18px',
  },
};

export default Navbar;
