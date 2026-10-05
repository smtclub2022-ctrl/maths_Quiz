// app.js – Simple Quiz Engine using Tailwind CSS
// Loads questions from questions.json and renders an interactive quiz.

// Utility to create an element with Tailwind classes and optional text/content
function el(tag, classes = '', content = null) {
  const element = document.createElement(tag);
  if (classes) element.className = classes;
  if (content !== null) {
    if (typeof content === 'string') {
      element.textContent = content;
    } else {
      element.appendChild(content);
    }
  }
  return element;
}

// Global state
let questions = [];
let currentIdx = 0;
let score = 0;

async function loadQuestions() {
  try {
    const res = await fetch('questions.json');
    if (!res.ok) throw new Error('Failed to load questions');
    const data = await res.json();
    // Ensure answer indices are numbers
    questions = data.map(q => ({
      question: q.question,
      options: q.options,
      answer: Number(q.answer), // 0‑based index of correct option
    }));
    renderCurrent();
  } catch (e) {
    console.error(e);
    const app = document.getElementById('app');
    app.innerHTML = `<p class="text-red-600">❌ क्विज़ लोड करने में त्रुटि: ${e.message}</p>`;
  }
}

function renderCurrent() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  if (currentIdx >= questions.length) {
    // Quiz finished – show results
    const resultDiv = el('div', 'text-center');
    resultDiv.appendChild(el('h2', 'text-2xl font-bold mb-4', 'परिणाम'));
    resultDiv.appendChild(
      el('p', 'text-lg', `आपने ${score} में से ${questions.length} सही उत्तर दिया।`)
    );
    const restartBtn = el('button', 'mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700', 'पुनः आरंभ');
    restartBtn.addEventListener('click', () => {
      currentIdx = 0;
      score = 0;
      renderCurrent();
    });
    resultDiv.appendChild(restartBtn);
    app.appendChild(resultDiv);
    return;
  }

  const q = questions[currentIdx];

  // Create container for quiz question with progress and score UI
  const container = el('div', 'max-w-xl mx-auto bg-white p-6 rounded shadow');
  // Progress bar container
  const progressContainer = el('div', 'mb-4');
  const progressBar = el('div', 'w-full bg-gray-200 rounded h-2');
  const progressFill = el('div', 'bg-indigo-600 h-2 rounded', null);
  progressFill.style.width = `${Math.round((currentIdx / questions.length) * 100)}%`;
  progressBar.appendChild(progressFill);
  progressContainer.appendChild(progressBar);
  // Score display
  const scoreDisplay = el('div', 'text-sm text-gray-600 mt-1', `स्कोर: ${score} / ${questions.length}`);
  progressContainer.appendChild(scoreDisplay);
  container.appendChild(progressContainer);
  // Question header and text
  container.appendChild(el('h2', 'text-xl font-semibold mb-4', `प्रश्न ${currentIdx + 1}/${questions.length}`));
  container.appendChild(el('p', 'mb-4', q.question));

  const form = el('form', 'space-y-2');
  q.options.forEach((opt, idx) => {
    const id = `option-${currentIdx}-${idx}`;
    const label = el('label', 'flex items-center space-x-2 cursor-pointer');
    const radio = el('input', 'form-radio h-4 w-4 text-indigo-600', null);
    radio.type = 'radio';
    radio.name = 'option';
    radio.value = idx;
    radio.id = id;
    label.appendChild(radio);
    label.appendChild(el('span', '', opt));
    form.appendChild(label);
  });

  const nextBtn = el('button', 'mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700', 'अगला');
  nextBtn.type = 'button';
  nextBtn.disabled = true;
  form.appendChild(nextBtn);

  // Enable button when an option is selected
  form.addEventListener('change', () => {
    nextBtn.disabled = false;
  });

  // Handle answer evaluation
  nextBtn.addEventListener('click', () => {
    const selected = form.elements['option'];
    const chosenIdx = Number(selected.value);
    if (chosenIdx === q.answer) {
      score++;
    }
    currentIdx++;
    renderCurrent();
  });

  container.appendChild(form);
  app.appendChild(container);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadQuestions);
} else {
  loadQuestions();
}
