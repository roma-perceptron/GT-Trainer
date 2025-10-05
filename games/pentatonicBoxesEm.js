// Pentatonic Boxes Em Game
class PentatonicBoxesEm {
    constructor() {
        this.gameActive = false;
        this.currentBox = null;
        
        // Em pentatonic notes
        this.pentatonicNotes = ['E', 'G', 'A', 'B', 'D'];
        this.tonicNote = 'E';
        this.blueNote = 'A#';
        this.showBlueNotes = false;
        
        // Box patterns (fret positions for each string, 0-based string index)
        this.boxes = {
            1: { // Box 1 - uses open strings
                0: [0, 3], // E string: open, 3rd fret
                1: [0, 3], // B string: open, 3rd fret  
                2: [0, 2], // G string: open, 2nd fret
                3: [0, 2], // D string: open, 2nd fret
                4: [0, 2], // A string: open, 2nd fret
                5: [0, 3]  // E string: open, 3rd fret
            },
            2: { // Box 2
                0: [3, 5],
                1: [3, 5],
                2: [2, 4],
                3: [2, 5],
                4: [2, 5],
                5: [3, 5]
            },
            3: { // Box 3
                0: [5, 7],
                1: [5, 8],
                2: [4, 7],
                3: [5, 7],
                4: [5, 7],
                5: [5, 7]
            },
            4: { // Box 4
                0: [7, 10],
                1: [8, 10],
                2: [7, 9],
                3: [7, 9],
                4: [7, 10],
                5: [7, 10]
            },
            5: { // Box 5
                0: [10, 12],
                1: [10, 12],
                2: [9, 12],
                3: [9, 12],
                4: [10, 12],
                5: [10, 12]
            }
        };
    }

    start() {
        this.gameActive = true;
        document.getElementById('game-area').classList.remove('hidden');
        this.setupBoxSelector();
        this.showAllPentatonicNotes();
    }

    stop() {
        this.gameActive = false;
        document.getElementById('game-area').classList.add('hidden');
        this.currentBox = null;
        this.clearHighlights();
    }

    setupBoxSelector() {
        const gameArea = document.getElementById('game-area');
        gameArea.innerHTML = `
            <div class="pentatonic-display">
                <div class="box-selector">
                    <button class="box-btn" onclick="pentatonicBoxesEm.selectBox(1)">Бокс 1</button>
                    <button class="box-btn" onclick="pentatonicBoxesEm.selectBox(2)">Бокс 2</button>
                    <button class="box-btn" onclick="pentatonicBoxesEm.selectBox(3)">Бокс 3</button>
                    <button class="box-btn" onclick="pentatonicBoxesEm.selectBox(4)">Бокс 4</button>
                    <button class="box-btn" onclick="pentatonicBoxesEm.selectBox(5)">Бокс 5</button>
                    <button class="blue-notes-btn" onclick="pentatonicBoxesEm.toggleBlueNotes()">Blue notes</button>
                </div>
            </div>
        `;
    }

    showAllPentatonicNotes() {
        this.clearHighlights();
        
        // Show all pentatonic notes on fretboard
        document.querySelectorAll('.fret-cell').forEach(cell => {
            const note = cell.dataset.note;
            if (this.pentatonicNotes.includes(note)) {
                cell.textContent = note;
                cell.classList.add('pentatonic-note');
                if (note === this.tonicNote) {
                    cell.classList.add('pentatonic-tonic');
                }
            } else if (note === this.blueNote) {
                if (this.showBlueNotes) {
                    cell.textContent = note;
                    cell.classList.add('pentatonic-blue-note');
                } else {
                    cell.textContent = '';
                }
            }
        });
        
        // Show open string pentatonic notes
        document.querySelectorAll('tbody .string-label').forEach((label, stringIndex) => {
            const openNote = label.dataset.openNote;
            if (this.pentatonicNotes.includes(openNote)) {
                label.textContent = openNote;
                label.classList.add('pentatonic-open-note');
                if (openNote === this.tonicNote) {
                    label.classList.add('pentatonic-open-tonic');
                }
            } else if (openNote === this.blueNote) {
                if (this.showBlueNotes) {
                    label.textContent = openNote;
                    label.classList.add('pentatonic-open-blue-note');
                } else {
                    label.textContent = '';
                }
            }
        });
    }

    selectBox(boxNumber) {
        this.currentBox = boxNumber;
        
        // Reset all box buttons
        document.querySelectorAll('.box-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Activate selected box button
        document.querySelectorAll('.box-btn')[boxNumber - 1].classList.add('active');
        
        // Highlight box notes
        this.highlightBox(boxNumber);
    }

    highlightBox(boxNumber) {
        const box = this.boxes[boxNumber];
        
        // Reset all pentatonic notes to normal state
        document.querySelectorAll('.fret-cell').forEach(cell => {
            if (cell.classList.contains('pentatonic-note') || cell.classList.contains('pentatonic-blue-note')) {
                cell.classList.remove('pentatonic-highlighted', 'pentatonic-dimmed');
                cell.classList.add('pentatonic-dimmed');
            }
        });
        
        document.querySelectorAll('tbody .string-label').forEach(label => {
            if (label.classList.contains('pentatonic-open-note') || label.classList.contains('pentatonic-open-blue-note')) {
                label.classList.remove('pentatonic-open-highlighted');
                label.classList.add('pentatonic-open-dimmed');
            }
        });
        
        // Highlight notes in selected box
        Object.keys(box).forEach(stringIndex => {
            const frets = box[stringIndex];
            frets.forEach(fret => {
                if (fret === 0) {
                    // Open string
                    const stringLabels = document.querySelectorAll('tbody .string-label');
                    const label = stringLabels[parseInt(stringIndex)];
                    if (label) {
                        label.classList.remove('pentatonic-open-dimmed');
                        label.classList.add('pentatonic-open-highlighted');
                    }
                } else {
                    // Fretted note
                    const cell = document.querySelector(`[data-string="${stringIndex}"][data-fret="${fret}"]`);
                    if (cell && (cell.classList.contains('pentatonic-note') || cell.classList.contains('pentatonic-blue-note'))) {
                        cell.classList.remove('pentatonic-dimmed');
                        cell.classList.add('pentatonic-highlighted');
                    }
                }
            });
        });
    }

    clearHighlights() {
        document.querySelectorAll('.fret-cell').forEach(cell => {
            cell.classList.remove('pentatonic-note', 'pentatonic-highlighted', 'pentatonic-dimmed', 'pentatonic-tonic', 'pentatonic-blue-note');
        });
        
        document.querySelectorAll('tbody .string-label').forEach(label => {
            label.classList.remove('pentatonic-open-note', 'pentatonic-open-highlighted', 'pentatonic-open-dimmed', 'pentatonic-open-tonic', 'pentatonic-open-blue-note');
        });
    }

    toggleBlueNotes() {
        this.showBlueNotes = !this.showBlueNotes;
        
        // Update button appearance
        const blueBtn = document.querySelector('.blue-notes-btn');
        if (this.showBlueNotes) {
            blueBtn.classList.add('active');
        } else {
            blueBtn.classList.remove('active');
        }
        
        // Refresh display
        this.showAllPentatonicNotes();
        
        // Re-highlight current box if any
        if (this.currentBox) {
            this.highlightBox(this.currentBox);
        }
    }

    handleClick(stringIndex, fret, note) {
        // No specific click handling needed for this game
        return false;
    }
}