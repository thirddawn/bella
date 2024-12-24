url = "https://script.google.com/macros/s/AKfycbz5F_JnphIFl1Jz3RBYuxomrKlqOIdFfyVNa9YoWOO65F8VmAoUYraEAcLqFFfKsxTA/exec"
msgs = [
    "You're on track!",
    "Keep going!",
    "Don't stop!",
    "Was that a guess?",
    "You must be cheating...",
    "Hope you're having fun",
    "You still here?",
    "Are you a robot?",
    "Are you real?",
    "Am I real?",
    "Keep it up!",
    "You're doing great!",
    "Every day is a new day",
    "If you change every letter of your guess, would it still be a guess?",
    "One might imagine Sisyphus happy",
    "It's only an uphill battle if you're moving up",
    "Woah",
    "Wow",
    "Awesome",
    "Three pointer!",
    "Right on the buzzer...",
    "Magic & Bird",
    "Legendary!",
    "Who's V?"
]


function submitAnswer(){
    document.getElementById("inputWrapper").style = "";
    var progress = localStorage.getItem("progress");
    document.getElementById("blur").style = "backdrop-filter: blur(10px); pointer-events: all";
    document.getElementById("waitingMsg").style = "color: white;";
    document.getElementById("waitingMsg").innerText = msgs[Math.floor(Math.random()*msgs.length)];
    document.getElementById("icon").style = "stroke:transparent;";
    document.getElementById("submitButton").disabled = true;
    fetch(url+"?progress="+progress+"&answer="+document.getElementById("questionInput").value.substring((document.getElementById("questionInput").maxLength == -1 ? 0 : 1)), {method: "POST"}).then(res => res.text()).then(text => {
        var content = text.split('|');
        if(content[0] == "true"){
            localStorage.setItem("progress", content[1]);
            restoreProgress();
        }
        else{
            document.getElementById("inputWrapper").style = "animation: shake 0.2s ease-in-out 1s 2;"
            document.getElementById("blur").style = ""
            document.getElementById("waitingMsg").style = "";
            document.getElementById("icon").style = "stroke: white";
            document.getElementById("submitButton").disabled = false;
        }
    });
}

function restoreProgress(){
    var progress = localStorage.getItem("progress");
    if(progress == null || progress == "undefined" || progress == ""){
        progress = "addeb709-5cfc-46b4-9510-3ab2e298c686";
        localStorage.setItem("progress","addeb709-5cfc-46b4-9510-3ab2e298c686");
        fetch(url + "?progress="+progress, {method: "POST"}).then(res => res.text()).then(text => {
            document.getElementById("questionInput").value = " ";
            document.getElementById("blur").style = "";
            document.getElementById("icon").style = "";
            document.getElementById("waitingMsg").style = "";
            var content = text.split('|');
            document.getElementById("question").innerHTML = content[1];
            document.getElementById("question").style = "";
            document.getElementById("questionInput").maxLength = parseInt(content[2])+1;
            document.querySelector("input").style = "--maxlength: " + parseInt(content[2]);
            document.getElementById("submitButton").disabled = false;
            document.getElementById("questionNo").innerText = "Q" + content[0];
            document.getElementById("questionNo").style =  "color:white;";
            defaultValue = "  ";
        });
    }
    else{
        try{
            fetch(url + "?progress="+progress, {method: "POST"}).then(res => res.text()).then(text => {
                document.getElementById("questionInput").value = " ";
                document.getElementById("question").style = "";
                document.getElementById("blur").style = "";
                document.getElementById("waitingMsg").style = "";
                var content = text.split('|');
                document.getElementById("questionNo").innerText = "Q" + content[0];
                document.getElementById("questionNo").style =  "color:white;";
                if(content.length > 4) 
                {
                    if (content[4] >= new Date().getTime()){
                        var distance = content[4] - new Date().getTime();
                        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                        document.getElementById("question").innerText = days + "d " + hours + "h " + minutes + "m " + seconds +"s"
                        intervalRef = setInterval(()=>clockTick(content[4]), 1000);
                        document.getElementById("questionInput").remove();
                        return;
                    }
                }
                if(content[2] >= 0){
                    document.getElementById("question").innerHTML = content[1];
                    document.getElementById("questionInput").maxLength = parseInt(content[2])+1;
                    document.querySelector("input").style = "--maxlength: " +parseInt(content[2]);
                    document.getElementById("submitButton").disabled = false;
                    if (parseInt(content[2]) > 0) document.getElementById("icon").style = "";
                    if(content.length > 3) {
                        document.getElementById("questionInput").value = " " + content[3];
                        defaultValue = " " + content[3] + " ".repeat(parseInt(content[2]) - content[3].length);
                    }
                    else{
                        defaultValue = " ".repeat(parseInt(content[2])+1);
                    }
                    if(document.getElementById("batteryPercent") != null){
                        navigator.getBattery().then(function(battery) { document.getElementById("batteryPercent").innerText = battery.level * 100 + "%"})
                    }
                }
                else{
                    document.getElementById("question").innerHTML = content[1] + "<br><span style='font-size: small;'>No right answer for this one!</span>";
                    document.getElementById("submitButton").disabled = false;
                    document.getElementById("questionInput").removeAttribute("maxLength");
                    document.querySelector("input").style = "--maxlength: 10; letter-spacing: inherit; font-family: 'the-seasons'; background: repeating-linear-gradient(90deg, rgb(255, 255, 255) 0, rgb(255, 255, 255) 1ch) 0 100%/100% 2px no-repeat;"
                    document.getElementById("icon").style = "";
                    if(content.length > 3) document.getElementById("questionInput").value = " " + content[3]
                }
            });
        }
        catch(e){
            sleep(100).then(()=>{restoreProgress();})
        }
    }
}

function OnInputKeyDown(object, event){
    if(event.keyCode == 13){
        event.preventDefault();
        submitAnswer();
    }
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

defaultValue = "";
intervalRef = 0

function clockTick(date){
    var distance = date - new Date().getTime();
    if (distance <= 1000) {clearInterval(intervalRef); location.reload();}
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    document.getElementById("question").innerText = days + "d " + hours + "h " + minutes + "m " + seconds +"s"
}

introMessages = [
    "I hope you like puzzles", 
    "Usually a challenge like this doesn't have a prize", 
    "But this one does",
    "Just crack a few puzzles",
    "And you'll find out",
    "Enjoy"
]

welcomeBackMessages = ["Welcome back", "Good to see you again", "Oh, you're back?", "You got this!"]
i = 0

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function nextIntroMessage(){
    if(i == introMessages.length - 1){
        document.getElementById("waitingMsg").style = "transition: 0.5s color";
        document.getElementById("introButton").style = "transition: 0.5s all; border-color: transparent; color: transparent;"
        sleep(500).then(()=>{
            document.getElementById("waitingMsg").innerText = introMessages[i];
            document.getElementById("waitingMsg").style = "transition: 0.5s color; color: white";
            document.getElementById("introButton").remove()
            i += 1;
        })
        sleep(10000).then(()=>{if(document.getElementById("question").innerText == "") document.getElementById("waitingMsg").innerText = "Sorry for the wait, we're still loading..."})
        restoreProgress();
    }
    else if(i < introMessages.length){
        document.getElementById("waitingMsg").style = "transition: 0.5s color";
        document.getElementById("introButton").disabled = true;
        sleep(500).then(()=>{
            document.getElementById("waitingMsg").innerText = introMessages[i];
            document.getElementById("waitingMsg").style = "transition: 0.5s color; color: white";
            document.getElementById("introButton").disabled = false;
            i += 1;
        })
    }
}

var progress = localStorage.getItem("progress");
if(progress == null || progress == "undefined" || progress == ""){
    document.getElementById("blur").style = "backdrop-filter: blur(10px); pointer-events: all;";
    document.getElementById("blur").innerHTML = "<h1 id='waitingMsg' style='color:white'>Welcome</h1><button id='introButton' onclick='nextIntroMessage()'>Next</button>";
}
else{
    sleep(10).then(()=>{document.getElementById("waitingMsg").style = "color:white";})
    sleep(10000).then(()=>{if(document.getElementById("question").innerText == "") document.getElementById("waitingMsg").innerText = "Sorry for the wait, we're still loading..."})
    document.getElementById("waitingMsg").innerText = welcomeBackMessages[Math.floor(Math.random()*welcomeBackMessages.length)]
    restoreProgress();
}