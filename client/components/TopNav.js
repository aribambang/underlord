import { Menu } from 'antd';
import Link from 'next/link';
import { AppstoreOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons';

const TopNav = () => {
  const { Item } = Menu;
  return (
    <Menu mode='horizontal'>
      <Item key='app' icon={<AppstoreOutlined />}>
        <Link href='/'>
          <a>App</a>
        </Link>
      </Item>
      <Item icon={<LoginOutlined />}>
        <Link key='login' href='/login'>
          <a>Login</a>
        </Link>
      </Item>
      <Item key='register' icon={<UserAddOutlined />}>
        <Link href='/register'>
          <a>Register</a>
        </Link>
      </Item>
    </Menu>
  );
};

export default TopNav;
