import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { signUp } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';

const SignUpForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    company_name: '',
    password: '',
    passwordConf: '',
  });

  const { username, email, company_name, password, passwordConf } = formData;

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const newUser = await signUp(formData);
      setUser(newUser);
      navigate('/dashboard');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const isFormInvalid = () => {
    return !(username && email && password && password === passwordConf);
  };

  return (
    <div>
      <h1>Create Account</h1>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='username'>Username</label>
          <input
            type='text'
            id='username'
            name='username'
            value={username}
            onChange={handleChange}
            required
            placeholder="Choose a username"
          />
        </div>

        <div>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            name='email'
            value={email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor='company_name'>Company Name</label>
          <input
            type='text'
            id='company_name'
            name='company_name'
            value={company_name}
            onChange={handleChange}
            placeholder="Enter your company name (optional)"
          />
        </div>

        <div>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            name='password'
            value={password}
            onChange={handleChange}
            required
            placeholder="Create a strong password"
          />
        </div>

        <div>
          <label htmlFor='passwordConf'>Confirm Password</label>
          <input
            type='password'
            id='passwordConf'
            name='passwordConf'
            value={passwordConf}
            onChange={handleChange}
            required
            placeholder="Confirm your password"
          />
          {passwordConf && password !== passwordConf && (
            <p>Passwords do not match</p>
          )}
        </div>

        <div>
          <button type="submit" disabled={isFormInvalid()}>
            Sign Up
          </button>
          <button type="button" onClick={() => navigate('/')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;