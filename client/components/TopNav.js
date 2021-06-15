import { useState, useEffect, useContext } from 'react';
import { Menu } from 'antd';
import Link from 'next/link';
import {
  AppstoreOutlined,
  LoginOutlined,
  UserAddOutlined,
  LogoutOutlined,
  UserOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { Context } from '../context';
import { toast } from 'react-toastify';
import axios from 'axios';

const TopNav = () => {
  const [current, setCurrent] = useState('');
  const { Item, SubMenu, ItemGroup } = Menu;
  const { state, dispatch } = useContext(Context);
  const router = useRouter();
  const { user } = state;

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const logout = async () => {
    dispatch({ type: 'LOGOUT' });
    window.localStorage.removeItem('user');
    const { data } = await axios.get('/api/logout');
    toast(data.message);
    router.push('/login');
  };

  return (
    <Menu mode='horizontal' selectedKeys={[current]}>
      <Item key='/' onClick={(e) => setCurrent(e.key)} icon={<AppstoreOutlined />}>
        <Link href='/'>
          <a>App</a>
        </Link>
      </Item>
      {!user ? (
        <>
          <Item key='/login' onClick={(e) => setCurrent(e.key)} icon={<LoginOutlined />}>
            <Link href='/login'>
              <a>Login</a>
            </Link>
          </Item>
          <Item key='/register' onClick={(e) => setCurrent(e.key)} icon={<UserAddOutlined />}>
            <Link href='/register'>
              <a>Register</a>
            </Link>
          </Item>
        </>
      ) : (
        <SubMenu key='account' title={user.name} className='ms-auto' icon={<UserOutlined />}>
          <ItemGroup>
            <Item key='/user' icon={<DashboardOutlined />}>
              <Link href='/user'>
                <a>Dashboard</a>
              </Link>
            </Item>
            <Item key='/logout' onClick={logout} icon={<LogoutOutlined />}>
              Logout
            </Item>
          </ItemGroup>
        </SubMenu>
      )}
    </Menu>
  );
};

export default TopNav;
