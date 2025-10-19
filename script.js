const codonTable = {
    'UUU': 'PHE', 'UUC': 'PHE', 'UUA': 'LEU', 'UUG': 'LEU',
    'CUU': 'LEU', 'CUC': 'LEU', 'CUA': 'LEU', 'CUG': 'LEU',
    'AUU': 'ILE', 'AUC': 'ILE', 'AUA': 'ILE', 'AUG': 'MET (Start)',
    'GUU': 'VAL', 'GUC': 'VAL', 'GUA': 'VAL', 'GUG': 'VAL',
    'UCU': 'SER', 'UCC': 'SER', 'UCA': 'SER', 'UCG': 'SER',
    'CCU': 'PRO', 'CCC': 'PRO', 'CCA': 'PRO', 'CCG': 'PRO',
    'ACU': 'THR', 'ACC': 'THR', 'ACA': 'THR', 'ACG': 'THR',
    'GCU': 'ALA', 'GCC': 'ALA', 'GCA': 'ALA', 'GCG': 'ALA',
    'UAU': 'TYR', 'UAC': 'TYR', 'UAA': 'STOP', 'UAG': 'STOP',
    'CAU': 'HIS', 'CAC': 'HIS', 'CAA': 'GLN', 'CAG': 'GLN',
    'AAU': 'ASN', 'AAC': 'ASN', 'AAA': 'LYS', 'AAG': 'LYS',
    'GAU': 'ASP', 'GAC': 'ASP', 'GAA': 'GLU', 'GAG': 'GLU',
    'UGU': 'CYS', 'UGC': 'CYS', 'UGA': 'STOP', 'UGG': 'TRP',
    'CGU': 'ARG', 'CGC': 'ARG', 'CGA': 'ARG', 'CGG': 'ARG',
    'AGU': 'SER', 'AGC': 'SER', 'AGA': 'ARG', 'AGG': 'ARG',
    'GGU': 'GLY', 'GGC': 'GLY', 'GGA': 'GLY', 'GGG': 'GLY'
}; // will use this to identify codons and translate to protein -> 
// I think I'm only going to use the first 3 letters for the protein name like lys for lysine, etc etc


function switchTab(tabName, e) { 
    const panels = document.querySelectorAll('.tabPanel');
    panels.forEach(panel => panel.classList.remove('active'));

    const buttons = document.querySelectorAll('.tabButton');
    buttons.forEach(button => button.classList.remove('active'));

    document.getElementById(tabName + 'Tab').classList.add('active');

    e.target.classList.add('active'); 
}

function loadHistory() {
    const history = localStorage.getItem('translationHistory');
    if (!history) return [];
    try {
        return JSON.parse(history);
    } catch (e) {
        console.error('Bad history data, clearing: ', e);
        localStorage.removeItem('translationHistory');
        return [];
    }
}

function saveAndDisplayHistory(entry) {
    let history = loadHistory();
    history.unshift(entry);
    if (history.length > 10) history = history.slice(0,10);
    localStorage.setItem('translationHistory', JSON.stringify(history));

    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${item.date}</strong><br>${item.sequence} (${item.type}) → <em>${item.protein}</em>`;
        historyList.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('clearHistoryBtn').addEventListener('click', function() {
        localStorage.removeItem('translationHistory')
        document.getElementById('historyList').innerHTML = '';
    });
});

document.getElementById('translateBtn').addEventListener('click', function() {
    const sequence = document.getElementById('sequence').value.trim().toUpperCase();
    const type = document.getElementById('type').value.toLowerCase();
    const sequenceInput = document.getElementById('sequence');
    console.log('Sequence:', sequence);
    console.log('Type:', type);
    
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '';

    let mRNA = '';
    if (type === 'mrna') {
        mRNA = sequence;
    } else if (type === 'coding') {
        mRNA = sequence.replace(/T/g, 'U');
    } else if (type === 'template') {
        const reversed = sequence.split('').reverse().join('');
        const complement = reversed
            .replace(/A/g, 'tempA')
            .replace(/T/g, 'A')
            .replace(/tempA/g, 'T')
            .replace(/G/g, 'tempG')
            .replace(/C/g, 'G')
            .replace(/tempG/g, 'C');
        mRNA = complement.replace(/T/g, 'U');
    }

    if (mRNA.length < 3) {
        outputDiv.innerHTML = '<p>Error: Sequence too short for translation.</p>';
        return;
    }

    const startIndex = mRNA.indexOf('AUG');
    if (startIndex === -1) {
        outputDiv.innerHTML = '<p>Error: No valid "AUG" start codon in reading frame.</p>';
        return;
    }

    const codingmRNA = mRNA.slice(startIndex);
    console.log('Coding mRNA from start:', codingmRNA);

    //new code begins below.

    let protein = [];
    let stopIndex = -1;
    let postStopCodons = [];
    let postStopAA = '';
    let hasStop = false;

    for (let i = 0; i < codingmRNA.length; i += 3) {
    const codon = codingmRNA.slice(i, i + 3);
    if (codon.length < 3) break;
    let aa = codonTable[codon];
    if (!aa) {
        outputDiv.innerHTML = `<p>Error: Invalid codon "${codon}" (invalid bases?)</p>`;
        return;
    }

    aa = aa.split(' ')[0];
    
    if (aa === 'STOP') {
        protein.push(aa); 
        stopIndex = i;
        hasStop = true;
        break;
    }

    protein.push(aa);
}

    if (stopIndex !== -1) {
        const postStopmRNA = codingmRNA.slice(stopIndex + 3);
        for (let j = 0; j < postStopmRNA.length; j += 3) {
            const postCodon = postStopmRNA.slice(j, j + 3);
            if (postCodon.length < 3) break;
            let postAA = codonTable[postCodon];
            if (postAA) {
                postAA = postAA.split(' ')[0];
                postStopCodons.push(`${postCodon} → <strong>${postAA}</strong>`);
            } else {
                postStopCodons.push(`${postCodon} → (invalid)`);
            }
        }
        if (postStopCodons.length > 0) {
            postStopAA = `<p><em>${postStopCodons.length} codon${postStopCodons.length > 1 ? 's' : ''} after STOP: ${postStopCodons.join(', ')}</em></p>`;
        }
    }

let noStopWarning = '';
if (!hasStop) {
    noStopWarning = `<p><em>No STOP codon found—translation assumed complete.</em></p>`;
}

let leftoverWarning = '';
const remainder = codingmRNA.length % 3;
if (remainder !== 0) {
    const remainingBases = codingmRNA.slice(-remainder);
    leftoverWarning = `<p><em>${remainder} base${remainder > 1 ? 's' : ''} remaining at the end: <strong>${remainingBases}</strong></em></p>`;
}
// LEFT OFF HERE, CONTINUE TMRW. There's probably bugs :(

    const proteinString = `START (${protein.join(') - (')})`;
    console.log('Protein:', proteinString); 

    const entry = {
        date: new Date().toLocaleString(),
        sequence: sequence,
        type: type,
        protein: proteinString
    };

    saveAndDisplayHistory(entry);
    
    outputDiv.innerHTML = `<p>Sequence entered: <strong>${sequence}</strong> (Type: ${type})</p>
                       <p>Protein: <strong>${proteinString}</strong></p>${postStopAA}${leftoverWarning}`;
    sequenceInput.value = '';
});