var express = require('express');
var router = express.Router();
var argon2 = require('argon2');
const CLIENT_ID='268702507862-shs30eanp0pascoccsv2lnnaclo4nj9b.apps.googleusercontent.com';
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//                LOGIN

router.post('/login', function(req, res, next) {

  req.pool.getConnection(function(err,connection){
    if(err){
      res.sendStatus(500);
      console.log(err);
      return;
    }

    var query="SELECT * FROM manager WHERE email = ?";
    connection.query(query, [req.body.user], async function(err, rows, fields){
      connection.release();
      if(err){
        res.sendStatus(500);
        return;
      }

      if(rows.length > 0){
        try {
          if (await argon2.verify(rows[0].password, req.body.pass)) {
              req.session.user={Name:rows[0].fname+" "+rows[0].lname, Email:rows[0].email, Manager:rows[0].managerchk, ID:rows[0].id};
              console.log(req.session);
              res.sendStatus(200);
              }
        }
        catch (err) {

        }
      }

      else {
        req.pool.getConnection(function(err,connection){
          if(err){
            res.sendStatus(500);
            return;
          }
          var query="SELECT * FROM staff WHERE email = ?";
          connection.query(query, [req.body.user], async function(err, rows, fields){
            connection.release();
            if(err){
              res.sendStatus(500);
              return;
            }

            console.log(rows[0]);

            if(rows.length > 0){
              try {
                if (await argon2.verify(rows[0].password, req.body.pass)) {
                  req.session.user={Name:rows[0].fname+" "+rows[0].lname, Email:rows[0].email, ID:rows[0].staff_id};
                  console.log(req.session);
                  res.sendStatus(201);
                }
              }catch (err) {}
            }

            else{
              res.sendStatus(401);
            }
          });
       });
      }
    });
  });
});


router.post('/tokensignin',  async function(req, res, next) {

  const ticket = await client.verifyIdToken({
      idToken: req.body.idtoken,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
   });

  const payload = ticket.getPayload();
  const email = payload['email'];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];

  req.pool.getConnection(function(err,connection){
    if(err){
      res.sendStatus(500);
      console.log(err);
      return;
    }

    var query="SELECT * FROM manager WHERE email = ?";
    connection.query(query, [email], async function(err, rows, fields){

      connection.release();
      if(err){
        res.sendStatus(500);
        return;
      }

      if(rows.length > 0){
        req.session.user={Name:rows[0].fname+" "+rows[0].lname, Email:rows[0].email, Manager:rows[0].managerchk, ID:rows[0].id};
        console.log(req.session);
        res.sendStatus(200);
      }

      else {
        req.pool.getConnection(function(err,connection){
          if(err){
            res.sendStatus(500);
            return;
          }
          var query="SELECT * FROM staff WHERE email = ?";
          connection.query(query, [email], async function(err, rows, fields){
            connection.release();
            if(err){
              res.sendStatus(500);
              return;
            }
            console.log(rows[0]);
            if(rows.length > 0){
                  req.session.user={Name:rows[0].fname+" "+rows[0].lname, Email:rows[0].email, ID:rows[0].staff_id};
                  console.log(req.session);
                  res.sendStatus(201);
            }
            else {
                res.sendStatus(401);
              }
          });
        });
      }
    });
  });
});


//                REGISTER
router.post('/register', function(req, res, next) {

  req.pool.getConnection( async function(err,connection){
    if(err){
      res.sendStatus(500);
      console.log(err);
      return;
    }
      try {
        const hash = await argon2.hash(req.body.pass);
        console.log(hash);
        var query="INSERT INTO manager(fname, lname, email, phone, managerchk, password) VALUES(?,?,?,?,1,?)";
        connection.query(query, [req.body.fname, req.body.lname, req.body.email, req.body.phone, hash], function(err, rows, fields){
          connection.release();
          if(err){
            console.log(err);
            res.sendStatus(500);
            return;
          }
            req.session.user={Name:req.body.fname+" "+req.body.lname, Email:req.body.email, ID:req.body.managerchk};
            console.log(req.session);
            res.sendStatus(200);

        });
      } 
      catch (err) {
        //...
      }
  });
});



router.get('/dbtest', async function(req, res, next){

  // req.pool.getConnection(function(err,connection){
  //   if(err){
  //     res.sendStatus(500);
  //     next();
  //   }

  //   var query="SHOW TABLES";
  //   connection.query(query,function(err, rows, fields){
  //     connection.release();
  //     if(err){
  //       res.sendStatus(500);
  //       return;
  //     }
  //     res.json(rows);
  //   });
  // });
try {
  const hash = await argon2.hash("test1");
  console.log(hash);
} catch (err) {
  //...
}
});



//                LOGOUT

router.post('/logout', function(req, res, next) {
  console.log(req.session);
  delete req.session.user;
  res.sendStatus(200);
  console.log("User logged out successfully.");
});


module.exports = router;