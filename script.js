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
    const type = document.getElementById('type').value;
    const sequenceInput = document.getElementById('sequence');
    console.log('Sequence:', sequence);
    console.log('Type:', type);
    
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '';

    let mrna = '';
    if (type === 'mrna') {
        mrna = sequence;
    } else if (type === 'coding') {
        mrna = sequence.replace(/T/g, 'U');
    } else if (type === 'template') {
        const reversed = sequence.split('').reverse().join('');
        const complement = reversed
            .replace(/A/g, 'tempA')
            .replace(/T/g, 'A')
            .replace(/tempA/g, 'T')
            .replace(/G/g, 'tempG')
            .replace(/C/g, 'G')
            .replace(/tempG/g, 'C');
        mrna = complement.replace(/T/g, 'U');
    }

    if (mrna.length < 3) {
        outputDiv.innerHTML = '<p>Error: Sequence too short for translation.</p>';
        return;
    }

    const startIndex = mrna.indexOf('AUG');
    if (startIndex === -1) {
        outputDiv.innerHTML = '<p>Error: No valid "AUG" start codon in reading frame.</p>';
        return;
    }

    const codingMrna = mrna.slice(startIndex);
    console.log('Coding mRNA from start:', codingMrna);

    let protein = [];
    for (let i = 0; i < codingMrna.length; i+=3) {
        const codon = codingMrna.slice(i, i + 3);
        if (codon.length < 3) break;
        let aa = codonTable[codon];
        if (!aa) {
            outputDiv.innerHTML = `<p>Error: Invalid codon "${codon}" (invalid bases?)</p>`;
            return;
        }

        aa = aa.split(' ')[0];
        protein.push(aa);
        if (aa === 'STOP') break;
    }

    let leftoverWarning = '';
    const remainder = codingMrna.length % 3;
    if (remainder !== 0) {
        const remainingBases = codingMrna.slice(-remainder);
        leftoverWarning = `<p><em>There are ${remainder} bases leftover at the end. <strong>${remainingBases}</strong></em></p>`;
    }

    if (protein.length === 0 || protein[0] !== 'MET') {
        outputDiv.innerHTML = '<p>Error: Translation does not start with MET (start codon).</p>';
        return;
    }

    const proteinString = `START (${protein.join(') - (')})`;
    console.log('Protein:', proteinString);

    const entry = {
        date:new Date().toLocaleString(),
        sequence: sequence,
        type: type,
        protein: proteinString
    };

    saveAndDisplayHistory(entry);
    
    outputDiv.innerHTML = `<p>Sequence entered: <strong>${sequence}</strong> (Type: ${type})</p>
                           <p>Protein: <strong>${proteinString}</strong></p>`;
    sequenceInput.value = '';
});