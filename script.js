document.getElementById("translateBtn").addEventListener("click", function() {
    const sequence = document.getElementById('sequence').ariaValueMax.trim().toUpperCase();
    const type = document.getElementById('type').value;
    console.log('Sequence: ', sequence);
    console.log('Type: ', type)
});