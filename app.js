require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cron = require('node-cron');
const cors = require("cors");
const schedule_clear_token = require("./utils/crons/schedule_clear_token");
const schedule_check_reservation = require("./utils/crons/schedule_check_reservation");

const indexRouter = require('./routes/index');

const authRouter = require("./routes/auth");
const tokenRouter = require("./routes/token");
const authMiddleware = require("./middlewares/auth.middleware");
const rolesRouter = require("./routes/roles");
const userRouter = require("./routes/user");
const categoryRouter = require("./routes/category");
const utilityRouter = require("./routes/utility");
const cloudinaryRouter = require("./routes/cloudinary");
const propertyRouter = require("./routes/property");
const stripeRouter = require("./routes/stripe");
const reservationRouter = require("./routes/reservation");

const categoryPublicRouter = require("./routes/public/category_public");
const propertyPublicRouter = require("./routes/public/property_public");
const chatRouter = require("./routes/chat");

// handle socket func
const { chat_socket_handler } = require("./sockets/chat");

// socket
const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use((req, res, next) => {
  req.app.io = io;
  next();
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  cors({
    origin: "*",
  })
)

cron.schedule("*/30 * * * *", schedule_clear_token);
cron.schedule("0 0 * * *", schedule_check_reservation);

app.use('/', indexRouter);
app.use("/chat", chatRouter);
app.use('/auth', authRouter);
app.use('/token', tokenRouter);
app.use('/category_public', categoryPublicRouter);
app.use('/property_public', propertyPublicRouter);
app.use(authMiddleware);
app.use('/roles', rolesRouter);
app.use('/users', userRouter);
app.use('/categories', categoryRouter);
app.use('/utilities', utilityRouter);
app.use('/cloudinary', cloudinaryRouter);
app.use('/property', propertyRouter);
app.use('/stripe', stripeRouter);
app.use('/reservation', reservationRouter);

chat_socket_handler(io);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = { app, server };