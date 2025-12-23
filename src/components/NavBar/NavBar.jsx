// src/components/NavBar/NavBar.jsx
import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const handleSignOut = () => {
    localStorage.removeItem('token'); 
    setUser(null);                     
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      style={{
        marginRight: '10px',
        fontWeight: isActive(to) ? 'bold' : 'normal',
      }}
    >
      {children}
    </Link>
  );


  return (
    <nav>
      {user ? (
        <>
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/clients">Clients</NavLink>
          <NavLink to="/quotes">Quotes</NavLink>
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/sign-up">Sign Up</NavLink>
          <NavLink to="/sign-in">Sign In</NavLink>
        </>
      )}
    </nav>
  );
};

export default NavBar;
