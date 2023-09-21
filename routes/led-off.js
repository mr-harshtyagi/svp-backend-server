// Path: routes/index.js
import express from "express";
const router = express.Router();
const Gpio = require("pigpio").Gpio;

const led = new Gpio(17, { mode: Gpio.OUTPUT });

router.get("/led-off", (req, res) => {
  led.pwmWrite(0);
  res.send({ response: "Led in ON" }).status(200);
});

export default router;
