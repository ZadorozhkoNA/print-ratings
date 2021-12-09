'use strict'

//Массив элементов, которые надо удалить
let delElements = [
  'Текущая успеваемость учащегося',
  'Класс',
  'руководитель',
  'Период формирования успеваемости',
  'Дата формирования',
  'Предмет',
  ';;;'
];

// Разделитель массивов (определение нового ученика в списке)
const SEPARATOR = 'ФИО учащегося';

// Элемент для выбора файлов.
const INPUT = document.querySelector('input[name="readable"]');
// Элемент для вывода сгенерированной таблицы.
const PREVIEW = document.querySelector('#preview');
// Регулярное выражение для проверки расширения файла.
const REGEX = new RegExp('(.*?)\.(csv)$', 'i');

// Функция, отрабатывающая при выборе файла.
function handleFile(event) {
  // Выбираем первый файл из списка файлов.
  const file = event.target.files[0];

  // Если файл выбран и его расширение допустимо,
  // то читаем его содержимое и отправляем
  // в функцию отрисовки таблицы.
  if (file && REGEX.test(file.name)) {
    // Создаем экземпляр объекта.
    const reader = new FileReader();

    // Чтение файла асинхронное, поэтому
    // создание таблицы привязываем к событию `load`,
    // которое срабатывает при успешном завершении операции чтения.
    reader.onload = (e) =>{
      // Очищаем элемент для вывода таблицы.
      PREVIEW.innerHTML = '';
      //Удаляем лишние строки
      let array = prepareArray(e.target.result, delElements);
      //Разбиваем массив по ученикам
      array = separatorArray(array, SEPARATOR);
      //Выводим каждого ученика в отдельную таблицу
      array.forEach(item =>{ 
        renderTable(item);
      });
      // renderTable(e.target.result)
    };

    // Читаем содержимое как текстовый файл.
    // reader.readAsText(file);
    reader.readAsText(file, 'CP1251');
  } else {
    // Мизерная обработка ошибок.
    alert('Файл не выбран либо его формат не поддерживается.');
    event.target.value = '';
  }
}

// Ф-ия подготовки массив (удаление лишних строк)
function prepareArray(string, array) {
  let newArray = [];
  newArray = string.split(/\r\n|\r|\n/).filter(itemStr => {
    let del = true
    array.forEach((item) => {
      if (itemStr.includes(item)) del = false;
    });
    if (del) return itemStr;
  });
  return newArray;
}

// Ф-ия разделителя массива (подмассив начинается с нового ученика)
function separatorArray(array, separator) {
  let newArray = [];
  let miniArray = [];
  array.forEach(item => {
    if (item.includes(separator) && miniArray.length !== 0) {
      newArray.push(miniArray);
      miniArray = [];
    }
    miniArray.push(item);
  })
  return newArray;
}

// Функция отрисовки таблицы.
function renderTable(data) {
  // Предварительно создадим элементы,
  // отвечающие за каркас таблицы.
  let table = document.createElement('table');
  // let thead = document.createElement('thead');
  let tbody = document.createElement('tbody');

  // Добавим класс к таблице.
  table.classList.add('table');

  // Разбиваем входящие данные построчно.
  // Разделитель - перенос строки.
  // Перебираем полученный массив строк.
  // data.split(/\r\n|\r|\n/)
  data.forEach(function(row, index) {
      // Создадим элемент строки для таблицы.
        let trow = document.createElement('tr');

        // Разбиваем каждую строку на ячейку.
        // Разделитель - точка с запятой.
        // Перебираем полученный массив будущих ячеек.
        row.split(/;/).forEach(function(cell) {
          
          if (cell != '') {
            cell = cell.replaceAll(',', ', ');
            // Создадим элемент ячейки для таблицы.
            let tcell = document.createElement(index > 0 ? 'td' : 'th');
            // Заполним содержимое ячейки.
            tcell.textContent = cell;
            console.log(cell);
            // Добавляем ячейку к родительской строке.
            trow.appendChild(tcell);
          }
        });
  
        // Добавляем строку к родительскому элементу.
        // Если индекс строки больше нуля,
        // то родительский элемент - `tbody`,
        // в противном случае- `thead`.
        // index > 0 ? tbody.appendChild(trow) : thead.appendChild(trow);
        tbody.appendChild(trow);
    });

  // Добавляем заголовок таблицы к родительскому элементу.
  // table.appendChild(thead);
  // Добавляем тело таблицы к родительскому элементу.
  table.appendChild(tbody);

  // Очищаем элемент для вывода таблицы.
  // PREVIEW.innerHTML = '';
  // Добавляем саму таблицу к родительскому элементу.
  PREVIEW.appendChild(table);
}

// Регистрируем функцию обработчика события `change`,
// срабатывающего при изменении элемента выбора файла.
INPUT.addEventListener('change', handleFile);
