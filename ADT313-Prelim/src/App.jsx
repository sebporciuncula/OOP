import React, { useState, useEffect } from 'react';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [result, setResult] = useState(0);
  const [highlightPosition, setHighlightPosition] = useState({ x: 0, y: 0 });
  const [isHighlightVisible, setIsHighlightVisible] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() === '' || password.trim() === '') {
      alert('Please enter both username and password');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoggedIn(true);
      setIsLoading(false);
    }, 2000);
  };

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoggedIn(false);
      setUsername('');
      setPassword('');
      setIsLoading(false);
    }, 2000);
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const calculate = (operation) => {
    switch (operation) {
      case 'add': setResult(num1 + num2); break;
      case 'subtract': setResult(num1 - num2); break;
      case 'multiply': setResult(num1 * num2); break;
      case 'divide': setResult(num1 / num2); break;
    }
  };

  const handleButtonClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    setHighlightPosition({ x: rect.left, y: rect.top });
    setIsHighlightVisible(true);
  };

  useEffect(() => {
    if (isHighlightVisible) {
      const timer = setTimeout(() => setIsHighlightVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isHighlightVisible]);

  const baseButtonStyle = {
    padding: '10px 15px',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    backgroundColor: isDarkMode ? '#4a4a4a' : '#e0e0e0',
    color: isDarkMode ? '#ffffff' : '#000000',
    position: 'relative',
    overflow: 'hidden',
  };

  const inputStyle = {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: `1px solid ${isDarkMode ? '#4a4a4a' : '#ccc'}`,
    backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
    color: isDarkMode ? '#ffffff' : '#000000',
    width: '100%',
    boxSizing: 'border-box',
  };

  const highlightStyle = {
    position: 'fixed',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)',
    pointerEvents: 'none',
    transition: 'transform 0.5s, opacity 0.5s',
    transform: `translate(${highlightPosition.x}px, ${highlightPosition.y}px) scale(${isHighlightVisible ? 10 : 0})`,
    opacity: isHighlightVisible ? 1 : 0,
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
      color: isDarkMode ? '#ffffff' : '#000000',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{
        width: '400px',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
      }}>
        <button onClick={(e) => { toggleDarkMode(); handleButtonClick(e); }} style={{ ...baseButtonStyle, marginBottom: '20px', width: '100%' }}>
          Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
        </button>
        {!isLoggedIn ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h2 style={{ textAlign: 'center', margin: '0 0 20px 0' }}>Login</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
            />
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isDarkMode ? '#ffffff' : '#000000',
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <button type="submit" disabled={isLoading} style={baseButtonStyle} onClick={handleButtonClick}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h2 style={{ textAlign: 'center', margin: '0 0 20px 0' }}>Welcome, {username}!</h2>
            <button onClick={(e) => { handleLogout(); handleButtonClick(e); }} disabled={isLoading} style={baseButtonStyle}>
              {isLoading ? 'Logging out...' : 'Logout'}
            </button>
            <h3 style={{ textAlign: 'center', margin: '20px 0 10px 0' }}>Calculator</h3>
            <input
              type="number"
              placeholder="Number 1"
              onChange={(e) => setNum1(Number(e.target.value))}
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="Number 2"
              onChange={(e) => setNum2(Number(e.target.value))}
              style={inputStyle}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button onClick={(e) => { calculate('add'); handleButtonClick(e); }} style={baseButtonStyle}>Add</button>
              <button onClick={(e) => { calculate('subtract'); handleButtonClick(e); }} style={baseButtonStyle}>Subtract</button>
              <button onClick={(e) => { calculate('multiply'); handleButtonClick(e); }} style={baseButtonStyle}>Multiply</button>
              <button onClick={(e) => { calculate('divide'); handleButtonClick(e); }} style={baseButtonStyle}>Divide</button>
            </div>
            <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>Result: {result}</p>
          </div>
        )}
      </div>
      <div style={highlightStyle} />
    </div>
  );
};

export default App;