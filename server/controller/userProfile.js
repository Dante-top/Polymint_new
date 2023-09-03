const db = require('../models');
const UserListDB = db.userList;
const dotenv = require('dotenv');
dotenv.config();
const sequelize = require('sequelize');
const Op = sequelize.Op;

exports.getProfile = async (req, res, next) => {
  console.log('address: ', req.query.address);
  if (!req.query.address) {
    res.status(400).send({
      success: false,
      message: 'Content can not be empty!',
    });
    return;
  }

  const user = await UserListDB.findOne({ where: { address: req.query.address } });
  console.log('user: ', user);
  if (user) {
    console.log('user: ', user);
    res.json({
      success: true,
      userName: user.userName,
      userBio: user.userBio,
      userAvatar: user.userAvatar,
      userBanner: user.userBanner,
    });
  }
};

exports.saveProfile = async (req, res, next) => {
  if (!req.body.address || !req.body.userName || !req.body.userBio || !req.body.userAvatar || !req.body.userBanner) {
    res.status(400).send({
      success: false,
      message: 'Content can not be empty!',
    });
    return;
  }

  const user = await UserListDB.findOne({ where: { address: req.body.address } });
  const address = req.body.address;
  const userName = req.body.userName;
  const userBio = req.body.userBio;
  const userAvatar = req.body.userAvatar;
  const userBanner = req.body.userBanner;
  if (user) {
    user.update({
      address: address,
      userName: userName,
      userBio: userBio,
      userAvatar: userAvatar,
      userBanner: userBanner,
    });
    res.json({
      success: true,
      message: 'Profile successfully updated.',
    });
  } else {
    UserListDB.create({
      address: address,
      userName: userName,
      userBio: userBio,
      userAvatar: userAvatar,
      userBanner: userBanner,
    });
    res.json({
      success: true,
      message: 'Profile successfully created.',
    });
  }
};
