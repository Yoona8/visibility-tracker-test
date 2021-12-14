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
window.setLogging = (config) => {
  const {frequency = 500, customLog} = config;

  logFrequency = frequency;
  logCustom = customLog;
  resetLog();

  if (!checkIsInViewport()) {
    clearLog();
  }
};

/**
* Logs the viewability values to the console
* if the custom logger is not specified
*/
const log = () => {
  if (logCustom) {
    logCustom(adIsViewable, Math.ceil(viewabilityTime));
    return;
  }

  console.log("Ad is viewable: ", adIsViewable, "\nViewability time of the ad in sec:", Math.ceil(viewabilityTime));
};

const resetLog = () => {
  adIsViewable = true;

  if (logInterval) {
    return;
  }

  logInterval = setInterval(() => {
    if (adIsViewable) {
      viewabilityTime += logFrequency / MS_IN_SEC;
    }

    log();
  }, logFrequency);
};

const clearLog = () => {
  // maybe clear the interval
  adIsViewable = false;
  viewabilityTime = 0;
};

const onVisibilityChange = () => {
  if (document.hidden) {
    clearLog();
    return;
  }

  resetLog();
};

const onWindowBlur = () => {
  clearLog();
};

const onWindowFocus = () => {
  resetLog();
};

const checkIsInViewport = () => {
  const clientHeight = document.documentElement.clientHeight;
  const clientWidth = document.documentElement.clientWidth;
  const elementCoordinates = adElement.getBoundingClientRect();
  
  if (
    elementCoordinates.top < 0 
    || elementCoordinates.left < 0
    || (clientWidth - elementCoordinates.right) < 0
    || (clientHeight - elementCoordinates.bottom) < 0
  ) {
    return false;
  }

  return true;
};

const onScroll = () => {
  if (!checkIsInViewport()) {
    clearLog();
    return;
  }

  resetLog();
};

document.addEventListener('visibilitychange', onVisibilityChange);
window.addEventListener('blur', onWindowBlur);
window.addEventListener('focus', onWindowFocus);
window.addEventListener('scroll', onScroll);
