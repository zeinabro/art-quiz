const easyButton = () =>{
    const start = document.querySelector("#easy")
    start.addEventListener('click', () => {
        localStorage.setItem("difficulty","easy")
        window.open("../QuestionPage/quesPage.html","_self")
    })
}

const hardButton = () =>{
    const start = document.querySelector("#hard")
    start.addEventListener('click', () => {
        localStorage.setItem("difficulty","hard")
        window.open(`../QuestionPage/quesPage.html`,"_self")
    })
}

easyButton()
hardButton()



