import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Context } from '../context';
import { useRouter } from 'next/router';

const register = () => {
  const [name, setName] = useState('');
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
      console.log(process.env.NEXT_PUBLIC_API);
      const { data } = await axios.post(`/api/register`, {
        name,
        email,
        password,
      });

      toast.success('Registration successful, please login.');
      setLoading(false);
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      toast.error(err.response.data.message);
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className='jumbotron text-center bg-primary square'>Register</h1>
      <div className='container col-md-4 offset-md-4 pb-5'>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            className='form-control mb-4 p-2'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Enter Name'
            required
          />
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
              disabled={!name || !email || !password || loading}
              type='submit'
              className='btn btn-block btn-primary'
            >
              {loading ? <SyncOutlined spin /> : 'Register'}
            </button>
          </div>
        </form>

        <p className='text-center p-3'>
          Already registered?{' '}
          <Link href='/login'>
            <a>Login</a>
          </Link>
        </p>
      </div>
    </>
  );
};

export default register;
