import Link from 'next/link';
import reqwest from 'reqwest';
/* utils */
import { absoluteUrl, checkIsLogin } from '../../../middleware/utils';

/* components */
import Layout from '../../../components/layout/LayoutAdmin';
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
  Table
} from 'antd';

const { Text, Title } = Typography;

const { TextArea } = Input;
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: true,
    render: name => `${name.first} ${name.last}`,
    width: '20%',
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    // filters: [
    //   { text: 'Male', value: 'male' },
    //   { text: 'Female', value: 'female' },
    // ],
    width: '20%',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
];
const getRandomuserParams = params => ({
  results: params.pagination.pageSize,
  page: params.pagination.current,
  ...params,
});

export default function Home(props) {
  const { user, origin } = props;
  const [login, setLogin] = useState(null)
  const [shouldRun, setShouldRun] = useState(true)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  // state = {
  //   data: [],
  //   pagination: {
  //     current: 1,
  //     pageSize: 10,
  //   },
  //   loading: false,
  // };

  function onChange(a, b, c) {
    console.log(a, b, c);
  }

  const contentStyle = {
    height: 'auto',
    textAlign: 'center',
  };

  useEffect(() => {
    fetch({ pagination });
  }, [])

  const handleTableChange = (pagination, filters, sorter) => {
    fetch({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    });
  };

  const fetch = (params = {}) => {
    setLoading(true)
    reqwest({
      url: 'https://randomuser.me/api',
      method: 'get',
      type: 'json',
      data: getRandomuserParams(params),
    }).then(data => {
      console.log(data);
      setLoading(false)
      setData(data.results)
      setPagination({
        ...params.pagination,
        total: 200,
        // 200 is mock data, you should read it from server
        // total: data.totalCount,
      },)
    });
  };
  return (
    <Layout title="Government - Admin management" url={origin} origin={origin} user={login} >
      <div>
        <h1>management-organization</h1>
        <Table
          columns={columns}
          rowKey={record => record.login.uuid}
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />
        <h4>admin/management-organization/index.js</h4>
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
