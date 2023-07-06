const modal = document.getElementById('instructions-modal');
const closeBtn = document.getElementsByClassName('close')[0];

function openModal() {
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}

closeBtn.addEventListener('click', closeModal);

window.addEventListener('click', function (event) {
    if (event.target === modal) {
        closeModal();
    }
});

const isInstructionShown = localStorage.getItem('instructionShown');

if (!isInstructionShown) {
    openModal();
    localStorage.setItem('instructionShown', true);
}
