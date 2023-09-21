// Path: routes/index.js
import express from "express";
const router = express.Router();
import { Gpio } from "pigpio";

const led = new Gpio(17, { mode: Gpio.OUTPUT });

// let dutyCycle = 0;

// setInterval(() => {
//   led.pwmWrite(dutyCycle);

//   dutyCycle += 5;
//   if (dutyCycle > 255) {
//     dutyCycle = 0;
//   }
// }, 20);

router.get("/led-on", (req, res) => {
  led.pwmWrite(255);
  res.send({ response: "Led in ON" }).status(200);
});

export default router;
