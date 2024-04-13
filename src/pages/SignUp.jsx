import React, { useState } from 'react';
import googleLogo from "@src/assets/google.svg" // Replace with the path to your Google logo SVG
import "@src/styles/SignUp.css";
import Header from '@src/components/Header';
import { useNavigate } from 'react-router-dom';
import eb from '@src/eb';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [msg, setMsg] = useState('Welcome to Keeper!');

  const handleSignUp = async () => {
    try{
      const res = await eb.auth.signUp(email, password);
      console.log("res",res)
      navigate('/');
    }catch(error){
      console.log("this",error);
      setMsg(error.error);
    }

  };

  const handleSignUpWithGoogle = async () => {
    // Implement your Google OAuth logic here
    const res = await eb.auth.signInWithGoogle();
    window.location.replace(res.data)
  };

  const handleLogin = async () => {
    // Implement your login logic here
    try{
      const res = await eb.auth.signIn(email, password);
      console.log("res",res)
      navigate('/');
    }catch(error){
      console.log("this",error);
      setMsg(error.error);
    }

  };

  return (
    <>
        <Header/>
    <div className="signup-container">

      <div className="signup-form">
      {msg}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignUp}>Sign Up </button>
        <button onClick={handleLogin}> Log in</button>
        <button className="google-signup" onClick={handleSignUpWithGoogle}>
          <img src={googleLogo} alt="Google logo" />
          Sign in with Google
        </button>
      </div>
    </div>
    </>
  );
}

export default SignUp;