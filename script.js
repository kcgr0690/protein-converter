document.getElementById('translateBtn').addEventListener('click', function() {
    const sequence = document.getElementById('sequence').value.trim().toUpperCase();
    const type = document.getElementById('type').value;
    console.log('Sequence:', sequence);
    console.log('Type:', type);

    let mrna = '';
    if (type === 'mrna') {
        mrna = sequence;
    } else if (type == 'coding') {
        mrna = sequence.replace(/T/g, 'U');
    } else if (type === template) {
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
        outputDiv.innerHTML = '<p>Error: Sequence too short for translation.<\p>';
        return;
    }

    const startIndex = mrna.indexOf('AUG');
    if (startIndex === -1 || startIndex % 3 !== 0) {
        outputDiv.innerHTML = '<p>Error: No valid "AUG" start codon in reading frame.<\p>';
        return;
    }

    const codingMrna = mrna.slice(startIndex);
    console.log('Coding mRNA from start:', codingMrna);

    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = `<p>Sequence entered: <strong>${sequence}</strong> (Type: ${type})</p>`;
});