import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import { Context } from '../context';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { state, dispatch } = useContext(Context);
  const { user } = state;

  const router = useRouter();

  useEffect(() => {
    if (user) router.push('/');
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await axios.post(`/api/login`, {
        email,
        password,
      });

      dispatch({
        type: 'LOGIN',
        payload: data,
      });

      window.localStorage.setItem('user', JSON.stringify(data));

      setLoading(false);

      router.push('/');
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className='jumbotron text-center bg-primary square'>Login</h1>
      <div className='container col-md-4 offset-md-4 pb-5'>
        <form onSubmit={handleSubmit}>
          <input
            type='email'
            className='form-control mb-4 p-2'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter Email'
            autoComplete='email'
            required
          />
          <input
            type='password'
            className='form-control mb-4 p-2'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter Password'
            autoComplete='new-password'
            required
          />
          <div className='d-grid gap-2'>
            <button
              disabled={!email || !password || loading}
              type='submit'
              className='btn btn-block btn-primary'
            >
              {loading ? <SyncOutlined spin /> : 'Login'}
            </button>
          </div>
        </form>

        <p className='text-center p-3'>
          Not yet registered?{' '}
          <Link href='/register'>
            <a>Register</a>
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;
