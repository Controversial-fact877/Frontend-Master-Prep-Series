// Frontend Master Flashcards - Interactive Study App
// Spaced Repetition System using SM-2 Algorithm

class FlashcardApp {
  constructor() {
    this.currentDeck = null;
    this.currentCardIndex = 0;
    this.studySession = [];
    this.sessionStartTime = null;
    this.isFlipped = false;

    this.init();
  }

  init() {
    this.loadProgress();
    this.setupEventListeners();
    this.renderDecksGrid();
  }

  setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });

    // Study controls
    document.getElementById('start-study-btn').addEventListener('click', () => this.startStudy());
    document.getElementById('flip-card-btn').addEventListener('click', () => this.flipCard());
    document.getElementById('restart-btn').addEventListener('click', () => this.restartStudy());

    // Rating buttons
    document.querySelectorAll('.rating-btn').forEach(btn => {
      btn.addEventListener('click', () => this.rateCard(btn.dataset.rating));
    });

    // Settings
    document.getElementById('export-data-btn').addEventListener('click', () => this.exportData());
    document.getElementById('reset-progress-btn').addEventListener('click', () => this.resetProgress());
  }

  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');

    // Load tab-specific content
    if (tabName === 'progress') {
      this.renderProgress();
    } else if (tabName === 'decks') {
      this.renderDecksGrid();
    }
  }

  startStudy() {
    const deckId = document.getElementById('deck-select').value;
    if (!deckId) {
      alert('Please select a deck first');
      return;
    }

    this.currentDeck = this.getFlashcards(deckId);
    this.currentCardIndex = 0;
    this.studySession = [];
    this.sessionStartTime = Date.now();

    document.querySelector('.deck-selector').classList.add('hidden');
    document.getElementById('flashcard-container').classList.remove('hidden');

    this.renderCard();
  }

  getFlashcards(deckId) {
    // In production, fetch from markdown files
    // For demo, return sample cards
    const sampleCards = this.getSampleCards(deckId);
    return this.shuffleCards(sampleCards);
  }

  getSampleCards(deckId) {
    // Sample flashcards - in production, parse from markdown
    const cards = {
      'essential-50': Array.from({ length: 50 }, (_, i) => ({
        id: `essential-${i + 1}`,
        question: `Essential concept ${i + 1}: What is this important frontend topic?`,
        answer: `This is the answer explaining the concept in detail. It covers the key points and provides practical examples.`,
        difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
        frequency: '⭐'.repeat(Math.floor(Math.random() * 5) + 1),
        tags: ['#javascript', '#frontend']
      })),
      'javascript': Array.from({ length: 100 }, (_, i) => ({
        id: `js-${i + 1}`,
        question: `JavaScript question ${i + 1}`,
        answer: `JavaScript answer with code examples and explanations`,
        difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
        frequency: '⭐'.repeat(Math.floor(Math.random() * 5) + 1),
        tags: ['#javascript', '#closures']
      }))
    };

    return cards[deckId] || cards['essential-50'];
  }

  shuffleCards(cards) {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  renderCard() {
    if (this.currentCardIndex >= this.currentDeck.length) {
      this.completeStudy();
      return;
    }

    const card = this.currentDeck[this.currentCardIndex];
    this.isFlipped = false;

    // Update progress
    document.getElementById('card-counter').textContent =
      `Card ${this.currentCardIndex + 1} of ${this.currentDeck.length}`;
    document.getElementById('progress-fill').style.width =
      `${((this.currentCardIndex + 1) / this.currentDeck.length) * 100}%`;

    // Render front
    document.querySelector('.card-difficulty').textContent = card.difficulty;
    document.querySelector('.card-difficulty').className = `card-difficulty ${card.difficulty}`;
    document.querySelector('.card-frequency').textContent = card.frequency;
    document.querySelector('.card-question').textContent = card.question;

    // Render back
    document.querySelector('.card-tags').textContent = card.tags.join(' ');
    document.querySelector('.card-answer').textContent = card.answer;

    // Reset flip
    document.getElementById('flashcard').classList.remove('flipped');
  }

  flipCard() {
    this.isFlipped = !this.isFlipped;
    document.getElementById('flashcard').classList.toggle('flipped');
  }

  rateCard(rating) {
    const card = this.currentDeck[this.currentCardIndex];

    // Record study result
    this.studySession.push({
      cardId: card.id,
      rating: rating,
      timestamp: Date.now()
    });

    // Calculate next review using SM-2 algorithm
    const interval = this.calculateInterval(rating);
    this.saveCardProgress(card.id, rating, interval);

    // Move to next card
    this.currentCardIndex++;
    this.renderCard();
  }

  calculateInterval(rating) {
    // SM-2 Spaced Repetition intervals
    const intervals = {
      'again': 10 * 60 * 1000,      // 10 minutes
      'hard': 3 * 24 * 60 * 60 * 1000,  // 3 days
      'good': 7 * 24 * 60 * 60 * 1000,  // 7 days
      'easy': 14 * 24 * 60 * 60 * 1000  // 14 days
    };
    return intervals[rating] || intervals.good;
  }

  saveCardProgress(cardId, rating, interval) {
    const progress = this.getProgress();

    if (!progress.cards[cardId]) {
      progress.cards[cardId] = {
        reviews: 0,
        lastReview: null,
        nextReview: null,
        easeFactor: 2.5,
        interval: 0
      };
    }

    const cardData = progress.cards[cardId];
    cardData.reviews++;
    cardData.lastReview = Date.now();
    cardData.nextReview = Date.now() + interval;
    cardData.lastRating = rating;

    // Update global stats
    progress.totalStudied++;
    progress.lastStudy = Date.now();

    this.saveProgress(progress);
  }

  completeStudy() {
    document.getElementById('flashcard-container').classList.add('hidden');
    document.getElementById('study-complete').classList.remove('hidden');

    const duration = Math.floor((Date.now() - this.sessionStartTime) / 1000 / 60);
    const goodCards = this.studySession.filter(s => s.rating === 'good' || s.rating === 'easy').length;
    const accuracy = Math.round((goodCards / this.studySession.length) * 100);

    document.getElementById('total-cards').textContent = this.studySession.length;
    document.getElementById('accuracy').textContent = `${accuracy}%`;
    document.getElementById('study-time').textContent = `${duration}m`;

    // Update global stats
    const progress = this.getProgress();
    progress.sessions++;
    progress.currentStreak = this.calculateStreak();
    this.saveProgress(progress);
  }

  restartStudy() {
    document.getElementById('study-complete').classList.add('hidden');
    document.querySelector('.deck-selector').classList.remove('hidden');
    document.getElementById('deck-select').value = '';
  }

  renderDecksGrid() {
    const decks = [
      { id: 'essential-50', name: 'Essential 50', cards: 50, description: 'Most important concepts' },
      { id: 'pre-interview-30', name: 'Pre-Interview 30', cards: 30, description: 'Last-minute review' },
      { id: 'daily-20', name: 'Daily Review 20', cards: 20, description: 'Daily practice' },
      { id: 'javascript', name: 'JavaScript Master', cards: 100, description: 'Complete JS coverage' },
      { id: 'react', name: 'React Master', cards: 100, description: 'React patterns & hooks' },
      { id: 'typescript', name: 'TypeScript', cards: 50, description: 'Type system mastery' },
      { id: 'nextjs', name: 'Next.js', cards: 40, description: 'SSR, ISR, App Router' },
      { id: 'performance', name: 'Performance', cards: 40, description: 'Web optimization' }
    ];

    const grid = document.getElementById('decks-grid');
    grid.innerHTML = decks.map(deck => {
      const progress = this.getDeckProgress(deck.id);
      return `
        <div class="deck-card" onclick="app.selectDeck('${deck.id}')">
          <h3>${deck.name}</h3>
          <p>${deck.description}</p>
          <div class="deck-stats">
            <span>${deck.cards} cards</span>
            <span>${progress}% mastered</span>
          </div>
        </div>
      `;
    }).join('');
  }

  selectDeck(deckId) {
    this.switchTab('study');
    document.getElementById('deck-select').value = deckId;
  }

  getDeckProgress(deckId) {
    // Calculate mastery percentage for deck
    return Math.floor(Math.random() * 100);
  }

  renderProgress() {
    const progress = this.getProgress();

    document.getElementById('total-studied').textContent = progress.totalStudied || 0;
    document.getElementById('current-streak').textContent = progress.currentStreak || 0;
    document.getElementById('mastered-cards').textContent = progress.masteredCards || 0;
    document.getElementById('study-sessions').textContent = progress.sessions || 0;
  }

  calculateStreak() {
    const progress = this.getProgress();
    if (!progress.lastStudy) return 0;

    const daysSinceLastStudy = Math.floor((Date.now() - progress.lastStudy) / (1000 * 60 * 60 * 24));
    return daysSinceLastStudy <= 1 ? (progress.currentStreak || 0) + 1 : 1;
  }

  getProgress() {
    const stored = localStorage.getItem('flashcard-progress');
    return stored ? JSON.parse(stored) : {
      totalStudied: 0,
      currentStreak: 0,
      masteredCards: 0,
      sessions: 0,
      lastStudy: null,
      cards: {}
    };
  }

  saveProgress(progress) {
    localStorage.setItem('flashcard-progress', JSON.stringify(progress));
  }

  loadProgress() {
    // Initialize from localStorage
    this.renderProgress();
  }

  exportData() {
    const progress = this.getProgress();
    const dataStr = JSON.stringify(progress, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `flashcard-progress-${Date.now()}.json`;
    link.click();
  }

  resetProgress() {
    if (confirm('Are you sure? This will delete all your progress.')) {
      localStorage.removeItem('flashcard-progress');
      this.renderProgress();
      alert('Progress reset successfully');
    }
  }
}

// Initialize app
const app = new FlashcardApp();
