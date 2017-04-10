import _ from "lodash";
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

DDPRateLimiter.setErrorMessage(({ timeToReset }) => {
  const time = Math.ceil(timeToReset / 1000);
  const seconds = time === 1 ? 'second' : 'seconds';
  return `Easy on the gas, buddy. Too many requests. Try again in ${time} ${seconds}.`;
});

export default function () {
  /**
   * Rate limit Logbook methods
   * 2 attempts per connection per 5 seconds
   */
  const logbookMethods = [
    "logbook.insert",
    "labresult.insert"
  ];

  DDPRateLimiter.addRule({
    name: (name) => _.includes(logbookMethods, name),
    connectionId: () => true
  }, 2, 5000);


  /**
   * Rate limit Calculator methods
   * 1 attempt per connection per 2 seconds
   */
  const calculatorMethods = [
	"calculator.calcICR",
	"calculator.calcISF"
	];
   
  DDPRateLimiter.addRule({
    name: (name) => _.includes(calculatorMethods, name),
    connectionId: () => true
  }, 1, 2000);
}