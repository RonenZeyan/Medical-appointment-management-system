document.addEventListener("DOMContentLoaded", function () {
    const modalHTML = `
        <section class="success-modal-section hide">
            <div class="success-modal">
                <div id="success-modal-div">
                    <div id="loading-arrow"></div>
                    <p id="success-message"></p>
                </div>
                <button disabled id="close-modal">OK</button>
            </div>
        </section>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
    const modalSection = document.querySelector(".success-modal-section");
    const modalMessage = document.getElementById("success-message");
    const closeModal = document.getElementById("close-modal");
    const success_modal_img = document.getElementById("success-modal-img");
    const success_modal_div = document.getElementById("success-modal-div");
    const loading_arrow = document.getElementById("loading-arrow");
    let redirect_path;

    // display the modal
    window.showSuccessModal = function (path, message) {
        redirect_path = path;
        modalMessage.innerHTML = message;
        modalSection.classList.remove("hide");
        setTimeout(() => {
            loading_arrow.remove();
            success_modal_div.insertAdjacentHTML("afterbegin", `
                <img id="success-modal-img" src="https://www.freeiconspng.com/thumbs/success-icon/success-icon-10.png" alt="successIMG">
            `);
            closeModal.removeAttribute("disabled"); //remove disabled attribute from button 
        }, 1000);
    };

    //click event listener for OK BUTTON
    closeModal.addEventListener("click", () => {
        modalSection.classList.add("hide");
        if (redirect_path)
            window.location.href = redirect_path;
        else
            window.location.reload();
    });
});
