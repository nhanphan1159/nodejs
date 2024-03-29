const Course = require('../models/Course');
const { mutipleMongooseToObject } = require('../../util/mongoose');
class MeController {
  // [GET] /me/stored/courses
  storeCourses(req, res, next) {

    let coursesQuery = Course.find({});

    if(req.query.hasOwnProperty('_sort'))
    {
      const isValidtype = ['asc' , 'desc'].includes(req.query.type);

      coursesQuery = coursesQuery.sort({

        [req.query.column]: isValidtype ? req.query.type : 'desc'
      })
    }

    Promise.all([
      coursesQuery,
      Course.countDocumentsWithDeleted({ deleted: true }),
    ])
      .then(([courses, deletedCount]) =>
        res.render('me/store-courses', {
          deletedCount,
          courses: mutipleMongooseToObject(courses),
        }),
      )
      .catch(next);
  }

  // [GET] /me/trash/courses
  trashCourses(req, res, next) {
    Course.findWithDeleted({ deleted: true })
      .then((courses) =>
        res.render('me/trash-courses', {
          courses: mutipleMongooseToObject(courses),
        }),
      )
      .catch(next);
  }
}

module.exports = new MeController();
