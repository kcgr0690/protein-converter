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
    const useFullName = document.getElementById('displayMode').checked;
    const sequence = document.getElementById('sequence').value.trim().toUpperCase();
    const type = document.getElementById('type').value;
    const sequenceInput = document.getElementById('sequence');
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '';


    const validBases = {
        coding: /^[ATCG]+$/,
        template: /^[ATCG]+$/,
        mRNA: /^[AUCG]+$/
    };

    if (!validBases[type]) {
        outputDiv.innerHTML = `<div style="color:red;"><strong>Error:</strong> Unknown sequence type "${type}".</div>`;
        return;
    }
    if (!validBases[type].test(sequence)) {
        outputDiv.innerHTML = `<div style="color:red;"><strong>Error:</strong> Invalid bases for ${type} sequence.</div>`;
        return;
    }


    let mRNA = '';
    if (type === 'mRNA') {
        mRNA = sequence;
    } else if (type === 'coding') {
        mRNA = sequence.replace(/T/g, 'U');
    } else {
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
        outputDiv.innerHTML = '<div style="color:red;"><strong>Error:</strong> Sequence too short for translation.</div>';
        return;
    }

    const startIndex = mRNA.indexOf('AUG');
    if (startIndex === -1) {
        outputDiv.innerHTML = '<div style="color:red;"><strong>Error:</strong> No valid "AUG" start codon in reading frame.</div>';
        return;
    }
    const codingmRNA = mRNA.slice(startIndex);

    const codonChunks = [];
    for (let i = 0; i < codingmRNA.length; i += 3) {
        codonChunks.push(`(${codingmRNA.slice(i, i + 3)})`);
    }
    const codonDisplay = codonChunks.join(' - ');

    let protein = [];
    let stopIndex = -1;
    let hasStop = false;

    for (let i = 0; i < codingmRNA.length; i += 3) {
        const codon = codingmRNA.slice(i, i + 3);
        if (codon.length < 3) break; 

        const aaObj = codonTable[codon];
        if (!aaObj) {
            outputDiv.innerHTML = `<div style="color:red;"><strong>Error:</strong> Invalid codon "${codon}" (invalid bases?)</div>`;
            return;
        }

        if (aaObj.short === 'STOP') {
            stopIndex = i;
            hasStop = true;
            protein.push(aaObj.short)
            break;
        }

        protein.push(useFullName ? aaObj.full : aaObj.short);
    }

    const translatedRegionLength = hasStop ? stopIndex : codingmRNA.length;
    const translatedRemainder = translatedRegionLength % 3;
    let translatedLeftoverMsg = '';
    if (translatedRemainder !== 0) {
        const remainingBases = codingmRNA.slice(translatedRegionLength - translatedRemainder, translatedRegionLength);
        translatedLeftoverMsg = `<div><em>${translatedRemainder} base${translatedRemainder > 1 ? 's' : ''} remaining in translated region: <strong>${remainingBases}</strong></em></div>`;
    }

    let postStopFullCodons = [];
    let postStopRemainder = '';
    if (hasStop) {
        const postStopRegion = codingmRNA.slice(stopIndex + 3); // region after STOP codon
        for (let j = 0; j < postStopRegion.length; j += 3) {
            const chunk = postStopRegion.slice(j, j + 3);
            if (chunk.length < 3) {
                postStopRemainder = chunk;
                break;
            }
            const postAAObj = codonTable[chunk];
            if (postAAObj) {
                const displayAA = useFullName ? postAAObj.full : postAAObj.short;
                postStopFullCodons.push(`${chunk} → ${displayAA}`);
            } else {
                postStopFullCodons.push(`${chunk} → (invalid)`);
            }
        }
    }

    let postStopMsg = '';
    if (postStopFullCodons.length > 0) {
        postStopMsg += `<div><em>${postStopFullCodons.length} codon${postStopFullCodons.length > 1 ? 's' : ''} after STOP: ${postStopFullCodons.join(', ')}</em></div>`;
    }
    if (postStopRemainder) {
        postStopMsg += `<div><em>Plus ${postStopRemainder.length} base${postStopRemainder.length > 1 ? 's' : ''} remaining after the last post-STOP codon: <strong>${postStopRemainder}</strong></em></div>`;
    }

    const proteinString = protein.length ? `(${protein.join(') - (')})` : '( — )';

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
      ${postStopMsg}
      ${translatedLeftoverMsg}
    `;

    sequenceInput.value = '';
});