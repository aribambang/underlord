import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Context } from '../context';
import { useRouter } from 'next/router';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { state } = useContext(Context);

  const router = useRouter();

  useEffect(() => {
    if (state.user) router.push('/');
  }, [state.user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await axios.post('/api/forgot-password', { email });
      setSuccess(true);
      toast('Check your email for the secret code');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast(err.response.data);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await axios.post('/api/reset-password', { email, code, newPassword });
      setEmail('');
      setCode('');
      setNewPassword('');
      setLoading(false);
      setSuccess(false);
      toast('Successfully, now you can login with new password');
    } catch (err) {
      setLoading(false);
      toast(err.response.data.message);
    }
  };

  return (
    <>
      <h1 className='jumbotron text-center bg-primary square'>Forgot Password</h1>

      <div className='container col-md-4 offset-md-4 pb-5'>
        <form onSubmit={success ? handleResetPassword : handleSubmit}>
          <input
            type='email'
            className='form-control mb-4 p-2'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter email'
            required
          />
          {success && (
            <>
              <input
                type='text'
                className='form-control mb-4 p-2'
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder='Enter code'
                required
              />
              <input
                type='password'
                className='form-control mb-4 p-2'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder='Enter new password'
                required
              />
            </>
          )}
          <div className='d-grid gap-2'>
            <button
              type='submit'
              className='btn btn-primary btn-block'
              disabled={loading || !email}
            >
              {loading ? <SyncOutlined spin /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
