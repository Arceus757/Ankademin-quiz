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

//Mörkt läge toggle knappen
document.getElementById("modeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});


document.getElementById("quizForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let score = 0;
    let detailsHTML = "";
    const resultDiv = document.getElementById("result");

    // Kolla varje fråga
    for (let key in correctAnswers) {
        let userAnswer;
        let correct = correctAnswers[key];
        let isRight = false;

        // Om det är flera svar dvs checkboxar
        if (Array.isArray(correct)) {
            userAnswer = [...document.querySelectorAll(`input[name="${key}"]:checked`)]
                .map(box => box.value);

            //Jämför arrayerna
            if (userAnswer.length === correct.length) {
                isRight = userAnswer.every(ans => correct.includes(ans));
            }
        } 
        // Annars är det en enda svar (radio)
        else {
            let selected = document.querySelector(`input[name="${key}"]:checked`);
            if (selected) {
                isRight = selected.value === correct;
            }
        }

        if (isRight) score++;
        detailsHTML += `<p>${key}: ${isRight ? "✓ Rätt" : "✗ Fel"}</p>`;
    }

    let percent = (score / 10) * 100;
    let color = percent >= 75 ? "green" : percent >= 50 ? "orange" : "red";
    let message;
    
    if (percent >= 75) {
        message = "Riktigt bra jobbat!";
    } else if (percent >= 50) {
        message = "Bra!";
    } else {
        message = "Underkänt";
    }

    resultDiv.innerHTML = `
        <div class="result-box">
            <h2 style="color:${color};">${score}/10 rätt - ${message}</h2>
            ${detailsHTML}
        </div>
    `;
});
