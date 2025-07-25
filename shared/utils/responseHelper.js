function success(res, data, status = 200) {
  res.status(status).json({ success: true, data });
}

function error(res, message, status = 500) {
  res.status(status).json({ success: false, error: message });
}

module.exports = { success, error };
