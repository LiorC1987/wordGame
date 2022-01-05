'use strict';

const settingOptions = [
    {
    language: "Hebrew",
    categories: ["1000 words", "100 words"],
    wordbanks: [hebrewWords.words, hebrewWords.words.slice(0,100)],
    translations: ["heb", "eng"]
},
{
    language: "French",
    categories: ["1000 words", "100 words", "colors"],
    wordbanks: [frenchWords.words, frenchWords.words.slice(0,100)],
    translations: ["fre", "eng"]
},
{
    language: "Spanish",
    categories: ["1000 words", "100 words"],
    wordbanks: [spanishWords.words, spanishWords.words.slice(0,100)],
    translations: ["spa", "eng"]
},
{
    language: "Polish",
    categories: ["1000 words", "100 words", "colors", "animals"],
    wordbanks: [polishWords.words, polishWords.words.slice(0,100),polishColors],
    translations: ["pol", "eng"]
}
]

let words = ["one", "two", "three" , "four", "five", "six", "seven", "eight", "nine", "ten"]
let wordBank;
let chosenWord;
let correctIndex;
let choices;
let correct = [];
let incorrect = [];
let score = 0;
let tries = 5;
let definition = ["1","2","3","4","5","6","7","8","9","10"]
let definitionList 
let andMoreCorrect
let andMoreIncorrect
function jsonToArray(languagePackage, fromLang, toLang) {
    words = []
    definition= []
    languagePackage.map(word => {
        words.push(word[fromLang])
        definition.push(word[toLang])
    })
    wordBank = words.slice()
    definitionList = definition.slice()
} 

console.log(words, definition)
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
const languageSet = document.querySelector(".language")
settingOptions.forEach(packager => languageSet.insertAdjacentHTML('beforeend', `<button class="set set-language">${packager.language}</button>`))
const languages = document.querySelectorAll(".set-language")
const categorySet = document.querySelector(".category")
let categories = document.querySelectorAll(".set-category")
const gameTypeSet = document.querySelector(".game-type")
const games = document.querySelectorAll(".set-game")
const startGame = document.querySelector(".start-game")
const warning = document.querySelector(".warning")
const startNewGame = document.querySelector(".begin-new-game")
const startAnotherGame = document.querySelector(".begin-another-game")
const settingModal = document.querySelector(".modal-game")
const closeModal = document.querySelector(".close-modal-screen")
const statistics = document.querySelector(".statistics")
triesDiv.innerHTML = "🖤".repeat(tries)

const shuffle = arg => arg.sort(() => Math.random() - 0.5)

const wrongChoice = wordList =>  wordList.splice(Math.floor(Math.random()*wordList.length), 1)

const tryGuess = tries => "🖤".repeat(tries)

function newWord() {
    if (this) {
        this.style.backgroundColor = "white"
    }
    choicesCards.forEach(card => card.style.pointerEvents = "")
    chosenWord = wordBank[Math.floor(Math.random()*wordBank.length)];
    wordCard.innerHTML = `<p>${chosenWord}</p>`
    correctIndex = words.indexOf(chosenWord)
    let correctAnswer = definition[correctIndex]
    definitionList.splice(correctIndex, 1)
    if (gameContainer.classList.contains("multiple")) multipleChoice()
    
    
function multipleChoice() {
    let [choice2, choice3, choice4] = [wrongChoice(definitionList),wrongChoice(definitionList),wrongChoice(definitionList)]
    choices = shuffle(shuffle(shuffle([correctAnswer, choice2, choice3, choice4])))
    choicesCards.forEach((card, i) => card.innerHTML = choices[i])
    wordBank.splice(wordBank.indexOf(chosenWord), 1)
}};

function selectOne(category, target) {
    category.forEach(lang => {
        lang.backgroundColor = "white"
        lang.classList.remove("active")
    })
    target.backgroundColor = "blue"
    target.classList.add("active")
}
const oneSelected = categories => Array.from(categories).some(category => category.classList.contains("active"))


submitWord.addEventListener("click", function(e) {
    e.preventDefault();
    if (inputWord.value == definition[correctIndex]) {
        pastWordsCorrect.innerHTML += `<br>${chosenWord}`
        correct.push(chosenWord)
        tries = 5
        triesDiv.innerHTML = tryGuess(tries)
        newWord()
    } else if (tries > 1) {
        tries -= 1
        triesDiv.innerHTML = tryGuess(tries)
    } else {
        tries = 5
        triesDiv.innerHTML = tryGuess(tries)
        pastWordsIncorrect.innerHTML += `<br>${chosenWord}`
        incorrect.push(chosenWord)
        newWord()
    }
    inputWord.value = ""
});

cardsContainer.addEventListener("click", function(e) {
    function addtoTable(type, first, second, andMore, typeString) {
        console.log(Object.keys({type})[0])
        if (type.length < 8) {
            first.innerHTML += `<br>${chosenWord}`
        } else if (type.length < 15 && type.length >= 8){
            console.log(correct.length)
            second.innerHTML += `<br>${chosenWord}`
        } else if (type.length == 15) {
            second.innerHTML += `<div class='and-more-${typeString}'>and 1 more...</div>`
            console.log(second.innerHTML)
        }  else {
            andMore.innerHTML = `and ${type.length - 14} more...`
        }
    }
    if (e.target.classList.contains('cards')) {
        let userChoice = e.target.innerText 
        console.log(words.indexOf(chosenWord), definition.indexOf(userChoice), userChoice)
        if (words.indexOf(chosenWord) === definition.indexOf(userChoice)) {
            e.target.style.backgroundColor = "green"
            addtoTable(correct, correct1, correct2, andMoreCorrect, "correct")
            if (correct.length == 15) andMoreCorrect = document.querySelector(".and-more-correct")
            correct.push(chosenWord)
        } else {
            e.target.style.backgroundColor = "red"
            addtoTable(incorrect, incorrect1,incorrect2, andMoreIncorrect, "incorrect")
            if (incorrect.length == 15) andMoreIncorrect = document.querySelector(".and-more-incorrect")
            incorrect.push(chosenWord)
        }
        choicesCards.forEach(card => card.style.pointerEvents = "none")
        if (wordBank.length > 0) {setTimeout(newWord.bind(e.target), 1000)} 
        else {
            setTimeout(() => {
                gameContainer.classList.toggle("gameover")

                gameContainer.innerHTML = `
                <p>You've run out of words!</p>
                <p>You chose correctly ${correct.length} out of ${words.length}, or ${(correct.length * 100/ words.length).toFixed(0)}%
                <p>Click on the link below to start over, or check another category</p>
                `
            }, 1000)
        };
        if ((incorrect.length + correct.length) > 0) {
            let html = `
            <div class="statistics-row">Words played: ${incorrect.length + correct.length}</div>
            <div class="statistics-row">Words left to play: ${wordBank.length}</div>
            <div class="statistics-row">Correct:${correct.length}       Incorrect:${incorrect.length}</div>
            <div class="statistics-row">So far ${(correct.length * 100/(incorrect.length + correct.length)).toFixed(0)}% of words gotten correctly.</div>
            `
            statistics.innerHTML = html
        }
    }
});


languageSet.addEventListener("click",function(e) {
 if (e.target.classList.contains("set-language")) {
    selectOne(languages, e.target)
    categorySet.innerHTML = ""
    console.log(settingOptions.find(element => element.language == e.target.innerText))
    settingOptions.find(element => element.language == e.target.innerText).categories.forEach(category => categorySet.insertAdjacentHTML('beforeend', `<button class="set set-category">${category}</button>`))
    categories = document.querySelectorAll(".set-category")
}
})



categorySet.addEventListener("click",function(e) {
    if (e.target.classList.contains("set-category")) selectOne(categories, e.target)
   })

gameTypeSet.addEventListener("click",function(e) {
    if (e.target.classList.contains("set-game")) selectOne(games, e.target)
   })

startGame.addEventListener("click", function(e) {
    if (oneSelected(languages) && oneSelected(categories) && oneSelected(games)) {
        document.querySelector(".new-game-container").classList.add("hidden")
        document.querySelector(".start-another-game-container").classList.remove("hidden")
        console.log(languageSet)
        console.log(languages)
        let languageSelected
        let categorySelected
        let catIndex
        let gameTypeSelected
        languages.forEach(option => {if (option.classList.contains("active")) languageSelected = option.innerHTML})
        categories.forEach(option => {if (option.classList.contains("active")) categorySelected = option.innerHTML})
        games.forEach(option => {if (option.classList.contains("active")) gameTypeSelected = option.innerHTML})
        console.log(languageSelected, categorySelected, gameTypeSelected)
        if (gameTypeSelected == "Multiple Choice") {
            document.querySelector(".multiple").classList.remove("hidden")
        } else if (gameTypeSelected == "Type In") {
            document.querySelector(".input-word").classList.remove("hidden")
        }
        
        settingModal.style.display = "none";
        let setPackage = settingOptions.find(element => element.language === languageSelected)
        console.log(setPackage.categories)
        catIndex = setPackage.categories.indexOf(categorySelected)
        console.log(catIndex)
        let wordPackageSet = setPackage.wordbanks[catIndex]
        console.log(setPackage.translations[0])
        jsonToArray(wordPackageSet,setPackage.translations[0],setPackage.translations[1])
        console.log(words, definition)
        correct1.innerHTML = correct2.innerHTML = incorrect1.innerHTML = incorrect2.innerHTML = ""
        correct = [];
        incorrect = [];
        scoreDiv.classList.remove("hidden")
        statistics.innerHTML = ""
        newWord()
    } else {
        warning.classList.remove("unpop")
        setTimeout(() => warning.classList.add("unpop"), 2500);
    }
})
startNewGame.addEventListener("click", e => settingModal.style.display = "block");
startAnotherGame.addEventListener("click", e => settingModal.style.display = "block");

closeModal,addEventListener("click", function(e) {
    if (e.target.classList.contains("close-modal-screen")) settingModal.style.display = "none";
})

