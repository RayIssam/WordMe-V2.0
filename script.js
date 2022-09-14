

//Selectors
const paragraph=document.getElementById("paragraph") ;
const generatedWordsList = document.getElementById("generated-words");
const wordToLearnList=document.getElementById("words-toLearn");
const generateButton=document.getElementById("generate-button")
const LOCAL_STORAGE_PREFIX='WORD_ME-LIST'
const WORDME_STORAGE_KEY=`${LOCAL_STORAGE_PREFIX}-`
let words=[]
let LearningWords=loadwords()

//event listeners
generateButton.addEventListener("click",checkWords)
document.addEventListener("click",LibreTranslate),{once: false};
document.addEventListener("click",heartIcon)
document.addEventListener("click",trashIcon)
document.addEventListener("click",google)

//icons 
//remove item 
function trashIcon(e){
    let element = e.target;
    if(element.classList.contains("trashIcon")){
        let word =element.previousElementSibling.innerHTML
        //get the index of the word 
        let index=LearningWords.indexOf(word)
        //split the word using index from the array 
        LearningWords.splice(index,1)
        //update the array in the local storage 
        saveTolocalSTorage();
    }
}

//add item to learning words list 
function heartIcon(e){
    let element = e.target;
    let word;
    if(element.classList.contains("heartIcon")){
        let word=element.previousElementSibling.innerHTML
        //push the word that clicked to the learning list
            LearningWords.push(word)
        //update the array in the local storage 
        saveTolocalSTorage();
        }
    }
    

//functions 

function checkWords(){
    //check if the textarea is empty 
    if (paragraph.value==''){
        alert("insert a paragraph")
    }
    else uniqueArray()
}

function uniqueArray(){
    //split the paragraph by " " and limit to 200 items 
    let word = paragraph.value.split(" ",200);
    //check if the word is not a number (Nan) ans push it to the word list 
    //if the word is a number its not pushed 
    for (let i=0;i<word.length;i++ ){
        if(isNaN(word[i])){
            words.push(word[i])       
         }
   }
   //make a set to remove duplicate words 
   let makeSet = new Set (words)
   //make an array of that set since set returns a new iterator object 
    words=Array.from(makeSet);
    addToWordList()
    //make the textarea clean after adding the words 
    paragraph.value=""
}

function addToWordList(){
  for(let i=0;i<words.length;i++){
    //create a div 
    let div=document.createElement("div")
    div.classList.add("word-card")
    //create a button that has a heart icon inside 
    let heartIcon=document.createElement("button")
    heartIcon.innerHTML='<i class="fa-solid fa-heart"></i>'
    heartIcon.classList.add("heartIcon")
    //create list item which will be added to the ("ul") list L ,  with the word content inside 
    let item=document.createElement("li")
    item.classList.add("newWord")
    item.innerHTML=words[i];
    //append all the element that has been created to the div 
    div.append(item,heartIcon)
    //appened the div to the words section element 
    generatedWordsList.append(div)
  }
  //clear this array each time we insert a new pargraph 
  words=[]
}

//function to save to local storage 
function saveTolocalSTorage(){
    //overwrites the original array.and sorts the elements as strings in alphabetical order  
    LearningWords.sort()
    //save our array to local storage and using the key initialized in the beginning of our file 
     localStorage.setItem(WORDME_STORAGE_KEY, JSON.stringify(LearningWords));
     showWords()
    }
/*  
    Update local storage function :: 
    we set LearningWords array to this loadwords() function 
     this function returns the data from the local storage that have been saved before 
      so every time our array is pushing new items but also have the old items 
    so when we refresh our page we dont empty the array as we did in older versions  LearningWords=[]
*/
    function loadwords(){
        let LearnWords=JSON.parse(window.localStorage.getItem('WORD_ME-LIST-'))
        return LearnWords
    }
    function showWords(){
        //we remove duplicates from our LearningWords array  
        let makeSet = new Set (LearningWords)
        LearningWords=Array.from(makeSet);
        //we check if the local storage is not empty 
        if (LearningWords!== null)
        {
            //everytime we clear theWordsToLearn section and add the updated list of words 
            //so we dont add the whole array each time we push a new word 
            wordToLearnList.innerHTML=""
            for(let i=0;i<LearningWords.length;i++){
                let div=document.createElement("div")
                div.classList.add("word-card")
                let trashIcon=document.createElement("button")
                trashIcon.innerHTML='<i class="fa-solid fa-trash"></i>'
                trashIcon.classList.add("trashIcon")
                let item=document.createElement("li")
                item.classList.add("learnWord")
                item.innerHTML=LearningWords[i];
                div.append(item,trashIcon)
                wordToLearnList.append(div)
              }
        }

    }

async function LibreTranslate(e){
    e.preventDefault();
    let element = e.target;
    // stored the parent element of the clicked item in a div variable 
    let div=element.parentElement

    // check if the element we clicked have a class of .newWord
    if(element.classList.contains("newWord")){
        //fetch the api
        const res = await fetch("https://libretranslate.com/translate", {
            method: "POST",
            body: JSON.stringify({
                //q is the word to translate 
                q: element.innerHTML,
                source: "en",
                target: "ar",
                format: "text",
                api_key: "dccf08ec-7258-48af-b0e4-71a38560cba0"
            }),
            headers: { "Content-Type": "application/json" }
        })
        //the api response with the translated word 
        let respone=await res.json(); 
        //store the arabic translated word in a variable 
        let arabic=respone.translatedText
        //check if the div had this translation element before 
        if (!div.querySelector("p")){
            //if we didn't translate before 
            //we create an element of tag P and assign it the translated word 
            let arabicWord=document.createElement("p")
             arabicWord.innerHTML=arabic
             div.append(arabicWord)
        }  
    }
}

function google(e){
    let element=e.target;
    //we target the word with class learnWord
    if (element.classList.contains("learnWord")){
        //we store the word innerHTML 
        let word =element.innerHTML
        //we open a google tab with meaning of that word that we passed in the link using template literals 
        window.open(`https://www.google.com/search?q=${word}+meaning`);
    }
}

showWords()
