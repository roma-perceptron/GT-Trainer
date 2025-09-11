// Interval Game 1: Find intervals from given note
class IntervalGame1 {
    constructor() {
        this.gameActive = false;
        this.currentNote = '';
        this.currentInterval = '';
        this.targetNote = '';
        this.discoveredCells = new Set();
        this.basicNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        this.intervals = {
            'Прима': 0,
            'Секунда': 2,
            'Терция': 4,
            'Кварта': 5, 
            'Квинта': 7,
            'Секста': 9,
            'Септима': 11,
            'Октава': 12
        };
        this.allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    }

    start() {
        this.gameActive = true;
        this.discoveredCells.clear();
        document.getElementById('game-area').classList.remove('hidden');
        this.generateNextQuestion();
    }

    stop() {
        this.gameActive = false;
        document.getElementById('game-area').classList.add('hidden');
        this.discoveredCells.clear();
        this.clearHighlights();
    }

    clearHighlights() {
        document.querySelectorAll('.fret-cell').forEach(cell => {
            cell.classList.remove('interval-root', 'interval-target');
        });
    }

    generateNextQuestion() {
        if (!this.gameActive) return;

        this.clearHighlights();

        const noteIndex = Math.floor(Math.random() * this.basicNotes.length);
        this.currentNote = this.basicNotes[noteIndex];
        
        const intervalNames = Object.keys(this.intervals);
        const intervalIndex = Math.floor(Math.random() * intervalNames.length);
        this.currentInterval = intervalNames[intervalIndex];
        
        const rootNoteIndex = this.allNotes.indexOf(this.currentNote);
        const targetNoteIndex = (rootNoteIndex + this.intervals[this.currentInterval]) % 12;
        this.targetNote = this.allNotes[targetNoteIndex];

        // Show only one random instance of the root note
        const rootNoteCells = Array.from(document.querySelectorAll(`[data-note="${this.currentNote}"]`));
        if (rootNoteCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * rootNoteCells.length);
            const selectedCell = rootNoteCells[randomIndex];
            selectedCell.classList.add('interval-root');
            selectedCell.textContent = this.currentNote;
        }

        document.getElementById('current-note').textContent = `${this.currentNote} + ${this.currentInterval}`;
        document.getElementById('game-message').textContent = '';
    }

    handleClick(stringIndex, fret, note) {
        if (!this.gameActive) return false;

        if (note === this.targetNote) {
            const cell = document.querySelector(`[data-string="${stringIndex}"][data-fret="${fret}"]`);
            
            cell.textContent = note;
            cell.classList.add('interval-target');
            
            cell.classList.add('correct-flash');
            setTimeout(() => {
                cell.classList.remove('correct-flash');
                this.generateNextQuestion();
            }, 800);
            
            return true;
        } else {
            const cell = document.querySelector(`[data-string="${stringIndex}][data-fret="${fret}"]`);
            cell.classList.add('wrong-flash');
            setTimeout(() => cell.classList.remove('wrong-flash'), 300);
            return true;
        }
    }
}