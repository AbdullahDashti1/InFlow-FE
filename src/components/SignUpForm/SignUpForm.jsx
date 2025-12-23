const SignUpForm = () => {
  return (
    <div>
      <h1>Sign Up</h1>
      <form>
        <div>
          <label>Username:</label>
          <input type="text" placeholder="Enter username" />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" placeholder="Enter email" />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" placeholder="Enter password" />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpForm;
