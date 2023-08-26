// Use Strict - Utilização de prática recomendada mais segura a partir do ECMAScript 5
'use strict'

// *** Exibição da TELA/MODAL
// Função para Abrir a Tela/Modal com Formulário de Pessoa
const openModal = (): void => document.getElementById('modal')!.classList.add('active');
// Função para Fechar a Tela/Modal com Formulário de Pessoa
const closeModal = (): void => {
    console.log((<HTMLElement>document.getElementById('name')).dataset.index);
    document.getElementById('modal')!.classList.remove('active');
    clearFields();
    console.log((<HTMLElement>document.getElementById('name')).dataset.index);
    (<HTMLElement>document.getElementById('name')).dataset.index = "new";
    console.log((<HTMLElement>document.getElementById('name')).dataset.index);
}

// *** GET E SET LOCAL STORAGE
// setItem - envio dos dados para localstorage
// getItem - recupera dados do localstorage
// JSON.stringify - transforma em JSON/texto para enviar para localstorage
// JSON.parse - recebe em JSON/texto e constroe novamente o objeto
// push - adiciona um ou mais elementos ao final de um array
// ?? - Se retornar null retorna valor após "??", no caso []

// Função para enviar os dados do formulario de pessoas para Local Storage.
const setLocalStorage = (dbPerson: any): void => localStorage.setItem("localStoKeyListPerson", JSON.stringify(dbPerson));
// Função para receber os dados de Local Storage ou Criar um array vazio
//const getLocalStorage = (): unknown[] => JSON.parse(localStorage.getItem('localStoKeyListPerson')) ?? [];

const getLocalStorage = (): unknown[] => {
    const localStorageData = localStorage.getItem('localStoKeyListPerson');
    return localStorageData ? JSON.parse(localStorageData) : [];
};


// *** CRUD - CREATE, READ, UPDATE, DELETE
// Cadastrar Pessoa
const createPerson = (dataPerson: any): void => {
    const dbPerson = getLocalStorage();
    dbPerson.push(dataPerson);
    setLocalStorage(dbPerson);
}
// Ler Pessoa
const readPerson = (): any[] => getLocalStorage();
// Atualizar Pessoa
const updatePerson = (index: number, person: any): void => {
    const dbPerson = readPerson();
    dbPerson[index] = person;
    setLocalStorage(dbPerson);
}
// Excluir Pessoa
const deletePerson = (index: number): void => {
    const dbPerson = readPerson();
    dbPerson.splice(index, 1);
    setLocalStorage(dbPerson);
}

// *** VALIDAÇÃO E TRATAMENTO DE ENTRADAS DO FORMULÁRIO DE PESSOAS

// verifica se campos são válidos e retorna true ou false
const isValidFields = (): boolean => {
    return (<HTMLFormElement>document.getElementById('formPerson')).reportValidity();
}

// Adiciona o evento 'input' para chamar a função de máscara sempre que o usuário digitar algo
document.getElementById('mobile')!.addEventListener('input', maskMobile);

// Função para atualizar o valor do campo com a máscara formatada
function maskMobile() {
    const fieldMobile = <HTMLInputElement>document.getElementById('mobile');
    const numberMobile = fieldMobile.value;
    const numberFormated = formatMobile(numberMobile);
    fieldMobile.value = numberFormated;
}

// Função para aplicar a máscara de mobile
function formatMobile(mobile: string): string {
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
const clearFields = (): void => {
    const fields = document.querySelectorAll('.modal-field');
    fields.forEach(field => (<HTMLInputElement>field).value = "");
}

// Manipulação da data para exibição na tabela em formato brasileiro
function formatDateBrazil(dateString: string): string {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}


// Manipulação da data para formato do campo input
function formatDateInput(dateString: string): string {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
}
console.log((<HTMLElement>document.getElementById('name')).dataset.index);

// Recupera os dados do formulário para criar ou atualizar em Local Storage
const savePerson = (): void => {
    console.log((<HTMLElement>document.getElementById('name')).dataset.index);
    // Validação dos Campos e construção da lista com informações do campo
    if (isValidFields()) {
        const person = {
            name: (<HTMLInputElement>document.getElementById('name')).value,
            dateOfBirth: formatDateBrazil((<HTMLInputElement>document.getElementById('dateOfBirth')).value),
            gender: (<HTMLSelectElement>document.getElementById('gender')).value,
            address: (<HTMLInputElement>document.getElementById('address')).value,
            city: (<HTMLInputElement>document.getElementById('city')).value,
            mobile: (<HTMLInputElement>document.getElementById('mobile')).value,
            email: (<HTMLInputElement>document.getElementById('email')).value,
        };
        // Estrutura para verificação se "Cria" Pessoa ou "Edita" Pessoa via data atribuite (data-index="new")
        const indexData = (<HTMLElement>document.getElementById('name')).dataset.index;
        console.log(indexData);
        if (indexData == 'new') {
            createPerson(person);
            updateTable();
            closeModal();
        } else if (indexData !== undefined) {
            const indexNumber = parseInt(indexData, 10); // Ou Number(indexData)
            updatePerson(indexNumber, person);
            updateTable();
            closeModal();
        } else {
            // Tratar o caso onde indexData é undefined, se necessário
        }
    }
}

// Função para criar as linhas em HTML a partir dos registros de Local Storage
const createRow = (person: any, index: number): void => {
    const newRow = document.createElement('tr');
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
        `;
    // Constroi uma nova linha filha dentro da "tbody", criada dentro tabela com id "tablePerson"
    document.querySelector('#tablePerson>tbody')!.appendChild(newRow);
}
// Limpa dados da tabela
const clearTable = (): void => {
    const rows = document.querySelectorAll('#tablePerson>tbody tr');
    rows.forEach(row => row.parentNode!.removeChild(row));
}

// Carrega dados e cria listagem na tabela de pessoas
const updateTable = (): void => {
    const dbPerson = readPerson();
    clearTable();
    dbPerson.forEach(createRow); // Estrutura para criação da tabela a partir de dados existentes na Local Storage
}

// ***BOTOES DE EDICAO / EXCLUSAO

// Preenche os campos para edição
const fillFields = (person: any): void => {
    (<HTMLInputElement>document.getElementById('name')).value = person.name;
    (<HTMLInputElement>document.getElementById('dateOfBirth')).value = formatDateInput(person.dateOfBirth);
    (<HTMLSelectElement>document.getElementById('gender')).value = person.gender;
    (<HTMLInputElement>document.getElementById('address')).value = person.address;
    (<HTMLInputElement>document.getElementById('city')).value = person.city;
    (<HTMLInputElement>document.getElementById('mobile')).value = person.mobile;
    (<HTMLInputElement>document.getElementById('email')).value = person.email;
    // pega a partir do index do elemento
    (<HTMLElement>document.getElementById('name')).dataset.index = person.index;
}

// Função abertura da tela/modal e chamada de preenchimento para edição do registro de pessoa em Local Storage
const editPerson = (index: number): void => {
    const person = readPerson()[index];
    person.index = index;
    fillFields(person);
    openModal();
}

// Função para seleção do botão de edição ou exclusão
const selectActions = (event: Event): void => {
    if ((<HTMLInputElement>event.target).type == 'button') {
        // Separa nome do botão pelo "-" para condição de edição ou exclusão
        const [action, indexAction] = (<HTMLInputElement>event.target).id.split('-');
        if (action == 'edit') {
            editPerson(Number(indexAction));
        } else {
            const client = readPerson()[Number(indexAction)];
            const response = confirm(`Deseja excluir ${client.name} ?`);
            if (response) {
                deletePerson(Number(indexAction));
                updateTable();
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
updateTable();

// *** EVENTOS DE ESCUTA

// Evento de Escuta dos Botões de Edição e Exclusão
document.querySelector('#tablePerson>tbody')!.addEventListener('click', selectActions);


