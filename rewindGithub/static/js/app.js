// splash screen
// document.addEventListener("DOMContentLoaded", function () {
//     setTimeout(function () {
//         document.getElementById("splash").style.display = "none";
//     }, 5000);
// });

function loadParticles(originX, originY) {
    const defaults = {
        spread: 360,
        ticks: 50,
        gravity: 0,
        decay: 0.9,
        startVelocity: 30,
        shapes: ["star"],
        colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
        origin: {
            x: originX / window.innerWidth,
            y: originY / window.innerHeight,
        },
    };

    function shoot() {
        confetti({
            ...defaults,
            particleCount: 40,
            scalar: 1.2,
            shapes: ["star"],
        });

        confetti({
            ...defaults,
            particleCount: 10,
            scalar: 0.75,
            shapes: ["circle"],
        });
    }

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
}

document
    .getElementById("confetti-button")
    .addEventListener("click", function () {
        const originX = event.clientX;
        const originY = event.clientY;
        loadParticles(originX, originY);
    });

leaderboardHasRun = false;

// intersection observer
function handleIntersection(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            const end = Date.now() + 1 * 1000;

            if (!leaderboardHasRun) {
                // go Buckeyes!
                const colors = ["#bb0000", "#ffffff"];

                (function frame() {
                    confetti({
                        particleCount: 2,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                        colors: colors,
                    });

                    confetti({
                        particleCount: 2,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 },
                        colors: colors,
                    });

                    if (Date.now() < end) {
                        requestAnimationFrame(frame);
                    }
                })();
            }
            leaderboardHasRun=true;
        } else {
            entry.target.classList.remove('in-view');
        }

    });
}

const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
};

const observer = new IntersectionObserver(handleIntersection, options);

const animatedElement = document.getElementById('chart');
observer.observe(animatedElement);

const stargazerElement = document.getElementById('stargazer');
observer.observe(stargazerElement);