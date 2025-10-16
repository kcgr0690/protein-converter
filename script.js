document.getElementById('translateBtn').addEventListener('click', function() {
    const sequence = document.getElementById('sequence').value.trim().toUpperCase();
    const type = document.getElementById('type').value;
    console.log('Sequence:', sequence);
    console.log('Type:', type);

    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = `<p>Sequence entered: <strong>${sequence}</strong> (Type: ${type})</p>`;
});