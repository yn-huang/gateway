// reply button animation
const replyButtons = document.querySelectorAll(".replyButton");

replyButtons.forEach((replyButton) => {
  replyButton.addEventListener("click", function () {
    const expanded = this.getAttribute("aria-expanded");
    if (expanded === "true") {
      // create textarea for reply
      const textareaId = "#replyField" + this.id.replace("replyButton", "");
      const textarea = document.querySelector(textareaId);

      // add event listener to the textarea
      textarea.addEventListener("keyup", function () {
        const buttonId = "#replyButton" + this.id.replace("replyField", "");
        const button = document.querySelector(buttonId);
        const formId = button.getAttribute("aria-controls");

        // if textarea is not empty
        if (this.value) {
          // make reply button solid for better user experience
          button.classList.remove("btn-outline-success");
          button.classList.add("btn-success");
          // link the reply button to the form
          button.setAttribute("form", formId);

          // if textarea is empty
        } else {
          // make reply button hollow
          button.classList.remove("btn-success");
          button.classList.add("btn-outline-success");
          // unlink the reply button
          button.setAttribute("form", "");
        }
      });
    }
  });
});
