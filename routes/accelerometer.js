// import express from "express";
// const router = express.Router();
// import { Gpio } from "pigpio";

// const led = new Gpio(17, { mode: Gpio.OUTPUT });

// // let dutyCycle = 0;

// // setInterval(() => {
// //   led.pwmWrite(dutyCycle);

// //   dutyCycle += 5;
// //   if (dutyCycle > 255) {
// //     dutyCycle = 0;
// //   }
// // }, 20);

// router.get("/accelerometer", (req, res) => {
//   led.pwmWrite(255);
//   res.send({ response: "Here is accelerometer data" }).status(200);
// });

// export default router;
