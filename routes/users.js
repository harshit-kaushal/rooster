var express = require('express');
var router = express.Router();
var argon2 = require('argon2');


//                                                                    ROLES

router.post('/manager/role/new', function(req, res, next) {

  req.pool.getConnection(function(err,connection){
    if(err){
      res.sendStatus(500);
      console.log(err);
      return;
    }

    var query="INSERT INTO roles (fname, lname, roles) VALUES (?,?,?)";
    connection.query(query, [req.body.first, req.body.last, req.body.position], function(err, rows, fields){
      connection.release();
      if(err){
        console.log(err);
        res.sendStatus(500);
        return;
      }
      res.end();
    });
  });
});

router.get('/manager/loadroles',function(req, res, next){
  req.pool.getConnection(function(err,connection){
    if(err){
      res.sendStatus(500);
      console.log(err);
      return;
    }

    var query="SELECT roles.fname, roles.lname, roles.roles FROM roles INNER JOIN staff ON staff.fname = roles.fname AND staff.lname = roles.lname WHERE staff.manager=?";
    connection.query(query,[req.session.user.ID],function(err, rows, fields){
      connection.release();
      if(err){
        res.sendStatus(500);
        console.log(err);
        return;
      }

      res.json(rows);
    });
  });
});



//                                                                      STAFF

router.post('/manager/staff/new', function(req, res, next){

  req.pool.getConnection(function(err,connection){
    if(err){
      res.sendStatus(500);
      console.log(err);
      return;
    }

    var query="INSERT INTO staff (fname, lname, email, phone, roles, manager, password) VALUES (?,?,?,?,?,?,'$argon2i$v=19$m=4096,t=3,p=1$G4+rEB1qkqPUgwKiCcutDw$+4TAPbNR2Jcf5Lep7NAbJ+oFO1h5NzsoFXKmiFKdqgY')";
    connection.query(query, [req.body.first, req.body.last, req.body.mail, req.body.phone, req.body.position, req.session.user.ID], function(err, rows, fields){
      connection.release();
      if(err){
        console.log(err);
        res.sendStatus(500);
        return;
      }

      res.end();
    });
  });
});

router.get('/manager/loadstaff',function(req, res, next){

  req.pool.getConnection(function(err,connection){
    if(err){
      res.sendStatus(500);
      console.log(err);
      return;
    }

    var query="SELECT staff.fname, staff.lname, staff.email, staff.phone, staff.roles FROM staff INNER JOIN manager ON staff.manager = manager.id WHERE manager.id=?";
    connection.query(query,[req.session.user.ID],function(err, rows, fields){
      connection.release();
      if(err){
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});



//                                                                      SHIFTS

router.post('/manager/shift/new', function(req, res, next){
  req.pool.getConnection(function(err,connection){
    if(err){
      res.sendStatus(500);
      console.log(err);
      return;
    }

    var query="INSERT INTO shifts (fname, lname, tstart, tend, roles, descript) VALUES (?,?,?,?,?,?)";
    connection.query(query, [req.body.first, req.body.last, req.body.start, req.body.end, req.body.position, req.body.desc], function(err, rows, fields){
      connection.release();
      if(err){
        console.log(err);
        res.sendStatus(500);
        return;
      }

      res.end();
    });
  });
});


router.get('/loadshifts',function(req, res, next){

  if(req.session.user.Manager===1){

    req.pool.getConnection(function(err,connection){
      if(err){
        res.sendStatus(500);
        console.log(err);
        return;
      }

      var query="SELECT shifts.fname, shifts.lname, shifts.tstart, shifts.tend, shifts.roles, shifts.descript FROM shifts INNER JOIN staff ON staff.fname = shifts.fname AND staff.lname = shifts.lname INNER JOIN manager ON staff.manager = manager.id WHERE manager.id=?";
      connection.query(query,[req.session.user.ID], function(err, rows, fields){
        connection.release();
        if(err){
          res.sendStatus(500);
          console.log(err);
          return;
        }
        res.json(rows);
      });
    });
  }

  else{

    req.pool.getConnection(function(err,connection){
      if(err){
        res.sendStatus(500);
        console.log(err);
        return;
      }

      var query="SELECT shifts.fname, shifts.lname, shifts.tstart, shifts.tend, shifts.roles, shifts.descript FROM shifts INNER JOIN staff ON staff.fname = shifts.fname AND staff.lname = shifts.lname AND staff_id=?";
      connection.query(query,[req.session.user.ID],function(err, rows, fields){
        connection.release();
        if(err){
          res.sendStatus(500);
          console.log(err);
          return;
        }
        res.json(rows);
      });
    });
  }
});


//                PROFILE


router.post('/updateprof',function(req, res, next){

  if(req.session.user.Manager===1){

    req.pool.getConnection( async function(err,connection){
      if(err){
        res.sendStatus(500);
        console.log(err);
        return;
      }

      try {
        const hash = await argon2.hash(req.body.pass);
        console.log(hash);
        var query="UPDATE manager SET fname=?, lname=?, email=?, phone=?, password=? WHERE manager.id=?";
        connection.query(query, [req.body.fname, req.body.lname, req.body.email, req.body.phone, hash, req.session.user.ID],  function(err, rows, fields){
          connection.release();

          if(err){
            console.log(err);
            res.sendStatus(500);
            return;
          }

          res.sendStatus(200);
        });

      }
      catch (err){
        //...
      }
    });
  }

  else{

    req.pool.getConnection(async function(err,connection){
      if(err){
        res.sendStatus(500);
        console.log(err);
        return;
      }

      try {
          const hash = await argon2.hash(req.body.pass);
          console.log(hash);
          var query="UPDATE staff SET fname=?, lname=?, email=?, phone=?, password=? WHERE staff.staff_id=?";
          connection.query(query, [req.body.fname, req.body.lname, req.body.email, req.body.phone, hash, req.session.user.ID], function(err, rows, fields){
            connection.release();

            if(err){
              console.log(err);
              res.sendStatus(500);
              return;
            }

            res.sendStatus(200);
          });
      }

      catch (err) {
        //...
      }
    });
  }
});

router.get('/loadprofile',function(req, res, next){

  if(req.session.user.Manager===1){

    req.pool.getConnection(function(err,connection){
      if(err){
        res.sendStatus(500);
        console.log(err);
        return;
      }

      var query="SELECT manager.fname, manager.lname, manager.email, manager.phone FROM manager WHERE manager.id=?";
      connection.query(query,[req.session.user.ID],function(err, rows, fields){
        connection.release();
        if(err){
          res.sendStatus(500);
          console.log(err);
          return;
        }
        res.json(rows);
      });
    });
  }

  else{

    req.pool.getConnection(function(err,connection){
      if(err){
        res.sendStatus(500);
        console.log(err);
        return;
      }

      var query="SELECT staff.fname, staff.lname, staff.email, staff.phone FROM staff WHERE staff.staff_id=?";
      connection.query(query,[req.session.user.ID],function(err, rows, fields){
        connection.release();
        if(err){
          res.sendStatus(500);
          console.log(err);
          return;
        }
        res.json(rows);
      });
    });
  }
});



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});




module.exports = router;
