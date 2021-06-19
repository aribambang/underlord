import React, { useState, useContext } from 'react';
import { Context } from '../../context';
import { Button } from 'antd';
import axios from 'axios';
import { SettingOutlined, UserSwitchOutlined, LoadingOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import UserRoute from '../../components/routes/UserRoute';

const BecomeInstructor = () => {
  const [loading, setLoading] = useState('');
  const {
    state: { user },
  } = useContext(Context);

  const becomeInstructor = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/make-instructor');
      window.location.href = data;
    } catch (err) {
      toast('Stripe onboarding failed. Try Again.');
      setLoading(false);
    }
  };

  return (
    <UserRoute>
      <h1 className='jumbotron text-center square'>Become Instructor</h1>
      <div className='container'>
        <div className='row'>
          <div className='col-md-6 offset-md-3 text-center'>
            <div className='pt-4'>
              <UserSwitchOutlined className='display-1 pb-3' />
              <h2>Setup payout to publish course on Underlord</h2>
              <p className='lead text-warning'>
                Underlord partner with Stripe to transfer earnings to your bank account
              </p>
              <Button
                className='mb-3'
                type='primary'
                block
                shape='round'
                icon={loading ? <LoadingOutlined /> : <SettingOutlined />}
                onClick={becomeInstructor}
                disabled={(user && user.role && user.role.includes('Instructor')) || loading}
              >
                {loading ? 'Processing...' : 'Payout setup'}
              </Button>
              <p className='lead'>
                You will be redirected to Stripe to complete onboarding process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </UserRoute>
  );
};

export default BecomeInstructor;
