const correctAnswers = {
    q1: "sant",
    q2: "falskt",
    q3: "1946",
    q4: "kakao",
    q5: ["koffein", "socker"],
    q6: ["Coca-Cola", "Pepsi"],
    q7: "sant",
    q8: "sant",
    q9: "sant",
    q10: "1912"
};

// Samlar in vad användaren har svarat på en fråga
// kollar om det är checkboxar (flera svar) eller radio-buttons (ett svar)
function getUserAnswer(questionKey) {
    const correct = correctAnswers[questionKey];
    
    if (Array.isArray(correct)) {
        return [...document.querySelectorAll(`input[name="${questionKey}"]:checked`)]
            .map(box => box.value);
    }
    
    const selected = document.querySelector(`input[name="${questionKey}"]:checked`);
    return selected ? selected.value : null;
}

// Jämför användarens svar med rätt svar
// Denna funktion hanterar både enskilda svar och flera svar
function isAnswerCorrect(userAnswer, correctAnswer) {
    if (Array.isArray(correctAnswer)) {
        return Array.isArray(userAnswer) && 
               userAnswer.length === correctAnswer.length &&
               userAnswer.every(ans => correctAnswer.includes(ans));
    }
    return userAnswer === correctAnswer;
}

// Går igenom alla frågor och räknar hur många som är rätt,
// sparar även en lista med vilka som var rätt eller fel
function calculateScore() {
    let score = 0;
    let details = [];

    for (let key in correctAnswers) {
        const userAnswer = getUserAnswer(key);
        const isRight = isAnswerCorrect(userAnswer, correctAnswers[key]);
        
        if (isRight) score++;
        details.push({ key, isRight });
    }

    return { score, details };
}

// Baserat på hur många procent användaren fick rätt,
// ger vi tillbaka en färg och ett uppmuntrande eller utmanande meddelande
function getResultStyle(percent) {
    if (percent >= 75) return { color: "green", message: "Riktigt bra jobbat!" };
    if (percent >= 50) return { color: "orange", message: "Bra!" };
    return { color: "red", message: "Underkänt" };
}

// Visar resultatet på sidan med poäng, ett meddelande och detaljer om varje fråga
function displayResult(score, details) {
    const percent = (score / 10) * 100;
    const { color, message } = getResultStyle(percent);
    
    const detailsHTML = details
        .map(({ key, isRight }) => `<p>${key}: ${isRight ? "✓ Rätt" : "✗ Fel"}</p>`)
        .join("");

    document.getElementById("result").innerHTML = `
        <div class="result-box">
            <h2 style="color:${color};">${score}/10 rätt - ${message}</h2>
            ${detailsHTML}
        </div>
    `;
}

// Växlar mellan ljus och mörk läge när användaren klickar på knappen
document.getElementById("modeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// När användaren skickar in quizet, räknar vi poängen och visar resultatet
document.getElementById("quizForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const { score, details } = calculateScore();
    displayResult(score, details);
});
