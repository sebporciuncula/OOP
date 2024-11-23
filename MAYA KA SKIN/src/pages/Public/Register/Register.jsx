import React, { useState, useRef, useCallback, useEffect } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();

  // State for form fields
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    middleName: '',
    lastName: '',
    contactNo: '',
    role: '',
  });

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const [status, setStatus] = useState('idle');
  const [debounceState, setDebounceState] = useState(false);

  // Refs for input elements
  const refs = {
    email: useRef(),
    password: useRef(),
    firstName: useRef(),
    middleName: useRef(),
    lastName: useRef(),
    contactNo: useRef(),
    role: useRef(),
  };

  const debouncedFormData = useDebounce(formData, 2000);

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((prev) => !prev);
  }, []);

  const handleChange = (e, field) => {
    setIsFieldsDirty(true);
    setDebounceState(false);
    setFormData((prevData) => ({ ...prevData, [field]: e.target.value }));
  };

  const handleRegister = async () => {
    setStatus('loading');

    try {
      const response = await axios.post('/admin/register', formData, {
        headers: { 'Access-Control-Allow-Origin': '*' },
      });

      localStorage.setItem('accessToken', response.data.access_token);
      navigate('/');
      setStatus('idle');
    } catch (error) {
      alert(error.response.data.message);
      setStatus('idle');
    }
  };

  useEffect(() => {
    setDebounceState(true);
  }, [debouncedFormData]);

  return (
    <div className='Register'>
      <div className='main-container'>
        <h3>Register</h3>
        <form>
          <div className='form-container'>
            {['firstName', 'middleName', 'lastName', 'contactNo', 'role', 'email', 'password'].map((field) => (
              <div key={field}>
                <div className='form-group'>
                  <label>{`${field.charAt(0).toUpperCase() + field.slice(1)}:`}</label>
                  <input
                    type={field === 'password' && !isShowPassword ? 'password' : 'text'}
                    name={field}
                    ref={refs[field]}
                    onChange={(e) => handleChange(e, field)}
                    value={formData[field]}
                  />
                </div>
                {debounceState && isFieldsDirty && !formData[field] && (
                  <span className='errors'>This field is required</span>
                )}
              </div>
            ))}

            <div className='show-password' onClick={handleShowPassword}>
              {isShowPassword ? 'Hide' : 'Show'} Password
            </div>

            <div className='submit-container'>
              <button
                type='button'
                disabled={status === 'loading'}
                onClick={() => {
                  if (!formData.email || !formData.password) {
                    setIsFieldsDirty(true);
                    !formData.email && refs.email.current.focus();
                    !formData.password && refs.password.current.focus();
                    return;
                  }
                  handleRegister();
                }}
              >
                {status === 'idle' ? 'Register' : 'Loading...'}
              </button>
            </div>

            <div className='register-container'>
              <small>Already have an account? <a href='/'>Login</a></small>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
