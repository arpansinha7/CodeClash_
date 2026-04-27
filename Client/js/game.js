const socket = io();
socket.on("connect", () => {
    console.log("Socket Connected:", socket.id);
    const roomId = localStorage.getItem("roomId");
    const playerName = localStorage.getItem("playerName");
    socket.emit("register-player", {roomId, playerName});
});

socket.on("leaderboard-update", (players) => {
    console.log("players data: ", players);
    console.log("Leaderboard Recieved");
    const list = document.getElementById("leaderboard-list");
    list.innerHTML = "";
    players.forEach((p, i) => {
        const li = document.createElement("li");
        li.innerText = `${i+1}. ${p.name}`;
        const span = document.createElement("span");
        span.innerText = `${p.score} pts`;
        li.appendChild(span);
        if(i === 0)
            li.classList.add("first");
        else if(i === 1)
            li.classList.add("second");
        else if(i === 2)
            li.classList.add("third");
        list.appendChild(li);
    });
});

socket.on("submission-result",({result,passed, total, allPassed, score}) => {
      const list = document.getElementById("result-list");
  list.innerHTML = "";
  result.forEach((tc, i) => {
    const li = document.createElement("li");
    if (tc.error && tc.error.includes("timed out")) {
      li.className = "result-tle";
      li.innerText = `Test ${i+1}: TLE — Time Limit Exceeded`;
    } else if (tc.error) {
      li.className = "result-wa";
      li.innerText = `Test ${i+1}: Runtime Error — ${tc.error}`;
    } else if (tc.passed) {
      li.className = "result-ac";
      li.innerText = `Test ${i+1}: Accepted`;
    } else {
      li.className = "result-wa";
      li.innerText = `Test ${i+1}: Wrong Answer — Expected: ${JSON.stringify(tc.expected)}, Got: ${JSON.stringify(tc.output)}`;
    }
    list.appendChild(li);
  });

  document.getElementById("result-panel").classList.add("show");
    //alert(`${passed}/${total} test cases passed! ${allPassed ? 'Correct' + score + ' points' :'No Points'}`);
});

socket.on("game-over", (players)=> {
    alert("game over");
});

window.addEventListener('monacoReady', () => {

    document.getElementById("close-result").addEventListener("click", () => {
        document.getElementById("result-panel").classList.remove("show");
    });


const roomId = localStorage.getItem("roomId");
const questions = JSON.parse(localStorage.getItem("questions"));
document.getElementById("question-title").innerText = questions[0].title;
document.getElementById("question").innerText = questions[0].description;

let currentIndex = 0;
let timeLeft = 60;

document.getElementById("question").innerText = questions[currentIndex].description;

document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        currentIndex = parseInt(btn.dataset.index);
        document.getElementById("question-title").innerText = questions[currentIndex].title;
        document.getElementById("question").innerText = questions[currentIndex].description;
        window.monacoEditor.setValue(questions[currentIndex].starterCode);

        document.getElementById("result-panel").classList.remove("show");
    });
});

const timerE1 = document.getElementById("timer");

const timer = setInterval(() => {
    timeLeft--;
    timerE1.innerText = "Time Left: " + timeLeft;

    if(timeLeft <= 0)
    {
        clearInterval(timer);
        alert("Time's up!");
    }
}, 1000);  
let submitCount = 0;
const submitBtn = document.getElementById("submit");
submitBtn.addEventListener("click", () => {

   
    console.log("Submit clicked");
    submitCount++;
    if(submitCount >=3)
    {
        clearInterval(timer);
    }
    const code = window.monacoEditor.getValue();
    const questionId = questions[currentIndex].id;


    socket.emit("submit-code", {
        roomId: localStorage.getItem("roomId"),
        code,
        questionId
    });

    document.getElementById("result-panel").classList.remove("show");

});


});