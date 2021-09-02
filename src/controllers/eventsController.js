const Event = require('../models/EventModel');

exports.index = async (req, res) => {
  try {
    res.render(`events`, {
      event: '',
      eventDate: req.params.eventDate,
      horaTermino: '',
      date: req.params.date,
      eventDateTermino: req.params.eventDateTermino,
    });
  } catch (e) {
    console.log(e);
    return res.render('404');
  }
};
exports.create = async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.create();

    if (event.errors.length > 0) {
      req.flash('errors', event.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }
    req.flash('success', 'Evento registrado com sucesso.');
    req.session.save(() => res.redirect(`/myevents`));
    return;
  } catch (e) {
    console.log(e);
    return res.render('404');
  }
};
exports.read = async (req, res) => {
  try {
    const { user } = req.session;
    const events = await new Event().query(user.email);
    const horas = await new Event().queryEvents(user.email);
    return res.render(`myEvents`, { events });
  } catch (e) {
    return res.render('404');
  }
};
exports.update = async (req, res) => {
  try {
    if (!req.params.id) return res.render('404');
    const event = new Event(req.body);
    await event.update(req.params.id);
    if (event.errors.length > 0) {
      req.flash('errors', event.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }
    req.flash('success', 'ATENÇÃO, EVENTO PRÉVIO ALTERADO');
    req.flash('success', 'Evento editado com sucesso.');
    req.session.save(() => res.redirect(`/myevents`));
    return;
  } catch (e) {
    this.errors.push(e);
  }
};
exports.updateIndex = async (req, res) => {
  const events = await new Event().findByID(req.params.id);
  const horaI = events.horaInicio.toISOString().slice(0, -1);
  const horaT = events.horaTermino.toISOString().slice(0, -1);
  const { descricao } = events;
  let charsI;
  switch (charsI) {
    case '00':
      charsI = '24';
      break;
    case '01':
      charsI = '25';
      break;
    case '02':
      charsI = '26';
      break;
    default:
      charsI = horaI[11] + horaI[12];
  }
  let charsT;
  switch (charsT) {
    case '00':
      charsT = '24';
      break;
    case '01':
      charsT = '25';
      break;
    case '02':
      charsT = '26';
      break;
    default:
      charsT = horaT[11] + horaT[12];
  }
  const newCharsINumber = new Number(charsI - 3);
  const newCharsTNumber = new Number(charsT - 3);
  const newCharsIString =
    newCharsINumber <= 9
      ? String(`0${newCharsINumber}`)
      : String(newCharsINumber);
  const newCharsTString =
    newCharsTNumber <= 9
      ? String(`0${newCharsTNumber}`)
      : String(newCharsTNumber);
  const horaInicio = horaI.replace(/T\d\d/, `T${newCharsIString}`);
  const minHora = horaI.replace(/T\d\d:\d\d/, `T00:00`);
  const maxHora = horaI.replace(/T\d\d:\d\d/, `T23:59`);
  const horaTermino = horaT.replace(/T\d\d/, `T${newCharsTString}`);
  return res.render(`updateEvents`, {
    event: events,
    horaInicio,
    horaTermino,
    descricao,
    minHora,
    maxHora,
    date: events.date,
  });
};
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) return res.render('404');
    const event = await new Event().delete(id);
    req.flash('success', 'Evento apagado com sucesso.');
    req.session.save(() => res.redirect('/myevents'));
  } catch (e) {
    res.render('404');
  }
};
