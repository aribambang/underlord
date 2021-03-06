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
  CarryOutOutlined,
  TeamOutlined,
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
    <Menu mode='horizontal' selectedKeys={[current]} className='mb-2'>
      <Item key='/' onClick={(e) => setCurrent(e.key)} icon={<AppstoreOutlined />}>
        <Link href='/'>
          <a>App</a>
        </Link>
      </Item>

      {user && user.role && user.role.includes('Instructor') ? (
        <Item
          key='/instructor/course/create'
          onClick={(e) => setCurrent(e.key)}
          icon={<CarryOutOutlined />}
        >
          <Link href='/instructor/course/create'>
            <a>Create Course</a>
          </Link>
        </Item>
      ) : (
        <Item
          key='/user/become-instructor'
          onClick={(e) => setCurrent(e.key)}
          icon={<TeamOutlined />}
        >
          <Link href='/user/become-instructor'>
            <a>Become Instructor</a>
          </Link>
        </Item>
      )}

      {!user ? (
        <>
          <Item
            key='/login'
            className='ms-auto'
            onClick={(e) => setCurrent(e.key)}
            icon={<LoginOutlined />}
          >
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
        <>
          {user && user.role && user.role.includes('Instructor') && (
            <Item
              key='/instructor'
              onClick={(e) => setCurrent(e.key)}
              className='ms-auto'
              icon={<TeamOutlined />}
            >
              <Link href='/instructor'>
                <a>Instructor</a>
              </Link>
            </Item>
          )}
          <SubMenu
            key='account'
            className={`${user && user.role && user.role.includes('Instructor') ? '' : 'ms-auto'}`}
            title={user.name}
            icon={<UserOutlined />}
          >
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
        </>
      )}
    </Menu>
  );
};

export default TopNav;
