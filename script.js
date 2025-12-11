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

const questionTexts = {
    q1: "Coca-Cola uppfanns 1886.",
    q2: "Pepsi skapades före Coca-Cola.",
    q3: "Vilket år lanserades Nutella?",
    q4: "Vilken ingrediens är huvudsaklig i Oreo-kex?",
    q5: "Vilka ingredienser finns i Coca-Cola? (2 rätt)",
    q6: "Vilka produkter skapades före 1900-talet? (2 rätt)",
    q7: "Red Bull uppfanns i Österrike.",
    q8: "Toblerone består av choklad, nougat och honung.",
    q9: "M&M's lanserades under andra världskriget.",
    q10: "Vilket år blev Oreo-kex populärt i USA?"
};

let currentQuestion = 1;
const totalQuestions = 10;

// Visar den aktuella frågan och döljer andra
function showQuestion(questionNumber) {
    const questions = document.querySelectorAll('.question');
    questions.forEach(q => q.classList.remove('active'));
    
    const currentQ = document.querySelector(`.question[data-question="${questionNumber}"]`);
    if (currentQ) {
        currentQ.classList.add('active');
    }
    
    // Uppdatera frågenumret
    document.getElementById('questionCounter').textContent = `Question ${questionNumber} of 10`;
    
    // Uppdatera knapparnas synlighet
    document.getElementById('prevBtn').style.display = questionNumber === 1 ? 'none' : 'inline-block';
    document.getElementById('nextBtn').style.display = questionNumber === totalQuestions ? 'none' : 'inline-block';
    document.getElementById('submitBtn').style.display = questionNumber === totalQuestions ? 'inline-block' : 'none';
}

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
        const isUnanswered = userAnswer === null || (Array.isArray(userAnswer) && userAnswer.length === 0);
        
        if (isRight) score++;
        details.push({ key, isRight, isUnanswered });
    }

    return { score, details };
    
}

// Baserat på hur många procent användaren fick rätt ges det tillbaka en färg och ett meddelande
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
        .map(({ key, isRight, isUnanswered }) => {
            const questionNum = key.replace('q', 'Question ');
            let result;
            if (isUnanswered) {
                result = "<strong>? Obesvarad</strong>";
            } else {
                result = isRight ? "<strong>✓ Rätt</strong>" : "<strong>✗ Fel</strong>";
            }
            return `<p><strong>${questionNum}:</strong> ${questionTexts[key]} - ${result}</p>`;
        })
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

// Navigation knappar
document.getElementById("nextBtn").addEventListener("click", () => {
    if (currentQuestion < totalQuestions) {
        currentQuestion++;
        showQuestion(currentQuestion);
    }
});

document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentQuestion > 1) {
        currentQuestion--;
        showQuestion(currentQuestion);
    }
});

// När användaren skickar in quizet, räknar vi poängen och visar resultatet
document.getElementById("quizForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const { score, details } = calculateScore();
    displayResult(score, details);
});

// Visa första frågan vid start
showQuestion(currentQuestion);
