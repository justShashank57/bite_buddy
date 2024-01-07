import express, { Application } from "express";
import { AdminRoute,VendorRoute, customerRoute, shoppingRoute } from "../routes";
import cookieParser from "cookie-parser";
import { checkUserExistence } from "../middlewares";
import path from 'path';

export default async (app:Application) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use('/images',express.static(path.join(__dirname,'../images')));
    // to provide 'user' local variable to the req-res cycle
    app.use(checkUserExistence);

    app.use('/admin',AdminRoute);
    app.use('/vendor',VendorRoute);
    app.use(shoppingRoute);
    app.use('/customer',customerRoute);
    return app;
}

