import models from '../../db/models/index';
import nextConnect from 'next-connect';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { message } from 'antd';

const KEY = process.env.JWT_KEY;

const handler = nextConnect()
  .get((req, res) => { })
  .post(async (req, res) => {
    /* Get Post Data */
    const { user_name, password } = req.body;
    /* Any how email or password is blank */
    if (!user_name || !password) {
      return res.status(200).json({
        status: 400,
        message: 'Request missing username or password',
      });
    }
    /* Check user in database */
    const user = await models.Users.findOne({
      where: { user_name: user_name, status_active: 1 },
      attributes: ['user_id', 'user_name', 'password', 'organization_id', 'type_user'],
      limit: 1,
    });
    /* Check if exists */
    if (!user) {
      return res.status(200).json({ status: 401, message: 'ไม่มีชื่อผู้ใช้นี้' });
    }
    /* Define variables */
    const dataUser = user.toJSON();
    // console.log(dataUser)
    const userId = dataUser.user_id,
      userEmail = dataUser.user_name,
      userPassword = dataUser.password,
      type_user = dataUser.type_user,
      organization_id = dataUser.organization_id ;
    /* Check and compare password */
    bcrypt.compare(password, userPassword).then(isMatch => {
      if (isMatch) {
        /* User matched */
        /* Create JWT Payload */
        const payload = {
          id: userId,
          email: userEmail,
          type_user: type_user,
          organization_id: organization_id
        };
        /* Sign token */
        jwt.sign(
          payload,
          KEY,
          {
            // expiresIn: 31556926, // 1 year in seconds
            expiresIn: 7200, // 1 year in seconds
          },
          (err, token) => {
            return res.status(200).json({
              status: 200,
              message: 'เข้าสู่ระบบสำเร็จ ',
              token: token,
            });
          },
        );
      } else {
        return res.status(200).json({ status: 402, message: 'ชื่อผู้ใช้หรือรหัสผ่านผิด' });
      }
    });
  });
export default handler;
