import React, { useContext, useState } from 'react';
import { Context } from '../../context';
import UserRoute from '../../components/routes/UserRoute';

const UserIndex = () => {
  const { state } = useContext(Context);

  return (
    <UserRoute>
      <h1 className='jumbotron text-center bg-primary square'>
        <pre>{JSON.stringify(state.user)}</pre>
      </h1>
    </UserRoute>
  );
};

export default UserIndex;
