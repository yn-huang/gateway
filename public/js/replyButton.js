const replyButtons = document.querySelectorAll('.replyButton');

replyButtons.forEach((replyButton) => {
    replyButton.addEventListener('click', function () {
        const expanded = this.getAttribute('aria-expanded');
        if (expanded === 'true') {
            const textareaId = '#replyField' + this.id.replace('replyButton', '');
            const textarea = document.querySelector(textareaId);
            textarea.addEventListener('keyup', function () {
                const buttonId = '#replyButton' + this.id.replace('replyField', '')
                const button = document.querySelector(buttonId);
                const formId = button.getAttribute('aria-controls');
                if (this.value) {
                    button.classList.remove('btn-outline-success')
                    button.classList.add('btn-success')
                    button.setAttribute('form', formId);
                } else {
                    button.classList.remove('btn-success')
                    button.classList.add('btn-outline-success')
                    button.setAttribute('form', '');
                }
            });
        }
    })
})