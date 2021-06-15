import { useReducer, createContext, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const initialState = {
  user: null,
};

const Context = createContext();

const rootReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
};

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  const router = useRouter();

  useEffect(() => {
    dispatch({ type: 'LOGIN', payload: JSON.parse(window.localStorage.getItem('user')) });
  }, []);

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      let res = error.response;
      if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
        try {
          const { data } = await axios.get('/api/logout');
          dispatch({ type: 'LOGOUT' });
          window.localStorage.removeItem('user');
          router.push('/login');
        } catch (err) {
          throw new Error(error);
        }
      }
      return Promise.reject(error);
    },
  );

  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get('/api/csrf-token');
      axios.defaults.headers['X-CSRF-Token'] = data.csrfToken;
    };
    getCsrfToken();
  }, []);

  return <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>;
};

export { Context, Provider };
