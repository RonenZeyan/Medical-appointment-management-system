const hamburger = document.getElementById('navbar-hamburger');
const navLinks = document.querySelector('.navbar-hamburger-contant');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});


document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", async (event) => {
            event.preventDefault(); // מונע טעינת הדף מיד

            const url = link.href;

            try {
                const res = await fetch(url, { method: "HEAD" }); // בדיקה מהירה ללא הורדת הדף
                if (res.status === 404) {
                    window.location.href = "/error/404.html"; // ניתוב לעמוד שגיאה
                } else {
                    window.location.href = url; // המשך ליעד רק אם תקין
                }
            } catch (error) {
                console.error("Error checking page:", error);
                window.location.href = "/error/404.html"; // במקרה של שגיאה, להפנות לעמוד שגיאה
            }
        });
    });
});
