import raven from "raven";
import bunyan from "bunyan";
import bunyanFormat from "bunyan-format";
import Bunyan2Loggly from "bunyan-loggly";
import { includes } from "lodash";

// configure bunyan logging module for reaction server
// See: https://github.com/trentm/node-bunyan#levels
const levels = ["FATAL", "ERROR", "WARN", "INFO", "DEBUG", "TRACE"];

// set stdout log level
let level = Meteor.settings.LOG_LEVEL || "INFO";

level = level.toUpperCase();

if (!includes(levels, level)) {
  level = "INFO";
}

// default console config (stdout)
const streams = [{
  level,
  stream: bunyanFormat({ outputMode: "short" })
}];

// Loggly config (only used if configured)
const logglyToken = Meteor.settings.LOGGLY_TOKEN;
const logglySubdomain = Meteor.settings.LOGGLY_SUBDOMAIN;

if (logglyToken && logglySubdomain) {
  const logglyStream = {
    type: "raw",
    level: Meteor.settings.LOGGLY_LOG_LEVEL || "DEBUG",
    stream: new Bunyan2Loggly({
      token: logglyToken,
      subdomain: logglySubdomain
    })
  };
  streams.push(logglyStream);
}

// create logger instance
export const Logger = bunyan.createLogger({
  name: "myDiabetes",
  streams
});

// Create raven instance
raven.config(Meteor.settings.public.sentryKey).install();

export const Exception = raven;