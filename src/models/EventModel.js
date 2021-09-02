const mongoose = require('mongoose');
const validator = require('validator');

const EventSchema = new mongoose.Schema({
  descricao: { type: String, required: true },
  horaInicio: { type: Date, required: true, default: Date.now },
  horaTermino: {
    type: Date,
    required: true,
    default: Date.now + 1,
  },
  criadoPor: { type: String, required: true },
  date: { type: String, required: true },
});
const EventModel = mongoose.model('Events', EventSchema);

class Event {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.evento = null;
  }

  async create() {
    this.valid();
    if (this.errors.length > 0) return;
    this.evento = await EventModel.create(this.body);
  }

  async valid() {
    this.cleanUp();
    if (validator.isEmpty(this.body.descricao))
      return this.errors.push('Campo Obrigatório');
    if (!validator.isDate(this.body.horaInicio, [strictMode]))
      return this.errors.push('Campo Obrigatório');
    if (!validator.isDate(this.body.horaTermino, [strictMode]))
      return this.errors.push('Campo Obrigatório');
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }
    this.body = {
      descricao: this.body.descricao,
      horaInicio: this.body.horaInicio,
      horaTermino: this.body.horaTermino,
      criadoPor: this.body.user,
      date: this.body.date,
    };
  }

  async query(id) {
    const events = await EventModel.find({ criadoPor: id }).sort({
      horaInicio: -1,
    });
    return events;
  }

  async queryEvents(id) {
    const date = await EventModel.find({ criadoPor: id }, { date: 1, _id: 0 });
    return date;
  }

  async delete(id) {
    if (typeof id !== 'string') return;
    const event = await EventModel.findOneAndDelete({ _id: id });
  }

  async update(id) {
    if (typeof id !== 'string') return;
    this.valid();
    if (this.errors.length > 0) return;
    if (this.errors.length > 0) return;
    this.evento = await EventModel.findByIdAndUpdate(id, this.body, {
      new: true,
    });
  }

  async findByID(id) {
    if (typeof id !== 'string');
    const event = await EventModel.findById(id);
    return event;
  }
}

module.exports = Event;
