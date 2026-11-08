const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

// Элементы страницы
const showProgramButton = document.querySelector('#show-program');
const programBlock = document.querySelector('#program');
const serviceForm = document.querySelector('#service-form');
const guideCheckbox = document.querySelector('#guide');
const audioCheckbox = document.querySelector('#audio');
const catalogCheckbox = document.querySelector('#catalog');
const choiceError = document.querySelector('#choice-error');
const dataError = document.querySelector('#data-error');
const resultBlock = document.querySelector('#result');
const reportJsonBlock = document.querySelector('#report-json');

// Разбор исходных данных
let data = null;
try {
  data = JSON.parse(sourceJson);
} catch (error) {
  data = null;
}

// Отчёт по выбранным услугам
function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const selected = {
    guide: guideChecked,
    audio: audioChecked,
    catalog: catalogChecked
  };

  const items = services
    .filter((service) => selected[service.id] === true)
    .map((service) => {
      const { title, price } = service;
      return { title: title.trim(), price: price };
    });

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return {
    count: items.length,
    total: total,
    items: items
  };
}

function showProgram() {
  programBlock.innerHTML = data.event.meeting;
  programBlock.hidden = false;
}

function handleSubmit(event) {
  event.preventDefault();

  const report = buildReport(
    data.services,
    guideCheckbox.checked,
    audioCheckbox.checked,
    catalogCheckbox.checked
  );

  if (report.count === 0) {
    choiceError.textContent = 'Выберите хотя бы одну услугу.';
    choiceError.hidden = false;
    resultBlock.hidden = true;
    reportJsonBlock.hidden = true;
    return;
  }

  choiceError.hidden = true;

  const lines = [
    'Выбрано услуг: ' + report.count,
    'Итого: ' + report.total + ' руб.'
  ];
  report.items.forEach((item) => {
    lines.push(item.title);
  });
  resultBlock.innerHTML = lines.join('<br>');
  resultBlock.hidden = false;

  const reportJson = JSON.stringify(report);
  try {
    JSON.parse(reportJson);
    reportJsonBlock.textContent = reportJson;
    reportJsonBlock.hidden = false;
  } catch (error) {
    reportJsonBlock.hidden = true;
  }
}

if (data === null) {
  dataError.textContent = 'Ошибка данных.';
  dataError.hidden = false;
  serviceForm.hidden = true;
} else {
  serviceForm.hidden = false;
  showProgramButton.addEventListener('click', showProgram);
  serviceForm.addEventListener('submit', handleSubmit);
}
