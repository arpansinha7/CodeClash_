document.querySelector(".create").addEventListener("click", () => {
    localStorage.setItem("action", "create");
    window.location.href = "lobby.html";
});
document.querySelector(".join").addEventListener("click", () => {
    localStorage.setItem("action", "join");
    window.location.href = "lobby.html";
});

document.querySelector("#generate-room").addEventListener("click", () => {
    socket.emit("create-room", ({roomId:"1",  name:"XYZ"}));
})