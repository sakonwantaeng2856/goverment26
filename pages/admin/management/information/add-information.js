import Link from 'next/link';
import reqwest from 'reqwest';
// import ReactQuill, {Quill} from 'react-quill';
// let ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
/* utils */
import {
  absoluteUrl,
  checkIsLogin,
  apiInstance,
} from '../../../../middleware/utils';

/* components */
import Layout from '../../../../components/layout/LayoutAdmin';
// import UserNav from '../components/navigation/User';
import { useEffect, useState } from 'react';

import {
  Carousel,
  Row,
  Col,
  Typography,
  Image,
  Button,
  Input,
  Card,
  Table,
  Upload,
  Form,
  DatePicker,
  Space,
  TimePicker,
  Switch,
  notification,
  message,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import moment from 'moment';
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
  const [api, contextHolder] = notification.useNotification();
  const { user, origin } = props;
  const [login, setLogin] = useState(null);
  const [shouldRun, setShouldRun] = useState(true);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
  });

  useEffect(() => {
    _fetchUserLogin()
  }, [])

  async function _fetchUserLogin() {
    const userLogin = await checkIsLogin()
    console.log(user)
  }

  const [active, setActive] = useState('');
  const actived = () => {
    active ? setActive(0): setActive(1);
  }

  const [date, setDate] = useState('');

  

  async function onSubmitHandler(value) {
    const data = {
      organization_id: user.organization_id,
      infor_title: value.infor_title,
      infor_detail: value.infor_detail,
      // activities_image: value.activities_image,
      infor_image: 'abc.png',
      infor_date: date,
      // activities_date: '2001-01-31 17:00:00',
      infor_keyword: value.infor_keyword,
      infor_view: '0',
      status_active: active
    };


    const addinforData = await apiInstance().post(
      'admin/management/add-information',
      data,
    );
    if (addinforData.data.status == 200) {
      openNotificationRegisterSuccess();
      // setTimeout(function () { //Start the timer
      //   router.push('/login')
      // }.bind(this), 2000)
    } else {
      openNotificationRegisterFail(addinforData.data.message);
    }
  }

  const validateURL = inputText => {
    setUrl(validator.trim(inputText));
  };

  const openNotificationRegisterSuccess = () => {
    api.success({
      message: `เพิ่มข่าวประชาสัมพันธ์สำเร็จ`,
      description: 'เพิ่มข่าวประชาสัมพันธ์แล้ว',
      placement: 'topRight',
    });
  };

  const openNotificationRegisterFail = messgae => {
    api.error({
      message: `พบปัญหาระหว่างการเพิ่มข่าวประชาสัมพันธ์`,
      description: messgae,
      placement: 'topRight',
    });
  };

  const contentStyle = {
    height: 'auto',
    textAlign: 'center',
  };

  useEffect(() => {
    fetch({ pagination });
  }, []);

  const handleTableChange = (pagination, filters, sorter) => {
    fetch({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    });
  };

  const fetch = (params = {}) => {
    setLoading(true);
    reqwest({
      url: 'https://randomuser.me/api',
      method: 'get',
      type: 'json',
      data: getRandomuserParams(params),
    }).then(data => {
      console.log(data);
      setLoading(false);
      setData(data.results);
      setPagination({
        ...params.pagination,
        total: 200,
        // 200 is mock data, you should read it from server
        // total: data.totalCount,
      });
    });
  };


  const { Dragger } = Upload;

  // const dropimg = {
  //   name: 'file',
  //   multiple: true,
  //   action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  //   onChange(info) {
  //     const { status } = info.file;
  //     if (status !== 'uploading') {
  //       console.log(info.file, info.fileList);
  //     }
  //     if (status === 'done') {
  //       message.success(`${info.file.name} file uploaded successfully.`);
  //     } else if (status === 'error') {
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
  //   onDrop(e) {
  //     console.log('Dropped files', e.dataTransfer.files);
  //   },
  // };


  function onChange(value, dateString) {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
    setDate(dateString);
  }
  

  return (
    <Layout
      title="Government - Admin management"
      url={origin}
      origin={origin}
      user={login}
    >
      {contextHolder}
      <link
        rel="stylesheet"
        href="https://unpkg.com/react-quill@1.3.3/dist/quill.snow.css"
      ></link>
      <h1>เพิ่มข่าวประชาสัมพันธ์</h1>
      <div className="w-5/6 lg:w-full mx-auto">
        <Form
          name="basic"
          layout="vertical"
          onFinish={onSubmitHandler}
          requiredMark={true}
        >
          <Form.Item
            name="infor_title"
            label="ชื่อข่าวประชาสัมพันธ์ :"
            className="block text-gray-700 text-sm font-bold mb-2 w-full"
          >
            <TextArea
              id="#"
              type="text"
              placeholder="ชื่อข่าวประชาสัมพันธ์"
              className="resize-none border rounded-md"
              autoSize={{ minRows: 1, maxRows: 3 }}
            />
          </Form.Item>
          <Form.Item
            name="infor_detail"
            label="รายละเอียด :"
            className="block text-gray-700 text-sm font-bold mb-2 w-full"
          >
            <TextArea
              className="resize-none border rounded-md"
              placeholder="รายละเอียด..."
              autoSize={{ minRows: 10, maxRows: 15 }}
            />
          </Form.Item>
          <Form.Item
            name="infor_image"
            label="ภาพปกข่าวประชาสัมพันธ์ :"
            className="block text-gray-700 text-sm font-bold mb-2 w-full"
          >
            {/* <Dragger {...dropimg}> */}
            <Dragger>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibit from
                uploading company data or other band files
              </p>
            </Dragger>
          </Form.Item>
          <Form.Item
            name="infor_date"
            label="วันที่ลงข่าวประชาสัมพันธ์ :"
            className="block text-gray-700 text-sm font-bold mb-2 w-full "
          >
            <div className="w-full">
            <DatePicker showTime onChange={onChange}
             style={{
              width: '100%'
            }}
            />
            </div>
          </Form.Item>
          <Form.Item
            name="infor_keyword"
            label="Keyword สำหรับทำ SEO :"
            className="block text-gray-700 text-sm font-bold mb-2 w-full"
          >
            <TextArea
              id="#"
              type="text"
              placeholder="Keyword สำหรับทำ SEO :"
              className="resize-none border rounded-md"
              autoSize={{ minRows: 1, maxRows: 3 }}
            />
          </Form.Item>
          <Form.Item className="flex mt-6">
            <div className="lg:inline-flex w-full">
              <div className="inline-flex text-left w-full lg:w-1/2">
                <Switch onClick={actived}/>
                <p className="mx-2 text-sm">การแสดงผล</p>
              </div>
              <div className="text-center lg:text-right w-full lg:w-1/2">
                <Button
                  // type="primary"
                  style={{
                    backgroundColor: '#C2CFE0',
                    borderColor: '#C2CFE0',
                    height: 40,
                    width: 110,
                    marginBottom: '2px',
                    marginRight: '2px',
                    color: 'white !important',
                  }}
                  // htmlType="submit"
                  className="text-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full lg:w-1/4"
                >
                  <Text className="text-custom-black ">รีเซ็ท</Text>
                  
                </Button>
                <Button
                  // type="primary"
                  style={{
                    backgroundColor: '#059669',
                    borderColor: '#059669',
                    height: 40,
                    width: 110,
                    marginBottom: '0px !important',
                    color: 'white !important',
                  }}
                  htmlType="submit"
                  className="text-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full lg:w-1/4"
                >
                  <Text className="text-custom-white ">บันทึก</Text>
                </Button>
              </div>
            </div>
          </Form.Item>
        </Form>
      </div>

      <h4>admin/management/activities/add-activities.js</h4>
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

/*
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
Home.modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image', 'video'],
    ['clean'],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
Home.formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
];
