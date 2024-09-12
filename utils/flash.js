function flashDataToSession(req, data, action) {
  req.session.flash = data;
  req.session.save(action);
}

function getFlashedData(req) {
  const flashedData = req.session.flash;
  req.session.flash = null; // flash data survive during one cycle
  return flashedData;
}

module.exports = {
  flashDataToSession: flashDataToSession,
  getFlashedData: getFlashedData,
};
