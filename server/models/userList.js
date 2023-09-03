module.exports = (sequelize, Sequelize) => {
  const UserList = sequelize.define('userList', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    address: {
      type: Sequelize.STRING,
      unique: true,
    },
    userName: {
      type: Sequelize.STRING,
      unique: true,
    },
    userBio: {
      type: Sequelize.STRING,
      unique: true,
    },
    userAvatar: {
      type: Sequelize.STRING,
      unique: true,
    },
    userBanner: {
      type: Sequelize.STRING,
      unique: true,
    },
  });

  return UserList;
};
