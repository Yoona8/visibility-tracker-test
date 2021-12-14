const MS_IN_SEC = 1000;

let adIsViewable = true;
let viewabilityTime = 0;
let logFrequency = 500;
let logCustom = null;
let logInterval = null;
const adElement = document.getElementById("ad");

/**
 * Description of the custom logging function
 * 
 * @callback ILog
 * @param {boolean} adIsVisible Ad is visible or not
 * @param {number} viewabilityTime Viewability time of the ad (in sec) 
 */

/**
 * Initializes the logger
 * 
 * @param {object} config Logger configuration
 * @param {number} config.frequency Logging frequency (in ms)
 * @param {ILog} config.customLog Custom logging function
 */
window.setLogging = function (config) {
  const {frequency = 500, customLog} = config;

  logFrequency = frequency;
  logCustom = customLog;
  resetLog();
};

/**
* Logs the viewability values in the console
*
* @override
*/
const log = function () {
  if (logCustom) {
    logCustom(adIsViewable, Math.ceil(viewabilityTime));
    return;
  }

  console.log("Ad is viewable: ", adIsViewable, "\nViewability time of the ad in sec:", Math.ceil(viewabilityTime));
};

const resetLog = function () {
  adIsViewable = true;

  logInterval = setInterval(function () {
    viewabilityTime += logFrequency / MS_IN_SEC;
    log();
  }, logFrequency);
};
