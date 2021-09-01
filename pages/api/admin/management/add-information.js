import nextConnect from 'next-connect';
const models = require('../../../../db/models/index');
import middleware from '../../../../middleware/auth';
import { addDays } from '../../../../middleware/utils';
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

const handler = nextConnect()
  // Middleware
  .use(middleware)
  // Get method
  .get(async (req, res) => {
    return res.status(400).json({
      status: 400,
      message: 'deny permission!!',
    });
  })
  // Post method
  .post(async (req, res) => {
    const { body } = req;
    const { slug } = req.query;
    const { organization_id, infor_date, infor_title, infor_detail, infor_image, infor_keyword, infor_view, status_active } = body;
    // const userId = slug;

    const dataUser = {
      "organization_id": organization_id,
      "infor_date": infor_date,
      "infor_title": infor_title,
      "infor_detail": infor_detail,
      "infor_image": infor_image,
      "infor_keyword": infor_keyword,
      "infor_view": infor_view,
      "status_active": status_active
    };
    console.log(dataUser)
    if (organization_id == undefined || infor_date == undefined || infor_title == undefined || infor_detail == undefined || infor_image == undefined || infor_keyword == undefined || infor_view == undefined || status_active == undefined) {
      return res.status(200).json({
        status: 201,
        message: 'data incorrect',
        dataUser: dataUser,
      });
    }

    const newInformation = await models.information.create(dataUser);

    if (newInformation == null) {
      return res.status(500).json({
        status: 500,
        message: 'Internal error',
      });
    }

    return res.status(200).json({
      status: 200,
      message: 'Insert completed',
    });
  });

export default handler;
