import User from './User';
import Role from './Role';
import Doctor from './Doctor';
import Course from './Course';
import Enrollment from './Enrollment';
import Membership from './Membership';
import Payment from './Payment';
import News from './News';

// Definir relaciones entre modelos

// User - Role (Many to One)
User.belongsTo(Role, {
  foreignKey: 'role_id',
  as: 'role'
});
Role.hasMany(User, {
  foreignKey: 'role_id',
  as: 'users'
});

// User - Doctor (One to One)
User.hasOne(Doctor, {
  foreignKey: 'user_id',
  as: 'doctor'
});
Doctor.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// User - Enrollment (One to Many)
User.hasMany(Enrollment, {
  foreignKey: 'user_id',
  as: 'enrollments'
});
Enrollment.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Course - Enrollment (One to Many)
Course.hasMany(Enrollment, {
  foreignKey: 'course_id',
  as: 'enrollments'
});
Enrollment.belongsTo(Course, {
  foreignKey: 'course_id',
  as: 'course'
});

// User - Course (Many to Many through Enrollment)
User.belongsToMany(Course, {
  through: Enrollment,
  foreignKey: 'user_id',
  otherKey: 'course_id',
  as: 'courses'
});
Course.belongsToMany(User, {
  through: Enrollment,
  foreignKey: 'course_id',
  otherKey: 'user_id',
  as: 'students'
});

// User - Membership (One to One)
User.hasOne(Membership, {
  foreignKey: 'user_id',
  as: 'membership'
});
Membership.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Membership - Payment (One to Many)
Membership.hasMany(Payment, {
  foreignKey: 'membership_id',
  as: 'payments'
});
Payment.belongsTo(Membership, {
  foreignKey: 'membership_id',
  as: 'membership'
});

// User - News (One to Many)
User.hasMany(News, {
  foreignKey: 'author_id',
  as: 'news'
});
News.belongsTo(User, {
  foreignKey: 'author_id',
  as: 'author'
});

export {
  User,
  Role,
  Doctor,
  Course,
  Enrollment,
  Membership,
  Payment,
  News
};
