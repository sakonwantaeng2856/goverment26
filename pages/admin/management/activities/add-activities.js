import Link from 'next/link';
import dynamic from 'next/dynamic';
/* utils */
import {
  absoluteUrl,
  checkIsLogin,
  apiInstance,
} from '../../../../middleware/utils';

/* components */
import Layout from '../../../../components/layout/LayoutAdmin';
// import UserNav from '../components/navigation/User';
import React, { useEffect, useState, useRef } from 'react'

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

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
const { Text, Title } = Typography;

const { TextArea } = Input;
const config = require('./../../config');

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
  const editor = useRef(null)
  const [content, setContent] = useState('')

  useEffect(() => {
    _fetchUserLogin();
    fetch({ pagination });
    console.log("config")
    console.log(config.config)
  }, []);

  async function _fetchUserLogin() {
    const userLogin = await checkIsLogin();
    console.log(user);
  }

  const [slide, setSlide] = useState(1);
  const slider = () => {
    slide ? setSlide(0) : setSlide(1);
  };

  const [active, setActive] = useState(1);
  const actived = () => {
    active ? setActive(0) : setActive(1);
  };

  const [date, setDate] = useState('');

  async function onSubmitHandler(value) {
    const data = {
      organization_id: user.organization_id,
      activities_title: value.activities_title,
      activities_detail: value.activities_detail,
      // activities_image: value.activities_image,
      activities_image: 'abc.png',
      activities_date: date,
      // activities_date: '2001-01-31 17:00:00',
      activities_keyword: value.activities_keyword,
      is_slide: slide,
      status_active: active,
    };

    const addactivitiesData = await apiInstance().post(
      'admin/management/add-activities',
      data,
    );
    if (addactivitiesData.data.status == 200) {
      openNotificationRegisterSuccess();
      // setTimeout(function () { //Start the timer
      //   router.push('/login')
      // }.bind(this), 2000)
    } else {
      openNotificationRegisterFail(addactivitiesData.data.message);
    }
  }

  const validateURL = inputText => {
    setUrl(validator.trim(inputText));
  };

  const openNotificationRegisterSuccess = () => {
    api.success({
      message: `เพิ่มกิจกรรมสำเร็จ`,
      description: 'เพิ่มกิจกรรมสำเร็จแล้ว',
      placement: 'topRight',
    });
  };

  const openNotificationRegisterFail = messgae => {
    api.error({
      message: `พบปัญหาระหว่างการเพิ่มกิจกรรม`,
      description: messgae,
      placement: 'topRight',
    });
  };

  const contentStyle = {
    height: 'auto',
    textAlign: 'center',
  };


  const handleTableChange = (pagination, filters, sorter) => {
    fetch({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
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

  const [form] = Form.useForm();

  const onReset = () => {
    setActive(1)
    setSlide(1)
    form.resetFields();
  };

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

      <div className="w-5/6 lg:w-full mx-auto">
        <Form
          name="basic"
          layout="vertical"
          onFinish={onSubmitHandler}
          requiredMark={true}
          form={form}
        >
          <Form.Item
            name="activities_title"
            label="ชื่อกิจกรรม :"
            className="block text-gray-700 text-sm font-bold mb-2 w-full"
            rules={[
              {
                required: true,
                message: 'กรุณากรอกชื่อกิจกรรม',
              },
            ]}
          >
            <TextArea
              id="#"
              type="text"
              placeholder="ชื่อกิจกรรม"
              className="resize-none border rounded-md"
              autoSize={{ minRows: 1, maxRows: 3 }}
            />
          </Form.Item>
          <Form.Item
            name="activities_detail"
            label="รายละเอียด :"
            className="block text-gray-700 text-sm font-bold mb-2 w-full"
            rules={[
              {
                required: true,
                message: 'กรุณากรอกรายละเอียดกิจกรรม',
              },
            ]}
          >
            <JoditEditor
              ref={editor}
              value={content}
              config={config.config}
              height={"700px"}
              tabIndex={1} // tabIndex of textarea
              onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
              onChange={newContent => { }}
            />
          </Form.Item>
          <Form.Item
            name="activities_image"
            label="ภาพปกกิจกรรม :"
            className="block text-gray-700 text-sm font-bold mb-2 w-full"
            rules={[
              {
                required: true,
                message: 'กรุณากรอกเลือกภาพปกกิจกรรม',
              },
            ]}
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
            name="activities_date"
            label="วันที่ลงข่าวกิจกรรม :"
            className="block text-gray-700 text-sm font-bold mb-2 w-full "
            rules={[
              {
                required: true,
                message: 'กรุณากรอกเลือกวันที่ลงข่าวกิจกรรม',
              },
            ]}
          >

            <DatePicker
              className="w-full"
              showTime
              onChange={onChange}
              style={{
                width: '100%',
              }}
            />
          </Form.Item>
          <Form.Item
            name="activities_keyword"
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
              <div className="lg:inline-flex text-left w-1/2">
                <Switch checked={slide} onClick={slider} />
                <p className="mx-2 text-sm">ต้องการนำขึ้น Slide</p>
                <br />
                <Switch checked={active} onClick={actived} />
                <p className="mx-2 text-sm">การแสดงผล</p>
              </div>
              <div className="text-center lg:text-right w-full lg:w-1/2">
                <Button
                  htmlType="button"
                  onClick={onReset}
                  style={{
                    backgroundColor: '#C2CFE0',
                    borderColor: '#C2CFE0',
                    height: 40,
                    width: 110,
                    marginBottom: '0px !important',
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
