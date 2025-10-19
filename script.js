const codonTable = {
    // Phenylalanine
    'UUU': {short: 'PHE', full: 'Phenylalanine'},
    'UUC': {short: 'PHE', full: 'Phenylalanine'},
    // Leucine
    'UUA': {short: 'LEU', full: 'Leucine'},
    'UUG': {short: 'LEU', full: 'Leucine'},
    'CUU': {short: 'LEU', full: 'Leucine'},
    'CUC': {short: 'LEU', full: 'Leucine'},
    'CUA': {short: 'LEU', full: 'Leucine'},
    'CUG': {short: 'LEU', full: 'Leucine'},
    // Isoleucine
    'AUU': {short: 'ILE', full: 'Isoleucine'},
    'AUC': {short: 'ILE', full: 'Isoleucine'},
    'AUA': {short: 'ILE', full: 'Isoleucine'},
    // Methionine (Start)
    'AUG': {short: 'MET', full: 'Methionine (Start)'},
    // Valine
    'GUU': {short: 'VAL', full: 'Valine'},
    'GUC': {short: 'VAL', full: 'Valine'},
    'GUA': {short: 'VAL', full: 'Valine'},
    'GUG': {short: 'VAL', full: 'Valine'},
    // Serine
    'UCU': {short: 'SER', full: 'Serine'},
    'UCC': {short: 'SER', full: 'Serine'},
    'UCA': {short: 'SER', full: 'Serine'},
    'UCG': {short: 'SER', full: 'Serine'},
    'AGU': {short: 'SER', full: 'Serine'},
    'AGC': {short: 'SER', full: 'Serine'},
    // Proline
    'CCU': {short: 'PRO', full: 'Proline'},
    'CCC': {short: 'PRO', full: 'Proline'},
    'CCA': {short: 'PRO', full: 'Proline'},
    'CCG': {short: 'PRO', full: 'Proline'},
    // Threonine
    'ACU': {short: 'THR', full: 'Threonine'},
    'ACC': {short: 'THR', full: 'Threonine'},
    'ACA': {short: 'THR', full: 'Threonine'},
    'ACG': {short: 'THR', full: 'Threonine'},
    // Alanine
    'GCU': {short: 'ALA', full: 'Alanine'},
    'GCC': {short: 'ALA', full: 'Alanine'},
    'GCA': {short: 'ALA', full: 'Alanine'},
    'GCG': {short: 'ALA', full: 'Alanine'},
    // Tyrosine
    'UAU': {short: 'TYR', full: 'Tyrosine'},
    'UAC': {short: 'TYR', full: 'Tyrosine'},
    // Histidine
    'CAU': {short: 'HIS', full: 'Histidine'},
    'CAC': {short: 'HIS', full: 'Histidine'},
    // Glutamine
    'CAA': {short: 'GLN', full: 'Glutamine'},
    'CAG': {short: 'GLN', full: 'Glutamine'},
    // Asparagine
    'AAU': {short: 'ASN', full: 'Asparagine'},
    'AAC': {short: 'ASN', full: 'Asparagine'},
    // Lysine
    'AAA': {short: 'LYS', full: 'Lysine'},
    'AAG': {short: 'LYS', full: 'Lysine'},
    // Aspartic acid
    'GAU': {short: 'ASP', full: 'Aspartic acid'},
    'GAC': {short: 'ASP', full: 'Aspartic acid'},
    // Glutamic acid
    'GAA': {short: 'GLU', full: 'Glutamic acid'},
    'GAG': {short: 'GLU', full: 'Glutamic acid'},
    // Cysteine
    'UGU': {short: 'CYS', full: 'Cysteine'},
    'UGC': {short: 'CYS', full: 'Cysteine'},
    // Tryptophan
    'UGG': {short: 'TRP', full: 'Tryptophan'},
    // Arginine
    'CGU': {short: 'ARG', full: 'Arginine'},
    'CGC': {short: 'ARG', full: 'Arginine'},
    'CGA': {short: 'ARG', full: 'Arginine'},
    'CGG': {short: 'ARG', full: 'Arginine'},
    'AGA': {short: 'ARG', full: 'Arginine'},
    'AGG': {short: 'ARG', full: 'Arginine'},
    // Glycine
    'GGU': {short: 'GLY', full: 'Glycine'},
    'GGC': {short: 'GLY', full: 'Glycine'},
    'GGA': {short: 'GLY', full: 'Glycine'},
    'GGG': {short: 'GLY', full: 'Glycine'},
    // Stop codons
    'UAA': {short: 'STOP', full: 'STOP'},
    'UAG': {short: 'STOP', full: 'STOP'},
    'UGA': {short: 'STOP', full: 'STOP'}
};


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

    const validBases = {
        coding: /^[ATCG]+$/,
        template: /^[ATCG]+$/,
        mRNA: /^[AUCG]+$/
    };

    if (!validBases[type].test(sequence)) {
        outputDiv.innerHTML = `<div style="color:red;"><strong>Error:</strong> Invalid bases for ${type} sequence.</div>`
        return;
    }

    let mRNA = '';
    if (type === 'mRNA') {
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

    const codonChunks = [];
    for (let i = 0; i < codingmRNA.length; i += 3) {
        const chunk = codingmRNA.slice(i, i + 3);
        codonChunks.push(`(${chunk})`);
    }

    const codonDisplay = codonChunks.join(' - ');

    console.log('Coding mRNA from start:', codingmRNA);

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
    
    outputDiv.innerHTML = `
  <div><strong>Sequence:</strong> ${sequence} (${type})</div>
  <div><strong>mRNA (from AUG):</strong> ${codonDisplay}</div>
  <div><strong>Protein:</strong> ${proteinString}</div>
  ${postStopAA}${leftoverWarning}
`;
    sequenceInput.value = '';
});