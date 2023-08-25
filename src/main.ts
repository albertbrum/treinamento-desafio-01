// Use Strict - Utilização de prática recomendada mais segura a partir do ECMAScript 5
'use strict'

// *** Exibição da TELA/MODAL
// Função para Abrir a Tela/Modal com Formulário de Pessoa
const openModal = () => document.getElementById('modal')
    .classList.add('active')
// Função para Fechar a Tela/Modal com Formulário de Pessoa
const closeModal = () => {
    console.log(document.getElementById('name').dataset.index)
    document.getElementById('modal').classList.remove('active')
    clearFields()
    console.log(document.getElementById('name').dataset.index)
    document.getElementById('name').dataset.index = "new"
    console.log(document.getElementById('name').dataset.index)
}
// *** GET E SET LOCAL STORAGE
// setItem - envio dos dados para localstorage
// getItem - recupera dados do localstorage
// JSON.stringify - transforma em JSON/texto para enviar para localstorage
// JSON.parse - recebe em JSON/texto e constroe novamente o objeto
// push - adiciona um ou mais elementos ao final de um array
// ?? - Se retornar null retorna valor após "??", no caso []

// Função para enviar os dados do formulario de pessoas para Local Storage.
const setLocalStorage = (dbPerson) => localStorage.setItem("localStoKeyListPerson", JSON.stringify(dbPerson))
// Função para receber os dados de Local Storage ou Criar um array vazio
const getLocalStorage = () => JSON.parse(localStorage.getItem('localStoKeyListPerson')) ?? []

// *** CRUD - CREATE, READ, UPDATE, DELETE
// Cadastrar Pessoa
const createPerson = (dataPerson) => {
    const dbPerson = getLocalStorage()
    dbPerson.push(dataPerson)
    setLocalStorage(dbPerson)
}
// Ler Pessoa
const readPerson = () => getLocalStorage()
// Atualizar Pessoa
const updatePerson = (index, person) => {
    const dbPerson = readPerson()
    dbPerson[index] = person
    setLocalStorage(dbPerson)
}
// Excluir Pessoa
const deletePerson = (index) => {
    const dbPerson = readPerson()
    dbPerson.splice(index, 1)
    setLocalStorage(dbPerson)
}

// *** VALIDAÇÃO E TRATAMENTO DE ENTRADAS DO FORMULÁRIO DE PESSOAS

// verifica se campos sao validos e retorna true ou false
const isValidFields = () => {
    return document.getElementById('formPerson').reportValidity()
}
// Adiciona o evento 'input' para chamar a função de máscara sempre que o usuário digitar algo
document.getElementById('mobile').addEventListener('input', maskMobile);

// Função para atualizar o valor do campo com a máscara formatada
function maskMobile() {
    const fieldMobile = document.getElementById('mobile');
    const numberMobile = fieldMobile.value;
    const numberFormated = formatMobile(numberMobile);
    fieldMobile.value = numberFormated;
}

// Função para aplicar a máscara de mobile
function formatMobile(mobile) {
    // Remove todos os caracteres não numéricos do número do mobile
    // O \D é um metacaractere que representa qualquer caractere que não seja um dígito numérico (0 a 9).
    const onlyNumbers = mobile.replace(/\D/g, '');
    // Aplica a máscara com base no tamanho do número cel com 8 ou 9 numeros.
    onlyNumbers.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');

    if (onlyNumbers.length === 11) {
        return onlyNumbers
            .replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
    } else {
        return onlyNumbers
            .replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
}

// *** INTERAÇÃO E MANIPULAÇÃO DO LAYOUT (HTML-CSS)
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
}

// Manipulação da data para exibição na tabela em formato brasileiro
function formatDateBrazil(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}
// Manipulação da data para formato do campo input
function formatDateInput(dateString) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
}
console.log(document.getElementById('name').dataset.index)
// Recupera os dados do formulário para criar ou atualizar em Local Storage
const savePerson = () => {
    console.log(document.getElementById('name').dataset.index)
    // Validação dos Campos e construção da lista com informações do campo
    if (isValidFields()) {
        const person = {
            name: document.getElementById('name').value,
            dateOfBirth: formatDateBrazil(document.getElementById('dateOfBirth').value),
            gender: document.getElementById('gender').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            mobile: document.getElementById('mobile').value,
            email: document.getElementById('email').value,
        }
        // Estrutura para verificação se "Cria" Pessoa ou "Edita" Pessoa via data atribuite (data-index="new")
        const indexData = document.getElementById('name').dataset.index
        console.log(indexData)
        if (indexData == 'new') {
            createPerson(person)
            updateTable()
            closeModal()
        } else {
            updatePerson(indexData, person)
            updateTable()
            closeModal()
        }
    }
}

// Função para criar as linhas em HTML a partir dos registros de Local Storage
const createRow = (person, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${person.name}</td>
        <td>${person.dateOfBirth}</td>
        <td>${person.gender}</td>
        <td>${person.address}</td>
        <td>${person.city}</td>
        <td>${person.mobile}</td>
        <td>${person.email}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
        </td>
        `
    // Constroi uma nova linha filha dentro da "tbody", criada dentro tabela com id "tablePerson"
    document.querySelector('#tablePerson>tbody').appendChild(newRow)
}

// Limpa dados da tabela
const clearTable = () => {
    const rows = document.querySelectorAll('#tablePerson>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

// Carrega dados e cria listagem na tabela de pessoas
const updateTable = () => {
    const dbPerson = readPerson()
    clearTable()
    dbPerson.forEach(createRow) // Estrutura para creação da tabela apartir de dados existentes na Local Storage
}

// ***BOTOES DE EDICAO / EXCLUSAO

// Preenche os campos para edição
const fillFields = (person) => {
    document.getElementById('name').value = person.name
    document.getElementById('dateOfBirth').value = formatDateInput(person.dateOfBirth)
    document.getElementById('gender').value = person.gender
    document.getElementById('address').value = person.address
    document.getElementById('city').value = person.city
    document.getElementById('mobile').value = person.mobile
    document.getElementById('email').value = person.email
    // pega a partir do index do elemento
    document.getElementById('name').dataset.index = person.index
}

// Função abertura da tela/modal e chamada de preenchimento para edição do registro de pessoa em Local Storage
const editPerson = (index) => {
    const person = readPerson()[index]
    person.index = index
    fillFields(person)
    openModal()
}

// Função para seleção do botão de edição ou exclusão
const selectActions = (event) => {
    if (event.target.type == 'button') {
        // Separa nome do botão pelo "-" para condição de edição ou exclusão
        const [action, indexAction] = event.target.id.split('-')
        if (action == 'edit') {
            editPerson(indexAction)
        } else {
            const client = readPerson()[indexAction]
            const response = confirm(`Deseja excluir ${client.name} ?`)
            if (response) {
                deletePerson(indexAction)
                updateTable()
            }
        }
    }
}

// TESTES COM CAMPO DE BUSCA DE PESSOAS
// // Evento de Escuta para o campo de busca
// document.querySelector('#tableFieldSearch')
//     .addEventListener('input', searchPerson)

// TESTES COM CAMPO DE BUSCA DE PESSOAS
// function searchPerson(event) {
//     console.log(event)
 
//     // Converte o texto de pesquisa para minúsculas
//     clearTable()
//     const txtSearch = event.target.value.toLowerCase(); 
//     //console.log(txtSearch);
//     const dbPerson = readPerson();

//     // Loop que constroe as linhas a partir da comparação com o texto do campo busca e a lista de registros
//     dbPerson.forEach(person => {
//         // Busca as texto de busca nos registros e converte o texto da lista em minusculas
//         if (person.name.toLowerCase().includes(txtSearch)) { 
//             console.log(person.name);
//             console.log(txtSearch)
//             const index = person.index
//             createRow(person,index);
//         }
//     });
// }

// *** CARREGAMENTO DA LISTA EM LOCAL STORAGE
updateTable()

// *** EVENTOS DE ESCUTA

// Evento de Escuta dos Botões de Edição e Exclusão
document.querySelector('#tablePerson>tbody')
    .addEventListener('click', selectActions)




