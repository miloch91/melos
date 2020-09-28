import express, { Request, Response } from "express";
import { Controller } from "./controller";
import cors from "cors";
import Authentification from "./authentification";

class App {
  public app: express.Application;
  public port: number;
  private auth = Authentification.getInstance()

  constructor(controllers: Array<Controller>, port: number) {
    this.app = express();
    this.port = port;

    this.auth.startAuthTokenCron();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares() {
    this.app.use(cors());
  }

  private initializeControllers(controllers: Array<Controller>) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;