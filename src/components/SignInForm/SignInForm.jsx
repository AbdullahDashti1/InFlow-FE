const SignInForm = () => {
  return (
    <div>
      <h1>Sign In</h1>
      <form>
        <div>
          <label>Username:</label>
          <input type="text" placeholder="Enter username" />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" placeholder="Enter password" />
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignInForm; 
