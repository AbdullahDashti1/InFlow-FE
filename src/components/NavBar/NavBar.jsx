import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
  const location = useLocation();

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
      {/* Navigation Links */}
      <NavLink to="/">Home</NavLink>
      <NavLink to="/sign-up">Sign Up</NavLink>
      <NavLink to="/sign-in">Sign In</NavLink>
      <NavLink to="/clients">Clients</NavLink>
      <NavLink to="/quotes">Quotes</NavLink>
    </nav>
  );
};

export default NavBar;
