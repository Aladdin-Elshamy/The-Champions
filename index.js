import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, push, onValue, set } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOKJjRdpW8TR5UYSDiijqhrC5vsiK66P8",
  authDomain: "endorsements-a9c5f.firebaseapp.com",
  databaseURL: "https://endorsements-a9c5f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "endorsements-a9c5f",
  storageBucket: "endorsements-a9c5f.appspot.com",
  messagingSenderId: "876328852620",
  appId: "1:876328852620:web:74eb3a0eb41773d0dcafa9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const messagesListInDB = ref(database,"messagesList")
const messageField = document.getElementById("message");
const senderField = document.getElementById("sender");
const receiverField = document.getElementById("reciever");
const submitButton = document.getElementById("submit");
const endorsementsContainer = document.querySelector(".endorsements-container");
const errorMessage = document.createElement("p");
const notExistMessage = document.createElement("p");
let numberOfClicks = 0;
let message = {
  sender: senderField.value,
  receiver: receiverField.value,
  messageContent: messageField.value,
  heartsNum: 0
}

errorMessage.style.cssText = "color:red;font-family:'Inter', sans-serif;font-weight:700;font-size:10px;margin-bottom:-5px;margin-top:2px"


submitButton.addEventListener("click",function() {
  if((!senderField.value || !receiverField.value || !messageField.value)){
    errorMessage.textContent = "All Fields should be filled";
    submitButton.before(errorMessage)

  }
  else{
    const namePattern = /\d+/ig;
    const senderResult = namePattern.test(senderField.value);
    namePattern.lastIndex=0;
    const receiverResult = namePattern.test(receiverField.value);
    namePattern.lastIndex=0;
    if(senderResult){
      errorMessage.textContent = "No Valid Name In Sender Field";
      submitButton.before(errorMessage);
    }
    else if(receiverResult){
      errorMessage.textContent = "No Valid Name In Reciever Field";
      submitButton.before(errorMessage);
      
    }
    else{
      errorMessage.remove()
      message = {sender: senderField.value, receiver: receiverField.value, messageContent: messageField.value, heartsNum:0};
      push(messagesListInDB,message)
      numberOfClicks = 0;
    }
  }
})
onValue(messagesListInDB,function(snapshot){
  if(snapshot.exists()){
    let itemsArray = Object.entries(snapshot.val());
    endorsementsContainer.innerHTML = '';
    notExistMessage.remove()
    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i]
      
      appendItemToEndorsementsContainer(currentItem)
    }
  }
  else{
    
    notExistMessage.textContent = "No endorsements here... yet";
    notExistMessage.style.cssText = "color:#fff;letter-spacing:1.5px"
    endorsementsContainer.append(notExistMessage)
  } 
})
function appendItemToEndorsementsContainer(item){
  let itemID = item[0];
  let itemValue = item[1];
  const endorsement = document.createElement("section");
  endorsement.className = "endorsement";
  const h3 = document.createElement("h3");
  h3.textContent = "From " + itemValue.sender;
  const paragraph = document.createElement("p");
  paragraph.textContent = itemValue.messageContent;
  const div = document.createElement("div");
  const secondH3 = document.createElement("h3");
  div.append(secondH3);
  const heartsDiv = document.createElement("div");
  heartsDiv.innerHTML = "<i class='bx bxs-heart' ></i>";
  const heartsNum = document.createElement("span");
  if(itemValue.heartsNum>999){
    heartsNum.textContent = "+999";
  }
  else{
    heartsNum.textContent = itemValue.heartsNum;
  }
  heartsDiv.firstChild.addEventListener("click",function(){
    let exactLocationOfItemInDB = ref(database, `messagesList/${itemID}`);
    let newNumberOfHearts = itemValue.heartsNum;

    if(numberOfClicks === 0){
      newNumberOfHearts++;
      numberOfClicks = 1;
    }
    else{
      numberOfClicks = 0;
      newNumberOfHearts--;
    }
    set(exactLocationOfItemInDB,{
      sender: itemValue.sender,
      receiver: itemValue.receiver,
      messageContent: itemValue.messageContent,
      heartsNum: newNumberOfHearts
    })
    if(itemValue.heartsNum>999){
      heartsNum.textContent = "+999"
    }
    else{
      heartsNum.textContent = itemValue.heartsNum;
    }
    
  })
  heartsDiv.style.cssText="margin-top:2px;display:flex;gap:5px;align-items:center"
  heartsDiv.append(heartsNum);
  div.append(heartsDiv)
  div.style.cssText="display:flex;justify-content:space-between;align-items:center;margin-top:-1em"
  secondH3.textContent = "To " + itemValue.receiver;
  endorsement.append(h3);
  endorsement.append(paragraph);
  endorsement.append(div);

  endorsementsContainer.append(endorsement);
}