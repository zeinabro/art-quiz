let difficulty = localStorage.getItem("difficulty");

const fetchData = async (difficulty) => {
  const res = await fetch(
    `https://lap1-project-backend.onrender.com/randomQuestions/${difficulty}`
  );
  const data = await res.json();
  return data;
};

const displayTopBar = (quesNum, wrongGuess, score) => {
  topBar.textContent = "";
  const quesProgress = document.createElement("p");
  quesProgress;
  quesProgress.innerHTML = `<i class="fa-solid fa-circle-question"></i>  ${quesNum} / 5`;
  topBar.appendChild(quesProgress);

  const scoreBar = document.createElement("p");
  scoreBar.innerHTML = `<i class="fa-solid fa-star"></i> Score: ${score}`;
  scoreBar.id = "p2";
  topBar.appendChild(scoreBar);

  const chancesLeft = document.createElement("p");
  chancesLeft.innerHTML = `${`<i class="fa-solid fa-pen-ruler"></i> `.repeat(
    wrongGuess
  )}${`<i class="fa-solid fa-palette"></i> `.repeat(4 - wrongGuess)}`;
  chancesLeft.id = "p3";
  topBar.appendChild(chancesLeft);
};

const displayQues = async (quesNum) => {
  questionSection.textContent = "";
  answerSection.textContent = "";
  resultsSection.textContent = "";

  if (!fetchStatus) {
    data = await fetchData(difficulty);
    fetchStatus = true;
  }

  const quesImage = document.createElement("img");
  quesImage.id = "painting";
  let correctAuthor = data[quesNum - 1].author;
  quesImage.src = data[quesNum - 1].imageUrl;
  quesImage.alt = `Q${quesNum} painting`;
  questionSection.appendChild(quesImage);

  let randomPixel = randomSpotImg();

  let randomizeChoices = data[quesNum - 1].wrongAuthors 
  let randomNum = Math.floor(Math.random() * 5) 
  randomizeChoices.splice(randomNum, 0, correctAuthor)

  for (let i = 0; i < 5; i++) {
    const choice = document.createElement("button");
    choice.textContent = randomizeChoices[i];
    answerSection.appendChild(choice);

    choice.addEventListener("click", () => {
      let correct = false;
      if (document.querySelector("#chancesBlink") != null) {
        document.querySelector("#chancesBlink").id = "p3";
      }
      if (choice.textContent == correctAuthor) {
        correct = true;
        score += 5 - wrongGuess;
        topBar.childNodes[1].textContent = `Score: ${score}`;
        choice.style.backgroundColor = "green";
      } else {
        let newX;
        let newY;
        wrongGuess++;
        randomPixel[0] > 50
          ? (newX = Math.floor(
              randomPixel[0] - ((randomPixel[0] - 50) / 4) * wrongGuess
            ))
          : Math.floor(
              (newX = randomPixel[0] + ((50 - randomPixel[0]) / 4) * wrongGuess)
            );
        randomPixel[1] > 50
          ? Math.floor(
              (newY = randomPixel[1] - ((randomPixel[1] - 50) / 4) * wrongGuess)
            )
          : Math.floor(
              (newY = randomPixel[1] + ((50 - randomPixel[1]) / 4) * wrongGuess)
            );
        quesImage.style.translate = `-${newX}% -${newY}%`;
        correct = false;
        choice.disabled = true;
        choice.classList.add("wrong-answer");
      }
      checkAnswer(correct, correctAuthor);
    });
  }
};

const checkAnswer = (correct, correctAuthor) => {
  resultsSection.textContent = "";
  quesImage = document.querySelector(".image-container img");
  if (correct == true && wrongGuess < 5) {
    zoomLevel = 10;
    results("correct", correctAuthor);
    quesNum++;
    painting.style.translate = "-50% -50%";
    painting.style.transform = `scale(${1})`;
  } else {
    topBar.childNodes[2].innerHTML = `${`<i class="fa-solid fa-pen-ruler"></i> `.repeat(
      wrongGuess
    )} ${`<i class="fa-solid fa-palette"></i> `.repeat(4 - wrongGuess)}`;
    if (wrongGuess == 4) {
      zoomLevel = 10;
      painting.style.translate = "-50% -50%";
      painting.style.transform = `scale(${1})`;
      wrongGuess = 0;
      if (quesNum < 5) {
        quesNum++;
      }
      results("fail", correctAuthor);
    } else {
      zoomOut();
      results("incorrect", correctAuthor);
    }
  }
};

const results = (result, correctAuthor) => {
  const resultsText = document.createElement("p");
  resultsText.className = "result-text";
  if (result == "correct") {
    resultsText.textContent = `Correct! You scored ${5 - wrongGuess} points.`;
    resultsSection.appendChild(resultsText);
    showDescription();
    wrongGuess = 0;
    if (quesNum < 5) {
      nextQues(correctAuthor);
    }
  } else if (result == "incorrect") {
    document.querySelector("#p3").id = "chancesBlink";
    resultsText.textContent = `Oops! You have ${4 - wrongGuess} chance${
      4 - wrongGuess == 1 ? `` : `s`
    } left.`;
    resultsSection.appendChild(resultsText);
  } else if (result == "fail") {
    resultsText.textContent = "Sad! You have no chances left.";
    showDescription();
    resultsSection.appendChild(resultsText);
    if (quesNum < 5) {
      nextQues(correctAuthor);
    }
  }

  if (quesNum == 5 && (result == "correct" || result == "fail")) {
    answerSection.childNodes.forEach((button) => {
      button.disabled = true;
      if (button.textContent == correctAuthor) {
        button.style.backgroundColor = "green";
        button.style.color = "white";
      }
    });
    displayTopBar(quesNum, wrongGuess, score);
    finishGame();
  }
};

const nextQues = (correctAuthor) => {
  const nextQButton = document.createElement("button");
  nextQButton.className = "next-q-button";
  nextQButton.innerHTML = "&#10132;";
  descriptionSection.appendChild(nextQButton);

  nextQButton.addEventListener("click", () => {
    descriptionSection.querySelector("p").textContent = "";
    descriptionSection.querySelector("img").remove();
    descriptionSection.querySelector("button").remove();
    descriptionSection.classList.add("hidden");
    runGame(quesNum, 0, score);
  });

  answerSection.childNodes.forEach((button) => {
    button.disabled = true;
    if (button.textContent == correctAuthor) {
      button.style.backgroundColor = "green";
      button.style.color = "white";
    }
  });
};

const finishGame = () => {
  const resultsText = resultsSection.childNodes[0];
  document.querySelector("#p2").id = "scoreBlink";
  resultsText.textContent = `You have completed the game! Your final score is ${score} points.`;
  const playAgainSection = document.createElement("div");
  playAgainSection.className = "play-again-section";
  descriptionSection.appendChild(playAgainSection);
  const playEasyMode = document.createElement("button");
  const playHardMode = document.createElement("button");
  playEasyMode.textContent = "Play again: Easy Mode";
  playEasyMode.classList.add("easy-mode-button");
  playHardMode.textContent = "Play again: Hard Mode";
  playHardMode.classList.add("hard-mode-button");
  playAgainSection.appendChild(playEasyMode);
  playAgainSection.appendChild(playHardMode);

  playEasyMode.addEventListener("click", () => {
    fetchStatus = false;
    localStorage.setItem("difficulty", "easy");
    window.location.reload();
  });

  playHardMode.addEventListener("click", () => {
    fetchStatus = false;
    localStorage.setItem("difficulty", "hard");
    window.location.reload();
  });
};

const runGame = (quesNum, wrongGuess, score) => {
  wrongGuess = 0;
  if (quesNum < 6) {
    displayTopBar(quesNum, wrongGuess, score);
    displayQues(quesNum);
  } else {
    fetchStatus = false;
  }
};

const randomSpotImg = () => {
  const painting = document.getElementById("painting");
  const randomX = Math.floor(Math.random() * 330);
  const randomY = Math.floor(Math.random() * 330);
  painting.style.translate = `-${randomX}% -${randomY}%`;
  painting.style.objectFit = "cover";
  return [randomX, randomY];
};

const zoomOut = () => {
  const painting = document.getElementById("painting");
  zoomLevel -= (40 / 100) * zoomLevel;
  painting.style.transform = `scale(${zoomLevel})`;
};

const showDescription = () => {
  descriptionSection.classList.remove("hidden");
  document.querySelector(
    "#p2"
  ).innerHTML = `<i class="fa-solid fa-star"></i> Score: ${score}`;
  const image = document.querySelector("#painting");
  const imageUrl = image.src;
  const correctObj = data.find((obj) => obj.imageUrl === imageUrl);
  const paragraphElement = descriptionSection.querySelector("p");
  const descriptionTitle =
    descriptionSection.querySelector(".description-title");
  descriptionTitle.innerHTML = `${correctObj.name} <br>(${correctObj.author})`;
  const description = correctObj.description;
  const quesImage = document.createElement("img");
  quesImage.className = "description-painting";
  quesImage.src = correctObj.imageUrl;
  quesImage.alt = `Q${quesNum} painting`;
  descriptionSection.appendChild(quesImage);
  paragraphElement.textContent = description;
};

const topBar = document.querySelector(".topBar");
const questionSection = document.querySelector(".image-container");
const answerSection = document.querySelector(".answers");
const resultsSection = document.querySelector(".results");
const descriptionSection = document.querySelector(".description");
const titleBar = document.querySelector(".title");

let zoomLevel = 10;
let quesNum = 1;
let wrongGuess = 0;
let score = 0;

let data = null;
let fetchStatus = false;

runGame(quesNum, wrongGuess, score);
