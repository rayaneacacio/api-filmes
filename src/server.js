require('express-async-errors');
const express = require('express');
const app = express();

app.use(express.json());

const routes = require('./routes/index');
app.use(routes);

const AppError = require('./utils/app-error');
app.use((error, request, response, next) => {
  if(error instanceof AppError){
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  }

  console.error(error);

  return response.status(500).json({
    status: "error",
    message: "Internal server error"
  });
})

const PORT = 3333;
app.listen(PORT, () => console.log(`server is running on ${PORT}`));