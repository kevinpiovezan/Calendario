const Event = require('../models/EventModel');

exports.index = async (req, res) => {
  try {
    const { user } = req.session;
    if (user) {
      const horas = await new Event().queryEvents(user.email);
      return res.render(`index`, { horas });
    }
    return res.render(`index`, { horas: '' });
  } catch (e) {
    console.log(e);
    return res.render('404');
  }
};
