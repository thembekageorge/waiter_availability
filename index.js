const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser')
const flash = require('express-flash');
const session = require('express-session');
const WaiterRoutes = require('./waiters');
const Models = require('./models');
const models = Models(process.env.MONGO_DB_URL || 'mongodb://<user>:<user1>@ds113435.mlab.com:13435/waiterapp');
const waiterRoutes = WaiterRoutes(models);
const app = express();

app.engine('.handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static('public'));

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 * 30 }}));
app.use(flash());

app.get('/', function(req,res){
        res.redirect('/waiters');
})

app.get('/waiters', waiterRoutes.waiters);

app.get('/waiters/:username', waiterRoutes.waiterAccess);
app.post('/waiters/:username', waiterRoutes.days);
app.get('/admin', waiterRoutes.admin);
// app.get('/clear', waiterRoutes.clearHistory)
// app.post('/clear', waiterRoutes.clearHistory)

const port = process.env.PORT || 5000;
app.listen(port, function(){
        console.log('App running on port: ' + port);
})
