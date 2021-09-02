(() => {
  const horas = document.querySelector('.horas').innerHTML;
  const newHoras = String(horas.match(/\d{1,2}[A-Z]{4,9}/g));
  const date = new Date();
  function renderCalendar() {
    const currentMonth = document.querySelector('.currentMonth');
    const currentYear = document.createElement('span');
    const monthDays = document.querySelector('.days');
    let days = '';
    const lastDay = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
    ).getDate();
    const lastDayIndex = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
    ).getDay();
    const nextDay = 7 - lastDayIndex;
    const prevLastDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      0,
    ).getDate();
    const month = date.getMonth();
    const firstDayIndex = new Date(
      date.getFullYear(),
      date.getMonth(),
    ).getDay();
    const months = [
      'JANEIRO',
      'FEVEREIRO',
      'MARÇO',
      'ABRIL',
      'MAIO',
      'JUNHO',
      'JULHO',
      'AGOSTO',
      'SETEMBRO',
      'OUTUBRO',
      'NOVEMBRO',
      'DEZEMBRO',
    ];
    const weekDays = [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado',
    ];
    const week = document.querySelector('.weekdays');
    const year = date.getFullYear();

    currentYear.classList.contains('currentYear');
    currentYear.innerHTML = `<br>${year}`;

    currentMonth.innerHTML = months[month];
    currentMonth.appendChild(currentYear);

    week.innerHTML = '';
    for (let weekDay = 0; weekDay < weekDays.length; weekDay++) {
      week.innerHTML += `<li>${weekDays[weekDay]}</li>`;
    }

    for (let prevDay = firstDayIndex; prevDay > 0; prevDay--) {
      days += `<li class="prev-days">${prevLastDay - prevDay + 1}</li>`;
    }

    for (let day = 1; day <= lastDay; day++) {
      if (
        day === new Date().getDate() &&
        date.getMonth() === new Date().getMonth()
      ) {
        days += `<li class="${day}${currentMonth.innerText.slice(
          0,
          -5,
        )} active">${day}</li>`;
      } else {
        days += `<li class='${day}${currentMonth.innerText.slice(
          0,
          -5,
        )}'>${day}</li>`;
      }
    }

    for (let nextDays = 1; nextDays <= nextDay; nextDays++) {
      days += `<li class="next-days">${nextDays}</li>`;
    }

    monthDays.innerHTML = days;
    // eslint-disable-next-line no-use-before-define
    addExistedEvents();
  }
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === 37) {
      date.setMonth(date.getMonth() - 1);
      renderCalendar();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === 39) {
      date.setMonth(date.getMonth() + 1);
      renderCalendar();
    }
  });
  document.querySelector('.prev').addEventListener('click', (e) => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
  });
  document.querySelector('.next').addEventListener('click', (e) => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
  });
  renderCalendar();

  function addExistedEvents() {
    for (newHora of newHoras.split(',')) {
      const newEvent = document.getElementsByClassName(`${newHora}`);
      if (newEvent.length) newEvent[0].classList.add('event');
    }

    document.querySelector('.days').addEventListener('click', (e) => {
      const el = e.target;
      const newDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        el.innerHTML,
        -3,
        0,
        0,
      );
      const newDateTermino = new Date(
        date.getFullYear(),
        date.getMonth(),
        el.innerHTML,
        -3,
        0,
        0,
      );
      const eventDate = newDate.toISOString();
      const newDate2 = newDateTermino.setHours(44, 59);
      const eventDateTermino = new Date(newDate2).toISOString().slice(0, -1);
      if (!el.classList.contains('event')) {
        window.location.href = `/events/create/${eventDate.slice(0, -1)}/${
          el.classList
        }/${eventDateTermino}`;
        return;
      }
      el.classList.add('event');
      window.location.href = `/myevents`;
    });
  }
})();
