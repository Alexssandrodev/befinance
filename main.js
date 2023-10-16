import {v4 as uuidv4} from 'uuid';
import { getLocalStorage, setLocalStorage } from './src/utils';
const containerLaunch = document.querySelector('.container-launch');
const modal = document.querySelector('#modal');

// passo a passo
// 1 - Criar um array de objetos que armazenará os lançamentos, cada objeto terá as propriedades id, title, valueLaunch, value
const launchs = getLocalStorage('launch') ?? [];

// 2 - Listar os lançamentos na interface
function renderLaunchs() {
    launchs.forEach((launch, index) => {
        const boxLaunch = document.createElement('div');
        boxLaunch.classList.add('box-launch');
        const launchBox = `<p>${launch.title}</p>
        <div class="icons">
        <span>Tipo: ${launch.type}</span>
        <span id="date-launch">${launch.dateLaunch}</span>
        <p id="launch" class="value-launch-${index}">R$ ${launch.value}</p>
        <i id="info-${index}" class="fa-solid fa-info info"></i>
        <i id="delete-${index}" class="fa-solid fa-trash-can delete"></i>
        </div>`;
        
        boxLaunch.innerHTML += launchBox;
        containerLaunch.appendChild(boxLaunch);
        const pValue = document.querySelector(`.value-launch-${index}`);
        launch.type === 'Receita' ? pValue.classList.add('value-color') : pValue.classList.remove('value-color');
    })
    
    launchs.forEach((_, index) => {
        const editIcon = document.querySelector(`#info-${index}`);
        editIcon.addEventListener('click', () => {
            close();
            showInfoLaunch(index)
        });
    });

    launchs.forEach((_, index) => {
        const deleteIcon = document.querySelector(`#delete-${index}`);
        deleteIcon.addEventListener('click', () => deleteLaunch(index));
    });
}

// 3 - Criar a funcionalidade de adicionar um lançamento apartir do formulário
const formLaunch = document.querySelector('#form-launch');
const getUuId = uuidv4();

function createLaunch(event) {
    event.preventDefault();
    const title = formLaunch.querySelector('#title');
    const type = formLaunch.querySelector('#type');
    const date = formLaunch.querySelector('#date');
    const value = formLaunch.querySelector('#value');
    const messageBox = document.querySelector('.error');

    if (title.value === '') {
        messageBox.textContent = 'O campo de titulo precisa ser preenchido!';
        messageBox.style.display = 'block';
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 5000);
        return;
    }

    if (date.value === '') {
        messageBox.textContent = 'O campo de data precisa ser preenchido!';
        messageBox.style.display = 'block';
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 5000);
        return;
    }

    if (value.value === '') {
        messageBox.textContent = 'O campo valor precisa ser preenchido!';
        messageBox.style.display = 'block';
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 5000);
        return;
    }

    const newDate = new Date(date.value).toLocaleDateString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    const typeFormat = type.value === 'expense' ? 'Despesa' : 'Receita';

    const launch = {
        id: getUuId,
        title: title.value,
        type: typeFormat,
        dateLaunch: newDate,
        value: parseFloat(value.value)
    }
    
    launchs.push(launch);
    title.value = ''
    date.value = ''
    value.value = ''
    setLocalStorage('launch', launchs);
    init();
}

// 4 - Atualizar a interface com os valores de receita, despesa e total
const getExpenses = (launch) => launch.type === 'Despesa';
const getRevenues = (launch) => launch.type === 'Receita';

function updateBalanceValues() {
    const revenue = document.querySelector('#revenue');
    const expense = document.querySelector('#expense');
    const total = document.querySelector('#total');

    const expenseValues = launchs.filter(getExpenses);
    const revenueValues = launchs.filter(getRevenues);
    
    const sumRevenues = revenueValues.reduce((accumulator, { value }) => accumulator + value, 0);
    const sumExpenses = expenseValues.reduce((accumulator, { value }) => accumulator + value, 0);
    const sumTotal = sumRevenues - sumExpenses;
    
    revenue.textContent = `R$ ${sumRevenues}`;
    expense.textContent = `R$ ${sumExpenses}`;
    total.textContent = `R$ ${sumTotal}`;
}
// 5 - salvar os dados no localstorage
// 6 - obter os dados do localstorage
// criar funcionalidade de mostrar o modal do lançamento
const modalContainer = document.querySelector('#modal');

function showInfoLaunch(index) {
    const launchIndex = launchs.filter((_, i) => i === index);
    launchIndex.forEach((launch) => {
        const modalBox = `<div class="box-modal">
        <i id="close-modal" class="fa-solid fa-xmark"></i>
        <h2>Titulo: ${launch.title}</h2>
        <p>Data do lançamento: ${launch.dateLaunch}</p>
        <p>Tipo: ${launch.type}</p>
        <span>Valor: R$ ${launch.value}</span>
        </div>`;

        modalContainer.innerHTML += modalBox;
        const closeModal = document.querySelector('#close-modal');
        closeModal.addEventListener('click', close);
    });
}

// criar modal de informação do lançamento
function close() {
    modal.classList.toggle('active-modal');
    modalContainer.innerHTML = '';
}


// criar funcionalidade de deletar um lançamento
function deleteLaunch(index) {
    launchs.splice(index, 1);
    updateBalanceValues();
    setLocalStorage('launch', launchs);
    init();
}

function validateForms() {
    
}

function init() {
    containerLaunch.innerHTML = '';
    renderLaunchs();
    updateBalanceValues();
}

init();

formLaunch.addEventListener('submit', (event) => createLaunch(event));

const token = '4878|8ZfjzQgztpXLnwMzCcVsK0cREhY3yaJ3';
const apiEndPoint = 'https://api.invertexto.com/v1/faker?';

function getPeoples() {
    const url = 'https://api.invertexto.com/v1/faker?token=4878%7C8ZfjzQgztpXLnwMzCcVsK0cREhY3yaJ3';
    return new Promise((resolve, reject) => {
        try {
            resolve(url);
        } catch (error) {
            reject(error);
        }
    });
}

getPeoples().then((peoples) => console.log(peoples));


