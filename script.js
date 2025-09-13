// Guitar strings (from high E to low E)
const STRINGS = ['E', 'B', 'G', 'D', 'A', 'E'];
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Notes dictionary for each string and fret
const FRETBOARD_NOTES = {};

// Initialize notes dictionary
function initializeNotesDict() {
    const stringRootNotes = [4, 11, 7, 2, 9, 4]; // E, B, G, D, A, E in semitones from C
    
    STRINGS.forEach((string, stringIndex) => {
        FRETBOARD_NOTES[stringIndex] = {};
        for (let fret = 1; fret <= 12; fret++) {
            const noteIndex = (stringRootNotes[stringIndex] + fret) % 12;
            FRETBOARD_NOTES[stringIndex][fret] = NOTES[noteIndex];
        }
    });
}

// Calculate fret width using exponential decay formula (starting from fret 1)
function calculateFretWidth(fretNumber, baseWidth = 100) {
    return baseWidth * Math.pow(0.94387, fretNumber - 1);
}

// Generate fretboard
function generateFretboard() {
    const fretboardBody = document.getElementById('fretboard-body');
    
    STRINGS.forEach((string, stringIndex) => {
        const row = document.createElement('tr');
        row.className = 'string-row';
        
        // String label
        const labelCell = document.createElement('td');
        labelCell.className = 'string-label';
        labelCell.textContent = '';
        labelCell.dataset.stringName = string;
        row.appendChild(labelCell);
        
        // Frets 1-12 (removed fret 0)
        for (let fret = 1; fret <= 12; fret++) {
            const cell = document.createElement('td');
            cell.className = 'fret-cell';
            cell.dataset.string = stringIndex;
            cell.dataset.fret = fret;
            
            // Get note from dictionary
            const note = FRETBOARD_NOTES[stringIndex][fret];
            cell.dataset.note = note;
            
            // Don't display note by default
            cell.textContent = '';
            
            cell.addEventListener('click', () => onFretClick(stringIndex, fret, note));
            
            row.appendChild(cell);
        }
        
        // Add open string (fret 0) note to dataset but don't create cell
        const stringRootNotes = [4, 11, 7, 2, 9, 4]; // E, B, G, D, A, E in semitones from C
        const openNote = NOTES[stringRootNotes[stringIndex]];
        labelCell.dataset.openNote = openNote;
        
        fretboardBody.appendChild(row);
    });
    
    // Apply fret widths
    applyFretWidths();
}

// Apply calculated widths to frets (adjusted for frets 1-12)
function applyFretWidths() {
    const style = document.createElement('style');
    let css = '';
    
    for (let fret = 1; fret <= 12; fret++) {
        const width = calculateFretWidth(fret);
        css += `.fret-cell[data-fret="${fret}"], .fret-number:nth-child(${fret + 1}) { width: ${width}px; }\n`;
    }
    
    style.textContent = css;
    document.head.appendChild(style);
}

// Handle fret clicks
function onFretClick(stringIndex, fret, note) {
    console.log(`Clicked: String ${STRINGS[stringIndex]}, Fret ${fret}, Note ${note}`);
    
    if (currentGame && currentGame.handleClick(stringIndex, fret, note)) {
        return; // Game handled the click
    }
    
    // Check if we're in note viewing mode
    const cell = document.querySelector(`[data-string="${stringIndex}"][data-fret="${fret}"]`);
    if (cell.classList.contains('note-visible')) {
        // Clicked on a visible note - filter by this note
        filterNotesByType(note);
        return;
    }
    
    // Normal mode - toggle highlight
    cell.classList.toggle('highlighted');
}

// Handle clicks on empty fretboard areas
function onFretboardClick(event) {
    // If clicked on empty area or empty cell, show all notes
    if (event.target.classList.contains('fretboard') || 
        event.target.classList.contains('fretboard-wrapper') ||
        event.target.tagName === 'TBODY' ||
        (event.target.classList.contains('fret-cell') && !event.target.textContent.trim())) {
        showAllNotes();
    }
}

// Sidebar functionality
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const main = document.getElementById('main');
    
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
    main.classList.toggle('sidebar-open');
}

// Game instances
let noteGame1 = new NoteGame1();
let noteGame2 = new NoteGame2();
let intervalGame1 = new IntervalGame1();
let pentatonicBoxesEm = new PentatonicBoxesEm();
let currentGame = null;

// Exercise selection
function selectExercise(exerciseType) {
    console.log(`Selected exercise: ${exerciseType}`);
    
    // Clear previous exercise
    clearAllNotes();
    stopAllGames();
    
    // Handle specific exercises
    if (exerciseType === 'notes-variant1') {
        showBasicNotes();
    } else if (exerciseType === 'notes-variant2') {
        currentGame = noteGame1;
        noteGame1.start();
    } else if (exerciseType === 'notes-variant3') {
        currentGame = noteGame2;
        noteGame2.start();
    } else if (exerciseType === 'intervals-variant1') {
        currentGame = intervalGame1;
        intervalGame1.start();
    } else if (exerciseType === 'pentatonic-boxes-em') {
        currentGame = pentatonicBoxesEm;
        pentatonicBoxesEm.start();
    }
    
    // Close sidebar on mobile after selection
    if (window.innerWidth <= 768) {
        toggleSidebar();
    }
}

// Show basic notes (without sharps/flats)
function showBasicNotes() {
    const basicNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    
    // Go through all fret cells
    document.querySelectorAll('.fret-cell').forEach(cell => {
        const note = cell.dataset.note;
        if (basicNotes.includes(note)) {
            cell.textContent = note;
            cell.classList.add('note-visible');
        }
    });
}

// Filter notes by selected note
function filterNotesByType(selectedNote) {
    document.querySelectorAll('.fret-cell').forEach(cell => {
        const note = cell.dataset.note;
        if (note === selectedNote) {
            cell.classList.remove('note-dimmed');
            cell.classList.add('note-highlighted');
        } else {
            cell.classList.add('note-dimmed');
            cell.classList.remove('note-highlighted');
        }
    });
    
    // Handle open string notes
    document.querySelectorAll('.string-label').forEach(label => {
        const openNote = label.dataset.openNote;
        if (openNote === selectedNote) {
            label.classList.add('open-note-highlighted');
            label.textContent = openNote;
        } else {
            label.classList.remove('open-note-highlighted');
            label.textContent = '';
        }
    });
}

// Show all notes normally
function showAllNotes() {
    document.querySelectorAll('.fret-cell').forEach(cell => {
        cell.classList.remove('note-dimmed', 'note-highlighted');
    });
    
    document.querySelectorAll('.string-label').forEach(label => {
        label.classList.remove('open-note-highlighted');
        label.textContent = '';
    });
}

// Clear all displayed notes
function clearAllNotes() {
    document.querySelectorAll('.fret-cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('note-visible', 'highlighted', 'game-discovered', 'game-discovered-temp', 'game-discovered-hidden', 'interval-root', 'interval-target', 'note-dimmed', 'note-highlighted', 'pentatonic-note', 'pentatonic-highlighted', 'pentatonic-dimmed', 'pentatonic-tonic', 'pentatonic-blue-note');
    });
    
    document.querySelectorAll('.string-label').forEach(label => {
        label.classList.remove('open-note-highlighted', 'pentatonic-open-note', 'pentatonic-open-highlighted', 'pentatonic-open-dimmed', 'pentatonic-open-tonic', 'pentatonic-open-blue-note');
        if (!label.dataset.stringName) {
            label.textContent = '';
        }
    });
}

// Stop all games
function stopAllGames() {
    if (noteGame1) noteGame1.stop();
    if (noteGame2) noteGame2.stop();
    if (intervalGame1) intervalGame1.stop();
    if (pentatonicBoxesEm) pentatonicBoxesEm.stop();
    currentGame = null;
}

// Toggle accordion categories
function toggleCategory(categoryId) {
    const subcategory = document.getElementById(`${categoryId}-subcategory`);
    const arrow = event.target.querySelector('.arrow');
    
    subcategory.classList.toggle('expanded');
    arrow.classList.toggle('rotated');
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeNotesDict();
    generateFretboard();
    
    // Add click listener for empty fretboard areas
    document.getElementById('fretboard').addEventListener('click', onFretboardClick);
});

// Handle window resize
window.addEventListener('resize', function() {
    // Close sidebar on desktop if window becomes wide
    if (window.innerWidth > 768) {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const main = document.getElementById('main');
        
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
        main.classList.remove('sidebar-open');
    }
});