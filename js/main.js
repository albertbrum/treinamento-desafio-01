// Utilização mais segura do EMA Script 2020
'use strict'

// Abre o Modal com Formulário de Pessoa
const openModal = () => document.getElementById('modal')
    .classList.add('active')
// Fecha o Modal com Formulário de Pessoa
const closeModal = () => {
    document.getElementById('modal').classList.remove('active')
    clearFields()
}

// *** GET E SET LOCAL STORAGE
// setItem - envio dos dados para localstorage
// getItem - recupera dados do localstorage
// JSON.stringify - transforma em JSON/texto para enviar para localstorage
// JSON.parse - recebe em JSON/texto e constroe novamente o objeto
// push - adiciona um ou mais elementos ao final de um array
// ?? - Se retornar null retorna valor após "??", no caso []
const getLocalStorage = () => JSON.parse(localStorage.getItem('localStoKeyListPerson')) ?? []
const setLocalStorage = (dbPerson) => localStorage.setItem("localStoKeyListPerson", JSON.stringify(dbPerson))

// *** CRUD - CREATE, READ, UPDATE, DELETE

// Cadastrar Pessoa
const createPerson = (dataPerson) => {
    const dbPerson = getLocalStorage()
    dbPerson.push (dataPerson)
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
    dbPerson.splice(index,1)
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

// Manipulação da Data para formato Brasileiro
function formatDateBrazil(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

function formatDateInput(dateString) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
}

// Recupera os dados do formulário para criar ou atualizar em Local Storage
const savePerson = () => {
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
        const index = document.getElementById('name').dataset.index
        if (index == 'new') {
            createPerson(person)
            updateTable()
            closeModal()
        } else {
            updatePerson(index, person)
            updateTable()
            closeModal()
        }
    }
}

 // Estrutura criar os dados em HTML em uma nova linha a partir de um registro do Local Storage
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

// Função Abertura do Modal e e chamada de preenchimento para edição do registro de pessoa em Local Storage
const editPerson = (index) => {
    const person = readPerson()[index]
    person.index = index
    fillFields(person)
    openModal()
}

// Função para Seleção do botão de edição ou Exclusão
const selectActions = (event) => {
    if (event.target.type == 'button') {
        // Separa nome do botão pelo "-" para condição de edição ou exclusão
        const [action, index] = event.target.id.split('-')
        if(action == 'edit') {
            editPerson(index)
        } else {
            const client = readPerson()[index]
            const response = confirm(`Deseja excluir ${client.name} ?`)
            if (response) {
            deletePerson(index)
            updateTable()
            }
        }
    }
}

// const fieldSearchTxt = document.querySelector("#tableFieldSearch")

// const searchText = (event, dbPerson) => {
//     const = serchtext => 
//     dbPerson.find((event,i)) => {
//             if (event(i) == getLocalStorage(i)){
//                 return true
//             }
//     }
// }

// *** CARREGAMENTO DA LISTA EM LOCAL STORAGE
updateTable()

// REFATORAÇÃO PARA DIMINUIÇÃO DE PROCESSAMENTO "IN SERVER" COM USO DO ON CLICK NO HTML
// document.getElementById('registerPerson')
//     .addEventListener('click', openModal)

// document.getElementById('modalClose')
//     .addEventListener('click', closeModal)

// document.getElementById('buttonSavePerson')
//     .addEventListener('click', savePerson)

document.querySelector('#tablePerson>tbody')
    .addEventListener('click', selectActions)

// document.getElementById('buttonCancelPerson')
//     .addEventListener('click', closeModal)

// document.addEventListener('click',document.getElementById()(console.log("teste")));