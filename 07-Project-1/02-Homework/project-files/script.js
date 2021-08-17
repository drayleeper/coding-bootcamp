const searchWordInput = document.getElementById('searchWordInput');
const searchTypeInput = document.getElementById('searchTypeInput');
const searchButton = document.getElementById('searchButton');
const resultsTitle = document.getElementById('resultsTitle');
const resultsBody = document.getElementById('resultsBody');

const datamuseAddress = 'https://api.datamuse.com/words?rel_';
const dictApiAddress = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

function populateResults(data) {
    if (searchTypeInput.value == 'def') {
        for (let i = 0; i < data[0].meanings.length; i++) {
            let partOfSpeechContainer = document.createElement('div');

            let posLabel = document.createElement('p');
            posLabel.classList.add('has-text-grey-light');
            posLabel.textContent = data[0].meanings[i].partOfSpeech;
            partOfSpeechContainer.appendChild(posLabel);
            console.log(partOfSpeechContainer);

            let defList = document.createElement('ul');
            defList.style.listStyleType = '"-"';
            if (data[0].meanings[i].definitions.length < 3) {
                for (let j = 0; j < data[0].meanings[i].definitions.length; j++) {
                    let definition = document.createElement('li');
                    definition.textContent = data[0].meanings[i].definitions[j].definition;
                    defList.appendChild(definition);
                };
            } else {
                for (let j = 0; j < 3; j++) {
                    let definition = document.createElement('li');
                    definition.textContent = data[0].meanings[i].definitions[j].definition;
                    defList.appendChild(definition);
                };
            };
            partOfSpeechContainer.appendChild(defList);
            resultsBody.appendChild(partOfSpeechContainer);
        };
        
    } else {
        let wordsList = document.createElement('ul');
        wordsList.style.listStyleType = '"-"';
        if (data.length == 0) {
            let word = document.createElement('li');
            word.textContent = 'No results found.';
            word.classList.add('has-text-danger')
            wordsList.appendChild(word);
        } else if (data.length < 9) {
            for (let i = 0; i < data.length; i++) {
                let word = document.createElement('li');
                word.textContent = data[i].word;
                wordsList.appendChild(word);
            }
        } else {
            for (let i = 0; i < 9; i++) {
                let word = document.createElement('li');
                word.textContent = data[i].word;
                wordsList.appendChild(word);
            }
        };
        resultsBody.appendChild(wordsList);
    }
    console.log(data);
    localStorage.setItem('prevSearch', resultsBody.innerHTML);
    console.log(localStorage.getItem('prevSearch'));
};
function display(data) {
    if (resultsBody.children.length > 0) {
        for (let i = 0; i < resultsBody.children.length; i++) {
            resultsBody.children[i].remove();
        };
    }
    resultsTitle.textContent = '';
    resultsBody.textContent = '';
    let titleType = '___'
    let titleWord = searchWordInput.value

    if (searchTypeInput.value == 'syn') {
        titleType = 'Synonyms';
    } else if (searchTypeInput.value == 'ant') {
        titleType = 'Antonyms';
    } else if (searchTypeInput.value == 'rhy') {
        titleType = 'Rhymes';
    } else if (searchTypeInput.value == 'def') {
        titleType = 'Definitions';
    } else if (searchTypeInput.value == 'trg') {
        titleType = 'Related words';
    } else {
        return
    };

    let title = `${titleType} for the word '${titleWord}':`
    resultsTitle.textContent = title

    populateResults(data);
};
function dictApiSearch() {
    let requestUrl = dictApiAddress + searchWordInput.value;
    
    fetch(requestUrl)
    .then(response => response.json())
    .then(data => display(data));
}
function datamuseSearch() {
    let requestUrl = `${datamuseAddress}${searchTypeInput.value}=${searchWordInput.value}`;

    fetch(requestUrl)
    .then(response => response.json())
    .then(data => display(data));
}

function startSearch() {
    if (searchTypeInput.value == 'def') {
        dictApiSearch();
    } else if (
        searchTypeInput.value == 'syn' ||
        searchTypeInput.value == 'ant' ||
        searchTypeInput.value == 'rhy' ||
        searchTypeInput.value == 'trg'
        ) {
        datamuseSearch();
    } else {
        return
    }
}


if (localStorage.getItem('prevSearch')) {
    resultsBody.textContent = '';
    resultsBody.innerHTML = localStorage.getItem('prevSearch');
}
searchButton.addEventListener('click', startSearch);