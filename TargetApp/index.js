const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const path = require('path');
const cookieParser = require('cookie-parser');

//CSRF protection- start
const csurf = require('csurf');
//CSRF protection- end


const app = express();
const port = 3000;

// set PUG as view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(bodyParser.urlencoded({extended:true}));//to access form data from url

//session middleware to keep login session
app.use(session({
  secret: "secretkeyforencryption",
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false}
}))


//Mock user login and return a mock user in session

app.get('/login', (req,res)=> {
  req.session.userId = 'user123';
  console.log(`User ${req.session.userId} logged in`);
  res.redirect('/')
})


// Creating a middleware to ensure user is logged in, if not then redirect to login route
app.use((req,res,next) => {
  if(!req.session.userId && req.path !== '/login'){
    return res.redirect('/login')
  }
  next();
})


//CSRF protection- start
//CSRF Middleware
app.use(csurf());

app.use((err, req, res, next) => {
  if(err.code === 'EBADCSRFTOKEN'){
    res.status(403);
    res.render('error', {message: "Invalid CSRF token.Request Denied"})
  }else{
    next(err)
  }
})

//CSRF protection- end

app.get('/', (req,res) => {
  res.render('index', {message: 'Welcome! you are logged in, Try to transfer money'})
})

app.get('/transfer', (req,res) => {
  //res.render('transfer', {message: 'Enter transfer details: '})

  //CSRF Protection - Start
  res.render('transfer', {
    message: 'Enter transfer details: ',
    csrfToken: req.csrfToken()
  })

  //CSRF protection - end
})

app.post('/transfer', (req,res) => {
  const {recipient, amount} = req.body;
  const userId = req.session.userId;

  if (!recipient || !amount){
    return res.status(400).render('transfer', {message: 'Both recipient and amount are required '})
  }

  console.log('Transfer money completed');
  res.render('transfer', {message: `SUCCESS! ${amount} transferred to  ${recipient}`})
})

app.listen(port, ()=> {
  console.log(" Target bank app is running at port 3000")
})