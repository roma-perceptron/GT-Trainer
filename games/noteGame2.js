// Note Game 2: Find notes, show briefly, then hide (keep color only)
class NoteGame2 {
    constructor() {
        this.gameActive = false;
        this.currentTargetNote = '';
        this.discoveredCells = new Set();
        this.basicNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    }

    start() {
        this.gameActive = true;
        this.discoveredCells.clear();
        document.getElementById('game-area').classList.remove('hidden');
        this.generateNextNote();
    }

    stop() {
        this.gameActive = false;
        document.getElementById('game-area').classList.add('hidden');
        this.discoveredCells.clear();
    }

    generateNextNote() {
        if (!this.gameActive) return;
        
        const availableNotes = this.basicNotes.filter(note => {
            const noteCells = document.querySelectorAll(`[data-note="${note}"]`);
            for (let cell of noteCells) {
                const stringIndex = cell.dataset.string;
                const fret = cell.dataset.fret;
                const cellKey = `${stringIndex}-${fret}`;
                if (!this.discoveredCells.has(cellKey)) {
                    return true;
                }
            }
            return false;
        });
        
        if (availableNotes.length === 0) {
            document.getElementById('current-note').textContent = '';
            document.getElementById('game-message').textContent = 'Поздравляем - все ноты открыты!';
            this.gameActive = false;
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * availableNotes.length);
        this.currentTargetNote = availableNotes[randomIndex];
        document.getElementById('current-note').textContent = this.currentTargetNote;
        document.getElementById('game-message').textContent = '';
    }

    handleClick(stringIndex, fret, note) {
        if (!this.gameActive) return false;

        if (this.basicNotes.includes(note) && note === this.currentTargetNote) {
            const cell = document.querySelector(`[data-string="${stringIndex}"][data-fret="${fret}"]`);
            const cellKey = `${stringIndex}-${fret}`;
            
            if (!this.discoveredCells.has(cellKey)) {
                this.discoveredCells.add(cellKey);
                
                // Show note briefly
                cell.textContent = note;
                cell.classList.add('game-discovered-temp');
                
                cell.classList.add('correct-flash');
                setTimeout(() => cell.classList.remove('correct-flash'), 300);
                
                // Hide note after 1 second, keep color
                setTimeout(() => {
                    cell.textContent = '';
                    cell.classList.remove('game-discovered-temp');
                    cell.classList.add('game-discovered-hidden');
                }, 1000);
                
                this.checkGameComplete();
                if (this.gameActive) {
                    setTimeout(() => this.generateNextNote(), 1200);
                }
            }
            return true;
        } else {
            const cell = document.querySelector(`[data-string="${stringIndex}"][data-fret="${fret}"]`);
            cell.classList.add('wrong-flash');
            setTimeout(() => cell.classList.remove('wrong-flash'), 300);
            return true;
        }
    }

    checkGameComplete() {
        const availableNotes = this.basicNotes.filter(note => {
            const noteCells = document.querySelectorAll(`[data-note="${note}"]`);
            for (let cell of noteCells) {
                const stringIndex = cell.dataset.string;
                const fret = cell.dataset.fret;
                const cellKey = `${stringIndex}-${fret}`;
                if (!this.discoveredCells.has(cellKey)) {
                    return true;
                }
            }
            return false;
        });
        
        if (availableNotes.length === 0) {
            document.getElementById('current-note').textContent = '';
            document.getElementById('game-message').textContent = 'Поздравляем - все ноты открыты!';
            this.gameActive = false;
        }
    }
}