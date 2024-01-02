import express from 'express';
import App from './services/expressApp';
import connectDB from './services/database';

const startServer = async() => {
      const app = express();
      await connectDB();
      await App(app);

      app.listen(8000,()=>{
          console.log("Listening to port : 8000");
      })
}

startServer();