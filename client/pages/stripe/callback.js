import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Context } from '../../context';
import { SyncOutlined } from '@ant-design/icons';

const StripeCallback = () => {
  const {
    state: { user },
  } = useContext(Context);

  useEffect(() => {
    if (user) {
      axios.post('/api/get-account-status').then((res) => {
        window.location.href = '/instructor';
      });
    }
  }, [user]);
  return <SyncOutlined spin className='d-flex justify-content-center display-1 text-danger p-5' />;
};

export default StripeCallback;
