// const db = require('../db');
// const { Sequelize } = db;
// const List = require('./List');

// const Group = db.define('group', {
//   id: {
//     type: Sequelize.UUID,
//     allowNull: false,
//     primaryKey: true,
//     defaultValue: Sequelize.UUIDV4,
//   },

//   groupName: {
//     type: Sequelize.STRING,
//     allowNull: false,
//     validate: {
//       notNull: {
//         msg: 'Group name required',
//       },
//       notEmpty: {
//         args: true,
//         msg: 'Group name cannot be empty',
//       },
//     },
//   },

//   groupOwner: {
//     type: Sequelize.STRING,
//   },
// });

// // instance methods

// Group.prototype.createListToGroup = function (newList) {
//   return this.createList(newList).catch((e) => {
//     throw e;
//   });
// };

// module.exports = Group;
