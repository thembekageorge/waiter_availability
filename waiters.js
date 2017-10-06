module.exports = function(models) {

  var Monday = [];
  var Tuesday = [];
  var Wednesday = [];
  var Thursday = [];
  var Friday = [];
  var Saturday = [];
  var Sunday = [];

  const waiters = function(req, res, next) {
    res.render('waiters')
  }

  const waiterAccess = function(req, res, next) {

    var firstLetter = req.params.username.substring(0, 1);
    var uppercase = req.params.username.substring(0, 1).toUpperCase()
    var username = req.params.username.replace(firstLetter, uppercase);
    var days = req.body.day


    models.waiterInfo.findOne({
        waiterName: username
      },
      function(err, results) {
        console.log(results);
        if (err) {
          return next(err)
        } else {
          if (results) {
            var data = {
              waiterName: results.waiterName,
              days: results.daysToWork
            }
            req.flash("name", "Welcome back  " + results.waiterName + ",  you can update your days")
            res.render("days", data)
          }
        }
        if (!results) {
          models.waiterInfo.create({
            waiterName: username,
          }, function(err, results) {
            if (err) {
              return next(err)
            }
            req.flash("name", "Hello  " + results.waiterName + ",   please select your  days")
            res.render('days')
          })
        }
      })
  }


  const days = function(req, res, next) {

    var daysObject = {};
    var firstLetter = req.params.username.substring(0, 1);
    var uppercase = req.params.username.substring(0, 1).toUpperCase()
    var username = req.params.username.replace(firstLetter, uppercase);
    var days = req.body.day;
    console.log(days);

    if (days === undefined) {
      var message = username + ", Select days"
      res.render('days', {
        output: message
      })
      return
    } else if (days.length < 3) {
      var message = username + ", Select 3 days "
      res.render('days', {
        output: message
      })
      return
    } else if (days.length > 3) {
      console.log(typeof(days) == 'object');
      if (typeof(days) == 'object') {
        console.log('Loop');
        var message = username + ", Select only 3 days "
      } else if (typeof(days) == 'string') {
        console.log('Loop 2');
        var message = username + ", Select 3 days "
      }

      res.render('days', {
        output: message
      })
    } else {


      if (!Array.isArray(days)) {
        days = [days]
      }

      days.forEach(function(day) {
        daysObject[day] = true

      });

      console.log(daysObject);
      console.log('========================');


      models.waiterInfo.findOneAndUpdate({
        waiterName: username
      }, {
        daysToWork: daysObject
      }, {
        new: true,
        returnNewDocument: true
      }, function(err, results) {
        console.log(results);
        console.log('========================');
        if (err) {
          return next(err)
        }

      });
      req.flash('error', "Thank you, " + username + " shift updated.")
      res.redirect('/waiters/' + username);
    }
  }

  function backgroundColor(colors) {
    if (colors === 3) {
      return "green";
    } else if (colors < 3) {
      return "yellow";
    } else if (colors > 3) {
      return "maroon";
    }
  }


  const admin = function(req, res, next) {
    Monday = [];
    Tuesday = [];
    Wednesday = [];
    Thursday = [];
    Friday = [];
    Saturday = [];
    Sunday = [];
    models.waiterInfo.find({}, function(err, reslt) {
      console.log(reslt);
      if (err) {
        return next(err)
      } else {
        for (var i = 0; i < reslt.length; i++) {
          console.log(reslt[i]);
          var curDays = reslt[i].daysToWork;
          for (var day in curDays) {
            if (day == 'Monday') {
              Monday.push(reslt[i].waiterName);
            } else if (day == 'Tuesday') {
              Tuesday.push(reslt[i].waiterName);
            } else if (day == 'Wednesday') {
              Wednesday.push(reslt[i].waiterName);
            } else if (day == 'Thursday') {
              Thursday.push(reslt[i].waiterName);
            } else if (day == 'Friday') {
              Friday.push(reslt[i].waiterName);
            } else if (day == 'Saturday') {
              Saturday.push(reslt[i].waiterName);
            } else if (day == 'Sunday') {
              Sunday.push(reslt[i].waiterName);
            } else {
              if (day != 'Monday') {
                req.flash("error", "No waiters for this day")
                render('days')
              }
              if (day != 'Tuesday') {
                req.flash("error", "No waiters for this day")
                render('days')
              }
              if (day != 'Wednesday') {
                req.flash("error", "No waiters for this day")
                render('days')
              }
              if (day != 'Thursday') {
                req.flash("error", "No waiters for this day")
                render('days')
              }
              if (day != 'Friday') {
                req.flash("error", "No waiters for this day")
                render('days')
              }
              if (day != 'Saturday') {
                req.flash("error", "No waiters for this day")
                render('days')
              }
              if (day != 'Sunday') {
                req.flash("error", "No waiters for this day")
                render('days')
              }
            }
          }
        }
      }
      res.render("admin", {
        mon: Monday,
        mondayColor: backgroundColor(Monday.length),

        tue: Tuesday,
        tuesdayColor: backgroundColor(Tuesday.length),

        wed: Wednesday,
        wednesdayColor: backgroundColor(Wednesday.length),

        thur: Thursday,
        thursdayColor: backgroundColor(Thursday.length),

        fri: Friday,
        fridayColor: backgroundColor(Friday.length),

        sat: Saturday,
        saturdayColor: backgroundColor(Saturday.length),

        sun: Sunday,
        sundayColor: backgroundColor(Sunday.length)

      });
    });
  }

  const clearHistory = function(req, res, next) {
    models.waiterInfo.remove({}, function(err, data) {
      if (err) {
        return next(err)
      }
      req.flash("error", " Schedule ready for next week")
      res.render("admin")
    })
  }


  return {
    waiters,
    waiterAccess,
    days,
    admin,
    clearHistory
  }
}
