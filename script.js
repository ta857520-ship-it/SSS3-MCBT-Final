// =========================================
// SSS3 MCBT - CLEAN WORKING JAVASCRIPT
// Flow: Login -> Registration -> Subject -> Instructions
// -> 3-2-1 Countdown -> Questions -> Review -> Submit
// =========================================

"use strict";

// ---------- HTML ELEMENTS ----------
const startBtn = document.getElementById("startBtn");

const welcomeScreen = document.getElementById("welcomeScreen");
const registrationScreen = document.getElementById("registrationScreen");
const subjectScreen = document.getElementById("subjectScreen");
const instructionsScreen = document.getElementById("instructionsScreen");
const countdownScreen = document.getElementById("countdownScreen");
const examScreen = document.getElementById("examScreen");
const reviewScreen = document.getElementById("reviewScreen");
const resultProcessingScreen = document.getElementById("resultProcessingScreen");
const resultScreen = document.getElementById("resultScreen");
const leaderboardScreen = document.getElementById("leaderboardScreen");

const studentForm = document.getElementById("studentForm");
const departmentButtons = document.querySelectorAll(".department");
const selectedDepartment = document.getElementById("selectedDepartment");

const generalSubjectContainer = document.getElementById("generalSubjectContainer");
const facultySubjectContainer = document.getElementById("facultySubjectContainer");
const departmentTitle = document.getElementById("departmentTitle");
const facultySubjectTitle = document.getElementById("facultySubjectTitle");
const subjectContinue = document.getElementById("subjectContinue");

const readyBtn = document.getElementById("readyBtn");
const examSubject = document.getElementById("examSubject");
const liveSubject = document.getElementById("liveSubject");
const countdownNumber = document.getElementById("countdownNumber");

const timer = document.getElementById("timer");
const questionNumber = document.getElementById("questionNumber");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");
const questionNavigator = document.getElementById("questionNavigator");
const progressBar = document.getElementById("progressBar");
const reviewBtn = document.getElementById("reviewBtn");

const answeredCount = document.getElementById("answeredCount");
const unansweredCount = document.getElementById("unansweredCount");
const reviewQuestions = document.getElementById("reviewQuestions");
const backToExamBtn = document.getElementById("backToExamBtn");
const submitExamBtn = document.getElementById("submitExamBtn");

const processingIcon = document.getElementById("processingIcon");
const processingTitle = document.getElementById("processingTitle");
const processingMessage = document.getElementById("processingMessage");
const processingLoader = document.getElementById("processingLoader");

const resultStudentName = document.getElementById("resultStudentName");
const resultSubject = document.getElementById("resultSubject");
const resultAttempted = document.getElementById("resultAttempted");
const resultCorrect = document.getElementById("resultCorrect");
const resultWrong = document.getElementById("resultWrong");
const resultPercentage = document.getElementById("resultPercentage");
const resultScore = document.getElementById("resultScore");
const leaderboardBtn = document.getElementById("leaderboardBtn");
const leaderboardSubject = document.getElementById("leaderboardSubject");
const leaderboardList = document.getElementById("leaderboardList");
const leaderboardStatus = document.getElementById("leaderboardStatus");
const backToResultBtn = document.getElementById("backToResultBtn");

// ---------- SUPABASE ----------
const SUPABASE_URL = "https://auxobnrgtzlmtsfupyry.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_SzJiK2FiWKRbKFN7OZs2Pg_WlsSOGQM";
const supabaseClient = window.supabase
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
    : null;
let leaderboardChannel = null;
let latestResult = null;
let latestResultId = null;
let examStarted = false;

// ---------- SUBJECTS ----------
const generalSubjects = [
    { name: "Mathematics", icon: "📐" },
    { name: "English", icon: "📖" },
    { name: "Marketing", icon: "📢" },
    { name: "Economics", icon: "💰" },
    { name: "Coding", icon: "💻" },
    { name: "Diction", icon: "🗣️" },
    { name: "Canva", icon: "🎨" }
];

const facultySubjects = {
    SCIENCE: [
        { name: "Agric", icon: "🌱" },
        { name: "Biology", icon: "🧬" },
        { name: "Further Mathematics", icon: "📐" },
        { name: "Physics", icon: "⚡" },
        { name: "Chemistry", icon: "🧪" }
    ],
    ARTS: [
        { name: "Literature", icon: "📚" },
        { name: "Government", icon: "🏛️" },
        { name: "Yoruba", icon: "🗣️" },
        { name: "CRS", icon: "✝️" },
        { name: "Computer", icon: "💻" }
    ],
    COMMERCIAL: [
        { name: "Financial Accounting", icon: "💰" },
        { name: "Commerce", icon: "🛒" }
    ]
};

// ---------- STUDENT / EXAM STATE ----------
let student = {
    name: "",
    class: "",
    department: "",
    subject: ""
};

const TOTAL_QUESTIONS = 30;
const EXAM_TIME = 20 * 60;

let examQuestions = [];
let currentQuestionIndex = 0;
let remainingTime = EXAM_TIME;
let timerInterval = null;
let countdownInterval = null;
let examSubmitted = false;

// ---------- QUESTION BANK ----------
// ---------- QUESTION BANK LOADER ----------
// Large banks live in the Questions/ folder.
// Each exam randomly selects 30 questions from the selected subject's 500.
let questionBank = {};

const questionBankFiles = {
    "Mathematics": "Questions/Mathematics/mathematics_500_questions.json",
    "English": "Questions/English/english_500_questions.json",
    "Marketing": "Questions/Marketing/marketing_500_questions.json",
    "Economics": "Questions/Economics/economics_500_questions.json",
    "Coding": "Questions/Coding/coding_500_questions.json",
    "Diction": "Questions/Diction/diction_500_questions.json",
    "Canva": "Questions/Canva/canva_500_questions.json",
    "Agric": "Questions/Agric/agric_500_questions.json",
    "Biology": "Questions/Biology/biology_500_questions.json",
    "Further Mathematics": "Questions/Further Mathematics/further_mathematics_500_questions.json",
    "Physics": "Questions/Physics/physics_500_questions.json",
    "Chemistry": "Questions/Chemistry/chemistry_500_questions.json",
    "Literature": "Questions/Literature/literature_500_questions.json",
    "Government": "Questions/Government/government_500_questions.json",
    "Yoruba": "Questions/Yoruba/yoruba_500_questions.json",
    "CRS": "Questions/CRS/crs_500_questions.json",
    "Computer": "Questions/Computer/computer_500_questions.json",
    "Financial Accounting": "Questions/Financial Accounting/financial_accounting_500_questions.json",
    "Commerce": "Questions/Commerce/commerce_500_questions.json"
};

async function loadQuestionBank(subject) {
    if (questionBank[subject] && questionBank[subject].length >= TOTAL_QUESTIONS) {
        return questionBank[subject];
    }

    const file = questionBankFiles[subject];
    if (!file) {
        throw new Error(`No question-bank file is mapped for ${subject}.`);
    }

    const response = await fetch(file, { cache: "no-store" });
    if (!response.ok) {
        throw new Error(`Could not load ${subject} question bank (${response.status}).`);
    }

    const data = await response.json();
    if (!Array.isArray(data.questions) || data.questions.length < TOTAL_QUESTIONS) {
        throw new Error(`${subject} must contain at least ${TOTAL_QUESTIONS} questions.`);
    }

    // Convert {A,B,C,D} answers from the JSON into the array format
    // already used by the exam renderer.
    questionBank[subject] = data.questions.map((q) => {
        const optionLabels = ["A", "B", "C", "D"];
        const options = optionLabels.map((label) => q.options[label]);
        return {
            question: q.question,
            options,
            answer: optionLabels.indexOf(q.answer)
        };
    });

    return questionBank[subject];
}

// ---------- HELPERS ----------
function shuffle(array) {
    const copied = [...array];

    for (let i = copied.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [copied[i], copied[randomIndex]] = [copied[randomIndex], copied[i]];
    }

    return copied;
}

function showOnlyScreen(screenToShow) {
    document.querySelectorAll(".screen").forEach((screen) => {
        screen.classList.remove("active");
    });

    if (screenToShow) {
        screenToShow.classList.add("active");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---------- LOGIN ----------
startBtn.addEventListener("click", () => {
    showOnlyScreen(registrationScreen);
});

// ---------- FACULTY SELECTION ----------
departmentButtons.forEach((button) => {
    button.addEventListener("click", () => {
        departmentButtons.forEach((btn) => btn.classList.remove("selected"));
        button.classList.add("selected");
        selectedDepartment.value = button.dataset.department;
    });
});

// ---------- REGISTRATION ----------
studentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("studentName").value.trim();
    const studentClass = document.getElementById("studentClass").value;
    const department = selectedDepartment.value;

    if (!name) {
        alert("Please enter your full name.");
        return;
    }

    if (!studentClass) {
        alert("Please select your class.");
        return;
    }

    if (!department) {
        alert("Please select your faculty.");
        return;
    }

    student.name = name;
    student.class = studentClass;
    student.department = department;

    showSubjects(department);
});

// ---------- SUBJECTS ----------
function showSubjects(department) {
    departmentTitle.textContent = `${department} — Choose a subject to attempt`;
    facultySubjectTitle.textContent = `${department} SUBJECTS`;

    generalSubjectContainer.innerHTML = "";
    facultySubjectContainer.innerHTML = "";

    subjectContinue.disabled = true;
    student.subject = "";

    generalSubjects.forEach((subject) => {
        createSubjectCard(subject, generalSubjectContainer);
    });

    const subjectsForFaculty = facultySubjects[department] || [];

    subjectsForFaculty.forEach((subject) => {
        createSubjectCard(subject, facultySubjectContainer);
    });

    showOnlyScreen(subjectScreen);
}

function createSubjectCard(subject, container) {
    const card = document.createElement("div");
    card.classList.add("subject-card");

    card.innerHTML = `
        <div class="subject-icon">${subject.icon}</div>
        <div class="subject-name">${subject.name}</div>
    `;

    card.addEventListener("click", () => {
        document.querySelectorAll(".subject-card").forEach((item) => {
            item.classList.remove("selected");
        });

        card.classList.add("selected");
        student.subject = subject.name;
        subjectContinue.disabled = false;
    });

    container.appendChild(card);
}

subjectContinue.addEventListener("click", () => {
    if (!student.subject) {
        alert("Please select a subject first.");
        return;
    }

    examSubject.textContent = student.subject;
    showOnlyScreen(instructionsScreen);
});

// ---------- PREPARE EXAM ----------
async function prepareExamQuestions() {
    try {
        const bank = await loadQuestionBank(student.subject);

        if (!bank || bank.length < TOTAL_QUESTIONS) {
            throw new Error(
                `The ${student.subject} bank does not contain ${TOTAL_QUESTIONS} usable questions.`
            );
        }

        // Pick exactly 30 different questions from the 500-question bank.
        const selectedQuestions = shuffle([...bank]).slice(0, TOTAL_QUESTIONS);

        examQuestions = selectedQuestions.map((question) => {
            const optionsWithIndexes = question.options.map((text, index) => ({
                text,
                originalIndex: index
            }));

            const mixedOptions = shuffle(optionsWithIndexes);

            const correctAnswer = mixedOptions.findIndex(
                (option) => option.originalIndex === question.answer
            );

            return {
                question: question.question,
                options: mixedOptions,
                correctAnswer,
                selectedAnswer: null
            };
        });

        currentQuestionIndex = 0;
        return true;
    } catch (error) {
        console.error(error);
        alert(
            `Could not load the ${student.subject} question bank.\n\n` +
            `Please check that the question-bank files were uploaded to the GitHub repository.`
        );
        return false;
    }
}

// ---------- I'M READY -> COUNTDOWN ----------
readyBtn.addEventListener("click", async () => {
    if (examSubmitted) {
        examSubmitted = false;
    }

    readyBtn.disabled = true;
    const oldText = readyBtn.textContent;
    readyBtn.textContent = "Loading questions...";

    const ready = await prepareExamQuestions();

    readyBtn.disabled = false;
    readyBtn.textContent = oldText;

    if (!ready) {
        return;
    }

    clearInterval(timerInterval);
    clearInterval(countdownInterval);

    showOnlyScreen(countdownScreen);
    startCountdown();
});

function startCountdown() {
    let count = 3;

    countdownNumber.textContent = count;
    countdownNumber.style.animation = "none";
    void countdownNumber.offsetWidth;
    countdownNumber.style.animation = "countdownPop 0.8s ease";

    countdownInterval = setInterval(() => {
        count--;

        if (count > 0) {
            countdownNumber.textContent = count;
            countdownNumber.style.animation = "none";
            void countdownNumber.offsetWidth;
            countdownNumber.style.animation = "countdownPop 0.8s ease";
            return;
        }

        clearInterval(countdownInterval);
        countdownInterval = null;

        countdownNumber.textContent = "GO! 🚀";
        countdownNumber.style.animation = "none";
        void countdownNumber.offsetWidth;
        countdownNumber.style.animation = "countdownPop 0.8s ease";

        setTimeout(() => {
            startExam();
        }, 800);
    }, 1000);
}

// ---------- START EXAM ----------
function startExam() {
    clearInterval(timerInterval);

    examSubmitted = false;
    examStarted = true;
    remainingTime = EXAM_TIME;
    currentQuestionIndex = 0;

    liveSubject.textContent = student.subject;

    showOnlyScreen(examScreen);

    renderQuestionNavigator();
    renderQuestion();
    updateTimer();

    timerInterval = setInterval(() => {
        remainingTime--;
        updateTimer();

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            autoSubmitExam();
        }
    }, 1000);
}

// ---------- RENDER QUESTION ----------
function renderQuestion() {
    const question = examQuestions[currentQuestionIndex];

    if (!question) {
        return;
    }

    questionNumber.textContent =
        `Question ${currentQuestionIndex + 1} of ${TOTAL_QUESTIONS}`;

    questionText.textContent = question.question;
    optionsContainer.innerHTML = "";

    question.options.forEach((option, index) => {
        const optionElement = document.createElement("div");
        optionElement.classList.add("option");

        if (question.selectedAnswer === index) {
            optionElement.classList.add("selected");
        }

        optionElement.innerHTML = `
            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
            <span>${option.text}</span>
        `;

        optionElement.addEventListener("click", () => {
            selectAnswer(index);
        });

        optionsContainer.appendChild(optionElement);
    });

    previousBtn.disabled = currentQuestionIndex === 0;

    if (currentQuestionIndex === TOTAL_QUESTIONS - 1) {
        nextBtn.textContent = "FINISH →";
    } else {
        nextBtn.textContent = "Next →";
    }

    const progress = ((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100;
    progressBar.style.width = `${progress}%`;

    updateQuestionNavigator();
}

function selectAnswer(answerIndex) {
    if (examSubmitted) {
        return;
    }

    examQuestions[currentQuestionIndex].selectedAnswer = answerIndex;
    renderQuestion();
}

// ---------- NEXT / PREVIOUS ----------
nextBtn.addEventListener("click", () => {
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
        currentQuestionIndex++;
        renderQuestion();
    } else {
        openReview();
    }
});

previousBtn.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
});

// ---------- QUESTION NAVIGATOR ----------
function renderQuestionNavigator() {
    questionNavigator.innerHTML = "";

    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
        const button = document.createElement("button");
        button.type = "button";
        button.classList.add("question-number");
        button.textContent = i + 1;

        button.addEventListener("click", () => {
            currentQuestionIndex = i;
            renderQuestion();
        });

        questionNavigator.appendChild(button);
    }

    updateQuestionNavigator();
}

function updateQuestionNavigator() {
    const buttons = document.querySelectorAll(".question-number");

    buttons.forEach((button, index) => {
        button.classList.remove("current", "answered");

        if (index === currentQuestionIndex) {
            button.classList.add("current");
        }

        if (
            examQuestions[index] &&
            examQuestions[index].selectedAnswer !== null
        ) {
            button.classList.add("answered");
        }
    });
}

// ---------- TIMER ----------
function updateTimer() {
    const safeTime = Math.max(0, remainingTime);
    const minutes = Math.floor(safeTime / 60);
    const seconds = safeTime % 60;

    timer.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    if (safeTime <= 120) {
        timer.style.background = "rgba(255, 80, 80, 0.35)";
    } else {
        timer.style.background = "rgba(255, 255, 255, 0.12)";
    }
}

// ---------- REVIEW ----------
reviewBtn.addEventListener("click", () => {
    openReview();
});

function openReview() {
    if (examSubmitted) {
        return;
    }

    clearInterval(timerInterval);
    timerInterval = null;

    renderReview();
    showOnlyScreen(reviewScreen);

    // Keep the exam timer running while the student reviews.
    timerInterval = setInterval(() => {
        remainingTime--;
        updateTimer();

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            autoSubmitExam();
        }
    }, 1000);
}

function renderReview() {
    let answered = 0;

    examQuestions.forEach((question) => {
        if (question.selectedAnswer !== null) {
            answered++;
        }
    });

    answeredCount.textContent = answered;
    unansweredCount.textContent = TOTAL_QUESTIONS - answered;
    reviewQuestions.innerHTML = "";

    examQuestions.forEach((question, index) => {
        const item = document.createElement("div");
        item.classList.add(
            "review-item",
            question.selectedAnswer === null ? "unanswered" : "answered"
        );

        const status =
            question.selectedAnswer === null ? "Not answered" : "Answered";

        item.innerHTML = `
            <div>
                <strong>Question ${index + 1}</strong>
                <br>
                <small>${status}</small>
            </div>
            <button type="button" class="review-jump">REVIEW</button>
        `;

        item.querySelector(".review-jump").addEventListener("click", () => {
            currentQuestionIndex = index;
            showOnlyScreen(examScreen);
            renderQuestion();
        });

        reviewQuestions.appendChild(item);
    });
}

backToExamBtn.addEventListener("click", () => {
    showOnlyScreen(examScreen);
    renderQuestion();
});

// ---------- SUBMIT ----------
submitExamBtn.addEventListener("click", () => {
    const unanswered = examQuestions.filter(
        (question) => question.selectedAnswer === null
    ).length;

    if (unanswered > 0) {
        const proceed = confirm(
            `You have ${unanswered} unanswered question(s). Submit anyway?`
        );

        if (!proceed) {
            return;
        }
    }

    submitExam();
});

function autoSubmitExam() {
    if (examSubmitted) {
        return;
    }

    // Submit silently so the student sees the normal result-processing flow.
    submitExam();
}

async function submitExam() {
    if (examSubmitted) {
        return;
    }

    examSubmitted = true;

    clearInterval(timerInterval);
    timerInterval = null;
    clearInterval(countdownInterval);
    countdownInterval = null;

    let correct = 0;
    let attempted = 0;

    examQuestions.forEach((question) => {
        if (question.selectedAnswer !== null) {
            attempted++;
        }

        if (question.selectedAnswer === question.correctAnswer) {
            correct++;
        }
    });

    const wrong = TOTAL_QUESTIONS - correct;
    const percentage = (correct / TOTAL_QUESTIONS) * 100;

    // Stage 1: completion animation.
    showOnlyScreen(resultProcessingScreen);
    processingIcon.textContent = "✓";
    processingIcon.classList.remove("checking");
    processingTitle.textContent = "ALL DONE!";
    processingMessage.textContent = "You have completed all 30 questions.";
    processingLoader.classList.add("hidden");

    await wait(1300);

    // Stage 2: checking/collating animation.
    processingIcon.textContent = "↻";
    processingIcon.classList.add("checking");
    processingTitle.textContent = "Checking and collating result...";
    processingMessage.textContent = "Please wait while your answers are being marked.";
    processingLoader.classList.remove("hidden");

    await wait(2200);

    // Save first, then show the result screen. This guarantees the
    // leaderboard can see the score when the student opens it.
    await saveResultToSupabase({ attempted, correct, wrong, percentage });
    showResult({ attempted, correct, wrong, percentage });
}

function wait(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function showResult({ attempted, correct, wrong, percentage }) {
    resultStudentName.textContent = student.name || "Student";
    resultSubject.textContent = student.subject || "Subject";
    resultAttempted.textContent = attempted;
    resultCorrect.textContent = correct;
    resultWrong.textContent = wrong;
    resultPercentage.textContent = `${percentage.toFixed(2)}%`;
    resultScore.textContent = `${correct} / ${TOTAL_QUESTIONS}`;

    latestResult = { attempted, correct, wrong, percentage };
    showOnlyScreen(resultScreen);

    console.log({
        student,
        attempted,
        correct,
        wrong,
        percentage
    });
}

leaderboardBtn.addEventListener("click", async () => {
    await openLeaderboard();
});

backToResultBtn.addEventListener("click", () => {
    if (leaderboardChannel) {
        supabaseClient.removeChannel(leaderboardChannel);
        leaderboardChannel = null;
    }
    showOnlyScreen(resultScreen);
});

async function saveResultToSupabase({ attempted, correct, wrong, percentage }) {
    if (!supabaseClient) {
        console.warn("Supabase client did not load.");
        return;
    }

    const resultRow = {
        student_name: student.name || "Student",
        subject: student.subject || "Subject",
        questions_attempted: attempted,
        correct,
        wrong,
        percentage: Number(percentage.toFixed(2)),
        score: correct
    };

    const { data, error } = await supabaseClient
        .from("results")
        .insert(resultRow)
        .select("id")
        .single();

    if (error) {
        console.error("Could not save result:", error);
        latestResultId = null;
        return;
    }

    latestResultId = data?.id ?? null;
    console.log("Result saved to the online leaderboard.");
}

async function openLeaderboard() {
    showOnlyScreen(leaderboardScreen);
    leaderboardSubject.textContent = student.subject || "Subject";
    leaderboardStatus.textContent = "Loading...";
    leaderboardList.innerHTML = '<div class="leaderboard-empty">Loading leaderboard...</div>';

    if (!supabaseClient) {
        leaderboardStatus.textContent = "Database unavailable";
        leaderboardList.innerHTML = '<div class="leaderboard-empty">Could not connect to the leaderboard.</div>';
        return;
    }

    await loadLeaderboard();
    subscribeToLeaderboard();
}

async function loadLeaderboard() {
    const { data, error } = await supabaseClient
        .from("results")
        .select("id, student_name, subject, score, percentage, questions_attempted, created_at")
        .eq("subject", student.subject || "Subject")
        .order("score", { ascending: false })
        .order("created_at", { ascending: true })
        .limit(100);

    if (error) {
        console.error("Could not load leaderboard:", error);
        leaderboardStatus.textContent = "Connection error";
        leaderboardList.innerHTML = '<div class="leaderboard-empty">Could not load the leaderboard.</div>';
        return;
    }

    renderLeaderboard(data || []);
    leaderboardStatus.textContent = "● LIVE";
}

function renderLeaderboard(rows) {
    if (!rows.length) {
        leaderboardList.innerHTML = '<div class="leaderboard-empty">No scores yet. Be the first!</div>';
        return;
    }

    leaderboardList.innerHTML = rows.map((row, index) => {
        const position = index + 1;
        const medal = position === 1 ? "🥇" : position === 2 ? "🥈" : position === 3 ? "🥉" : position;
        const current = latestResultId !== null && String(row.id) === String(latestResultId);
        return `
            <div class="leaderboard-row ${current ? "current-student" : ""}">
                <div class="leaderboard-position">${medal}</div>
                <div class="leaderboard-name">${escapeHtml(row.student_name)}${current ? " <span class=\"you-badge\">YOU</span>" : ""}</div>
                <div class="leaderboard-score">${row.score}/30</div>
                <div class="leaderboard-percent">${Number(row.percentage).toFixed(2)}%</div>
            </div>
        `;
    }).join("");
}

function subscribeToLeaderboard() {
    if (leaderboardChannel) {
        supabaseClient.removeChannel(leaderboardChannel);
    }

    leaderboardChannel = supabaseClient
        .channel(`leaderboard-${student.subject || "subject"}`)
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "results" },
            (payload) => {
                if (payload.eventType === "INSERT" && payload.new?.subject === student.subject) {
                    loadLeaderboard();
                } else if (payload.eventType !== "INSERT") {
                    loadLeaderboard();
                }
            }
        )
        .subscribe((status) => {
            if (status === "SUBSCRIBED") {
                leaderboardStatus.textContent = "● LIVE";
            }
        });
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// ---------- EXAM EXIT PROTECTION ----------
// Warn before accidentally closing/reloading the page during an active exam.
window.addEventListener("beforeunload", (event) => {
    if (examStarted && !examSubmitted && examQuestions.length) {
        event.preventDefault();
        event.returnValue = "Your exam is still in progress.";
    }
});

// ---------- SAFETY CHECK ----------
if (
    !startBtn ||
    !studentForm ||
    !subjectContinue ||
    !readyBtn ||
    !examScreen ||
    !reviewScreen ||
    !resultProcessingScreen ||
    !resultScreen ||
    !leaderboardScreen
) {
    console.error("SSS3 MCBT: One or more required HTML elements are missing.");
}
