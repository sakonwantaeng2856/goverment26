import Link from 'next/link';

/* utils */
import { absoluteUrl, checkIsLogin } from '../../../middleware/utils';

/* components */
import Layout from '../../../components/layout/LayoutAdmin';
import IndexSuperAdmin from './index-super-admin';
import IndexAdmin from './index-admin';
// import UserNav from '../components/navigation/User';
import { useEffect, useState } from 'react'

import {
  Carousel,
  Row,
  Col,
  Typography,
  Image,
  Button,
  Input,
  Card,
} from 'antd';

const { Text, Title } = Typography;

const { TextArea } = Input;

export default function Home(props) {
  const { origin } = props;
  const [login, setLogin] = useState(null)
  const [shouldRun, setShouldRun] = useState(true)
  const [user, setUser] = useState(false);
  function onChange(a, b, c) {
    console.log(a, b, c);
  }

  const contentStyle = {
    height: 'auto',
    textAlign: 'center',
  };

  useEffect(() => {
    fetchUserLogin()
  }, [])

  async function fetchUserLogin() {
    const userLogin = await checkIsLogin()
    // console.log(userLogin)
    setUser(userLogin)
  }

  return (
    <Layout title="Government - Admin management" url={origin} origin={origin} user={login} >
      <div>
        {user.type_user == 1 &&
          <IndexSuperAdmin />
        }
        {user.type_user == 2 &&
          <IndexAdmin />
        }
      </div>


    </Layout>
  );
}
/* getServerSideProps */
export async function getServerSideProps(context) {
  const { req } = context;
  const { origin } = absoluteUrl(req);

  return {
    props: {
      origin,
    },
  };
}
