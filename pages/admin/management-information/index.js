import Link from 'next/link';
import reqwest from 'reqwest';
// import ReactQuill, {Quill} from 'react-quill';
// let ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;
import dynamic from 'next/dynamic';
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import ReactDOM, { flushSync } from 'react-dom';
// import { Editor } from "react-draft-wysiwyg";
// const Editor = dynamic(() => import("react-draft-wysiwyg"), { ssr: false });




// import FroalaEditor from 'react-froala-wysiwyg';
// const FroalaEditor = dynamic(() => import("react-froala-wysiwyg"), { ssr: false });
// // await import('fuse.js')
// import 'froala-editor/js/plugins/char_counter.min.js';
// const char_counter = dynamic(import("froala-editor/js/plugins/char_counter.min.js"));
//const char_counter = dynamic(() => import("froala-editor/js/plugins/char_counter.min.js"), { ssr: false });

// const Quill = dynamic(() => import("react-quill"), { ssr: false });
// import ReactQuill, { Quill } from 'react-quill'
// import ImageResize from 'quill-image-resize-module-react'
// ReactQuill.register('modules/imageResize', ImageResize)


// import FroalaEditorComponent from 'react-froala-wysiwyg';
// const FroalaEditorComponent = dynamic(() => import("react-froala-wysiwyg"), { ssr: false });
// const HTMLEditor = dynamic(() => import("react-jodit-editor"), { ssr: false });
// import HTMLEditor from "react-jodit-editor";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
// import JoditEditor from "jodit-react";
// import 'froala-editor/js/plugins/char_counter.min.js';
// Import all Froala Editor plugins;
// import 'froala-editor/js/plugins.pkgd.min.js';

// Import a single Froala Editor plugin.
// import 'froala-editor/js/plugins/align.min.js';

// Import a language file.
// import 'froala-editor/js/languages/de.js';

// Import a third-party plugin.
// import 'froala-editor/js/third_party/image_tui.min.js';
// import 'froala-editor/js/third_party/embedly.min.js';
// import 'froala-editor/js/third_party/spell_checker.min.js';

// Include font-awesome css if required.
// install using "npm install font-awesome --save"
// import 'font-awesome/css/font-awesome.css';
// import 'froala-editor/js/third_party/font_awesome.min.js';

// Include special components if required.
// import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';
// import FroalaEditorA from 'react-froala-wysiwyg/FroalaEditorA';
// import FroalaEditorButton from 'react-froala-wysiwyg/FroalaEditorButton';
// import FroalaEditorImg from 'react-froala-wysiwyg/FroalaEditorImg';
// import FroalaEditorInput from 'react-froala-wysiwyg/FroalaEditorInput';


/* utils */
import { absoluteUrl, checkIsLogin } from '../../../middleware/utils';

/* components */
import Layout from '../../../components/layout/LayoutAdmin';
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
  Switch,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
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
  const [value, setValue] = useState(1);
  const [userInfo, setUserInfo] = useState(false);

  const { user, origin } = props;
  const [login, setLogin] = useState(null)
  const [shouldRun, setShouldRun] = useState(true)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
  })

  let [text, setText] = useState("");
  let [files, setFiles] = useState([]);

  const editor = useRef(null)
  const [content, setContent] = useState('')

  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
    uploader: {
      url: "/api/upload",
      insertImageAsBase64URI: false,
      "imagesExtensions": [
        "jpg",
        "png",
        "jpeg",
        "gif"
      ],
      prepareData: function (data) {
        if (user.type_user == 1) {
          data.append('id', "admin"); // 

        } else {
          data.append('id', user.organization_id); // 

        }
      },
      defaultHandlerSuccess: function (data, resp) {
        var i, field = this.options.uploader.filesVariableName;




        if (data.type === "file") {
          console.log("success file")
          console.log(data)
          var textHTML = "";
          data.list.forEach(element => {
            var extension = "";
            var i = element.name.lastIndexOf('.');
            if (i > 0) {
              extension = element.name.substring(i + 1);
            }
            var _path = element.path.replace("public", "");
            if (extension == "jpg" || extension == "png" || extension == "jpeg" || extension == "gif") {
              //your code
              
              textHTML += '<img src="' + _path + '"/>'
            } else {

              textHTML += '<a class="file-attach" href="' + _path + '">' + element.name + '</a></br>'
            }
          });
          this.selection.insertHTML(textHTML);
        } else {
          console.log("success image")
          console.log(data.files[0])
          var textHTML = "";

          // if (data.files && data.files.length) {
          //   // for (i = 0; i < data.files.length; i += 1) {
          //   // textHTML += '<img src="' + data.baseurl + data.files[i] + '"/>'
          //   // console.log( data.files[i])

          //   this.selection.insertImage(data.files[0]);
          //   this.selection.insertHTML("</br>");

          //   // }
          // }
          // this.selection.insertHTML(textHTML);

        }

        // parent.selection.insertHTML('<img src="image.png"/>');
      },
    },
    // filebrowser: {
    //   ajax: {
    //     url: "/public/uploads/c-admin/",
    //   },
    //   uploader: {
    //      url:"/api/upload"
    //   },
    // },
  }

  function onChange(checked) {
    if (checked) {
      setValue(1);
    } else {
      setValue(0);

    }
    console.log(`switch to ${checked}`);
  }

  const contentStyle = {
    height: 'auto',
    textAlign: 'center',
  };

  useEffect(() => {
    // checkIsLogin
    _fetchUserLogin()
    // console.log(userInfo)
    // fetchJS
    // ReactDOM.render(<FroalaEditor tag='textarea' />, document.getElementById('editor'));
  }, [])

  async function _fetchUserLogin() {
    const userLogin = await checkIsLogin()
    console.log(user)
    // setUserInfo(userLogin)
  }
  // const config = {
  //   placeholderText: 'Edit Your Content Here!',
  //   charCounterCount: true,
  //   // fullPage: true,
  //   // attribution: false
  //   // toolbarButtons: [
  //   //   ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript'],
  //   //   ['fontFamily', 'fontSize', 'textColor', 'backgroundColor'],
  //   //   ['inlineClass', 'inlineStyle', 'clearFormatting']],
  //   indexOf: key => Object.keys(this).indexOf(key),
  //   'moreText': {
  //     'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize']
  //   },
  //   'moreParagraph': {
  //     'buttons': ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL']
  //   },
  //   'moreRich': {
  //     'buttons': ['insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'fontAwesome']
  //   },
  //   'moreMisc': {
  //     'buttons': ['undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'html', 'help'],
  //     'align': 'right',
  //     'buttonsVisible': 2
  //   }
  // }

  return (
    <Layout title="Government - Admin management" url={origin} origin={origin} user={login} >

      <div>
        <h1>management-infomation</h1>
        <h4>admin/management-infomation/index.js</h4>
      </div>
      {/* <ReactQuill
        value={value}
        onChange={setValue}
        modules={_modules}
        // modules={{
        //   toolbar: {
        //     container: [
        //       [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        //       ['bold', 'italic', 'underline'],
        //       [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        //       [{ 'align': [] }],
        //       ['link', 'image'],
        //       ['clean'],
        //       [{ 'color': [] }]
        //     ],
        //     handlers: {
        //       image: imageHandler
        //     }
        //   },
        //   table: true
        // }}
        formats={_formats}
      /> */}
      {/* <textarea id="editor"></textarea> */}
      {/* <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/froala-editor@latest/js/froala_editor.pkgd.min.js"></script> */}

      {/* <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.3.0/codemirror.min.js"></script> */}
      {/* <FroalaEditorComponent
        tag='textarea'
        config={config}
        model={value}
        onModelChange={setValue}
      /> */}
      {/* <HTMLEditor
        onChange={setText}
        uploadFiles={setFiles}
        files={files}
      /> */}
     
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={1} // tabIndex of textarea
        onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
        onChange={newContent => {  }}
      />
      <span>{userInfo}</span>
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

