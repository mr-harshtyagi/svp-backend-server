// Path: routes/index.js
import express from "express";
const router = express.Router();
import { Gpio } from "pigpio";

const led = new Gpio(17, { mode: Gpio.OUTPUT });

router.get("/led-off", (req, res) => {
  led.pwmWrite(0);
  res.send({ response: "Led in OFF" }).status(200);
});

export default router;
