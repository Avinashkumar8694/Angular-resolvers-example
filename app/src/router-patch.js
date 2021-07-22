// for router not working in cordova apps issue
window.addEventListener = function () {
  EventTarget.prototype.addEventListener.apply(this, arguments);
};
window.removeEventListener = function () {
  EventTarget.prototype.removeEventListener.apply(this, arguments);
};
document.addEventListener = function () {
  EventTarget.prototype.addEventListener.apply(this, arguments);
};
document.removeEventListener = function () {
  EventTarget.prototype.removeEventListener.apply(this, arguments);
};
