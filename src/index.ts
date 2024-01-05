import express from 'express';
import App from './services/expressApp';
import connectDB from './services/database';
import { PORT } from './config';

const startServer = async() => {
      const app = express();
      await connectDB();
      await App(app);

      app.listen(PORT,()=>{
          console.log(`Listening to port : ${PORT}`);
      })
}

startServer();