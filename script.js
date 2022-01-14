'use strict';

const settingOptions = [{
        language: "Hebrew",
        categories: ["1000 words", "100 words"],
        wordbanks: [hebrewWords.words, hebrewWords.words.slice(0, 100)],
        translations: ["heb", "eng"]
    },
    {
        language: "French",
        categories: ["1000 words", "100 words"],
        wordbanks: [frenchWords.words, frenchWords.words.slice(0, 100)],
        translations: ["fre", "eng"]
    },
    {
        language: "Spanish",
        categories: ["1000 words", "100 words"],
        wordbanks: [spanishWords.words, spanishWords.words.slice(0, 100)],
        translations: ["spa", "eng"]
    },
    {
        language: "Polish",
        categories: ["1000 words", "100 words", "colors"],
        wordbanks: [polishWords.words, polishWords.words.slice(0, 100), polishColors],
        translations: ["pol", "eng"]
    },
    {
        language: "Italian",
        categories: ["1000 words", "100 words"],
        wordbanks: [italianWords.words, italianWords.words.slice(0, 100)],
        translations: ["ita", "eng"]
    }
]

let words = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]
let definition = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
let wordBank, chosenWord, correctIndex, choices;
let correct = [];
let incorrect = [];
let definitionList
let andMoreCorrect, andMoreIncorrect
let displayAnswerTimeout

const wordCard = document.querySelector(".word")
const choicesCards = document.querySelectorAll(".cards")
const cardsContainer = document.querySelector(".answer__container")
const pastWordsCorrect = document.querySelector(".correct")
const pastWordsIncorrect = document.querySelector(".incorrect")
const correct1 = document.querySelector(".correct-1")
const correct2 = document.querySelector(".correct-2")
const incorrect1 = document.querySelector(".incorrect-1")
const incorrect2 = document.querySelector(".incorrect-2")
const gameContainer = document.querySelector(".game")
const submitWord = document.querySelector(".guess-word-btn")
const inputWord = document.querySelector(".guess-word")
const scoreDiv = document.querySelector(".score")
const triesDiv = document.querySelector("tries")
const displayAnswer = document.querySelector(".display-right-answer")
const languageSet = document.querySelector(".language")
settingOptions.forEach(packager => languageSet.insertAdjacentHTML('beforeend', `<button class="set set-language">${packager.language}</button>`))
const languages = document.querySelectorAll(".set-language")
const categorySet = document.querySelector(".category")
let categories = document.querySelectorAll(".set-category")
const directionSet = document.querySelector(".direction")
const direction = document.querySelectorAll(".set-direction")
const startGame = document.querySelector(".start-game")
const warning = document.querySelector(".warning")
const startNewGame = document.querySelector(".begin-new-game")
const startAnotherGame = document.querySelector(".begin-another-game")
const settingModal = document.querySelector(".modal-game")
const closeModal = document.querySelector(".close-modal-screen")
const statistics = document.querySelector(".statistics-data")
const wordlist = document.querySelectorAll(".word-list")
const definitionModal = document.querySelector(".modal-definition")
const allNewGame = document.querySelector(".all-new-game")
const correctNewGame = document.querySelector(".correct-new-game")
const incorrectNewGame = document.querySelector(".incorrect-new-game")
const gameOver = document.querySelector(".game-over")
// triesDiv.innerHTML = "🖤".repeat(tries)

function jsonToArray(languagePackage, fromLang, toLang) {
    words = []
    definition = []
    languagePackage.map(word => {
        words.push(word[fromLang])
        definition.push(word[toLang])
    })
    wordBank = words.slice()
    definitionList = definition.slice()
}

const shuffle = arg => arg.sort(() => Math.random() - 0.5)

const wrongChoice = wordList => wordList.splice(Math.floor(Math.random() * wordList.length), 1)

function newWord() {
    if (this) {
        this.style.backgroundColor = "white"
    }
    definitionList = definition.slice()
    choicesCards.forEach(card => card.style.pointerEvents = "")
    chosenWord = wordBank[Math.floor(Math.random() * wordBank.length)];
    wordCard.innerHTML = `<p>${chosenWord}</p>`
    correctIndex = words.indexOf(chosenWord)
    let correctAnswer = definition[correctIndex]
    definitionList.splice(correctIndex, 1)
    multipleChoice()

    function multipleChoice() {
        let [choice2, choice3, choice4] = [wrongChoice(definitionList), wrongChoice(definitionList), wrongChoice(definitionList)]
        choices = shuffle(shuffle(shuffle([correctAnswer, choice2, choice3, choice4])))
        choicesCards.forEach((card, i) => card.innerHTML = choices[i])
        wordBank.splice(wordBank.indexOf(chosenWord), 1)
    }
};

function selectOne(category, target) {
    category.forEach(option => {
        option.backgroundColor = "white"
        option.classList.remove("active")
    })
    target.backgroundColor = "blue"
    target.classList.add("active")
}

function restartGameData() {
    correct1.innerHTML = correct2.innerHTML = incorrect1.innerHTML = incorrect2.innerHTML = ""
    correct = [];
    incorrect = [];
    scoreDiv.classList.remove("hidden")
    statistics.innerHTML = ""
    if (gameContainer.classList.contains("hidden")) {
        gameContainer.classList.toggle("hidden")
        gameOver.classList.toggle("hidden")
    }
}
const oneSelected = categories => Array.from(categories).some(category => category.classList.contains("active"))

cardsContainer.addEventListener("click", function (e) {
    function addtoTable(type, first, second, andMore, typeString) {
        if (type.length < 12) {
            first.innerHTML += `<div class="word-def" id=${chosenWord}>${chosenWord}</div>`
        } else if (type.length < 23 && type.length >= 12) {
            second.innerHTML += `<div class="word-def" id=${chosenWord}>${chosenWord}</div>`
        } else if (type.length == 23) {
            second.innerHTML += `<div class='and-more-${typeString}'>and 1 more...</div>`
        } else {
            andMore.innerHTML = `and ${type.length - 22} more...`
        }
    }
    if (e.target.classList.contains('cards')) {
        let userChoice = e.target.innerText

        if (words.indexOf(chosenWord) === definition.indexOf(userChoice)) {
            e.target.style.backgroundColor = "green"
            addtoTable(correct, correct1, correct2, andMoreCorrect, "correct")
            if (correct.length == 23) andMoreCorrect = document.querySelector(".and-more-correct")
            correct.push(chosenWord)
        } else {
            e.target.style.backgroundColor = "red"
            displayAnswer.innerHTML = `<div class="display-answer-desc">Correct translation for <span style="color:red">${chosenWord}</span>:</div>  <div class="display-answer-answer">${definition[words.indexOf(chosenWord)]}</div>`
            displayAnswer.style.visibility = "visible"
            if (displayAnswerTimeout) clearTimeout(displayAnswerTimeout)
            displayAnswerTimeout = setTimeout(() => displayAnswer.style.visibility = "hidden", 15000);
            addtoTable(incorrect, incorrect1, incorrect2, andMoreIncorrect, "incorrect")
            if (incorrect.length == 23) andMoreIncorrect = document.querySelector(".and-more-incorrect")
            incorrect.push(chosenWord)
        }
        choicesCards.forEach(card => card.style.pointerEvents = "none")
        if (wordBank.length > 0) {
            setTimeout(newWord.bind(e.target), 1000)
        } else {
            setTimeout(() => {
                e.target.style.backgroundColor = "white"
                gameContainer.classList.toggle("hidden")
                gameOver.classList.toggle("hidden")
                let totalWords = correct.length + incorrect.length
                gameOver.innerHTML = `
                <h1>You've run out of words!</h1>
                <h4>You chose correctly ${correct.length} out of ${totalWords}, or ${(correct.length * 100/ totalWords).toFixed(0)}%</h4>
                <h6>Click on one of the link below to start over, or check another category</h6>
                `
            }, 1000)
        };
        if ((incorrect.length + correct.length) > 0) {
            let html = `
            <div class="row stat-row">
            <div class="col words-played statistics-box"><div class="stats-big-data">${incorrect.length + correct.length}</div><div class="stats-title">Words Played</div></div>
            <div class="col words-left statistics-box"><div class="stats-big-data">${wordBank.length}</div><div class="stats-title">Words Left</div></div>
            </div>
            <div class="row stat-row">
            <div class="col correct-stats statistics-box"><div class="stats-big-data">${correct.length}</div><div class="stats-title">Correct</div></div>
            <div class="col incorrect-stats statistics-box"><div class="stats-big-data">${incorrect.length}</div><div class="stats-title">Incorrect</div></div>
            <div class="col overall-stats statistics-box"><div class="stats-big-data">
            ${(correct.length * 100/(incorrect.length + correct.length)).toFixed(0)}%</div><div class="stats-title">Correct</div></div>
            </div>
            `
            statistics.innerHTML = html
        }
    }
});


languageSet.addEventListener("click", function (e) {
    if (e.target.classList.contains("set-language")) {
        selectOne(languages, e.target)
        categorySet.innerHTML = ""
        settingOptions.find(element => element.language == e.target.innerText).categories.forEach(category => categorySet.insertAdjacentHTML('beforeend', `<button class="set set-category">${category}</button>`))
        categories = document.querySelectorAll(".set-category")
    }
})

directionSet.addEventListener("click", function (e) {
    if (e.target.classList.contains("set-direction")) selectOne(direction, e.target)
})

categorySet.addEventListener("click", function (e) {
    if (e.target.classList.contains("set-category")) selectOne(categories, e.target)
})

startGame.addEventListener("click", function (e) {
    if (oneSelected(languages) && oneSelected(categories) && oneSelected(direction)) {
        document.querySelector(".new-game-container").classList.add("hidden")
        document.querySelector(".start-another-game-container").classList.remove("hidden")
        let languageSelected
        let categorySelected
        let catIndex
        let directionSelected
        languages.forEach(option => {
            if (option.classList.contains("active")) languageSelected = option.innerHTML
        })
        categories.forEach(option => {
            if (option.classList.contains("active")) categorySelected = option.innerHTML
        })
        direction.forEach(option => {
            if (option.classList.contains("active")) directionSelected = option.innerHTML
        })
        document.querySelector(".multiple").classList.remove("hidden")
        settingModal.style.display = "none";
        let setPackage = settingOptions.find(element => element.language === languageSelected)
        catIndex = setPackage.categories.indexOf(categorySelected)
        let wordPackageSet = setPackage.wordbanks[catIndex]
        if (directionSelected == "To English") jsonToArray(wordPackageSet, ...setPackage.translations)
        if (directionSelected == "From English") jsonToArray(wordPackageSet, ...setPackage.translations.slice().reverse())
        if (!gameOver.classList.contains("hidden")) gameOver.classList.toggle("hidden")
        restartGameData()
        newWord()
    } else {
        warning.classList.remove("unpop")
        setTimeout(() => warning.classList.add("unpop"), 2500);
    }
})
startNewGame.addEventListener("click", e => settingModal.style.display = "block");
startAnotherGame.addEventListener("click", e => settingModal.style.display = "block");

closeModal, addEventListener("click", function (e) {
    if (e.target.classList.contains("close-modal-screen")) settingModal.style.display = "none";
})

wordlist.forEach(list => {
    list.addEventListener("mouseover", function (e) {
        if (e.target.classList.contains("word-def")) {
            definitionModal.innerHTML = `${definition[words.indexOf(e.target.id)]}`
            definitionModal.style.top = (e.target.getBoundingClientRect().top - 35) + "px"
            definitionModal.style.left = (e.target.getBoundingClientRect().left + 70) + "px"
            definitionModal.classList.remove("hidden")
        }
    })
    list.addEventListener("mouseout", () => definitionModal.classList.add("hidden"))
});

function restartWordBank(newWordBank) {
    if (newWordBank.length > 0) {
        wordBank = newWordBank
        restartGameData()
        newWord()
    }
}

allNewGame.addEventListener("click", () => restartWordBank([...correct, ...incorrect]))
correctNewGame.addEventListener("click", () => restartWordBank(correct))
incorrectNewGame.addEventListener("click", () => restartWordBank(incorrect))