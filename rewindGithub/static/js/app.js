const duration = 15 * 1000;
let skew = 1;
function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

const snapItems = document.querySelectorAll(".snap-item");
const nextButton = document.getElementById("next-button");

function snapToNextItem() {
    const activeSnapItem = document.querySelector(
        ".snap-item.current-active",
    );
    const activeIndex = Array.from(snapItems).indexOf(activeSnapItem);
    const nextIndex = (activeIndex + 1) % snapItems.length;

    activeSnapItem.classList.remove("current-active");
    snapItems[nextIndex].classList.add("current-active");
    snapItems[nextIndex].style.scrollBehavior = "smooth";
    snapItems[nextIndex].scrollIntoView();
    element = document.getElementById("down-arrow");

    // classes to switch arrows
    if (nextIndex === snapItems.length - 1) {
        if (!element.classList.contains("fa-arrow-up"))
            element.classList.add("fa-arrow-up");
        if (element.classList.contains("fa-arrow-down"))
            element.classList.remove("fa-arrow-down");
    } else {
        if (element.classList.contains("fa-arrow-up"))
            element.classList.remove("fa-arrow-up");
        if (!element.classList.contains("fa-arrow-down"))
            element.classList.add("fa-arrow-down");
    }
}

nextButton.addEventListener("click", snapToNextItem);
document.addEventListener("keydown", (event) => {
    // triggers when i click the down button
    // up code is 38 down is 40
    if (event.keyCode === 40) snapToNextItem();
});

// badge particles
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

document.getElementById("confetti-badge")
    .addEventListener("click", function () {
        const originX = event.clientX;
        const originY = event.clientY;
        loadParticles(originX, originY);
    });
document.getElementById("goldDesktop")
    .addEventListener("click", function () {
        const originX = event.clientX;
        const originY = event.clientY;
        loadParticles(originX, originY);
    });
document.getElementById("goldMobile")
    .addEventListener("click", function () {
        const originX = event.clientX;
        const originY = event.clientY;
        loadParticles(originX, originY);
    });
// document.getElementById("confetti-badge2")
//     .addEventListener("click", function () {
//         const originX = event.clientX;
//         const originY = event.clientY;
//         loadParticles(originX, originY);
//     });
document.getElementById("confetti-badge3")
    .addEventListener("click", function () {
        const originX = event.clientX;
        const originY = event.clientY;
        loadParticles(originX, originY);
    });
document.getElementById("confetti-badge4")
    .addEventListener("click", function () {
        const originX = event.clientX;
        const originY = event.clientY;
        loadParticles(originX, originY);
    });

function loadSilverParticles(originX, originY) {
    const defaults = {
        spread: 360,
        ticks: 50,
        gravity: 0,
        decay: 0.9,
        startVelocity: 30,
        shapes: ["star"],
        colors: ["dfdfdf", "787878", "c1bac0"],
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

document.getElementById("silverDesktop")
    .addEventListener("click", function () {
        const originX = event.clientX;
        const originY = event.clientY;
        loadSilverParticles(originX, originY);
    });
document.getElementById("silverMobile")
    .addEventListener("click", function () {
        const originX = event.clientX;
        const originY = event.clientY;
        loadSilverParticles(originX, originY);
    });

function loadBronzeParticles(originX, originY) {
    const defaults = {
        spread: 360,
        ticks: 50,
        gravity: 0,
        decay: 0.9,
        startVelocity: 30,
        shapes: ["star"],
        colors: ["ffcc84", "da8b40", "a25f00"],
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

document.getElementById("bronzeDesktop")
    .addEventListener("click", function () {
        const originX = event.clientX;
        const originY = event.clientY;
        loadBronzeParticles(originX, originY);
    });
document.getElementById("bronzeMobile")
    .addEventListener("click", function () {
        const originX = event.clientX;
        const originY = event.clientY;
        loadBronzeParticles(originX, originY);
    });

// ❄️
document.getElementById('snow-button').addEventListener("click", function () {
    stopSnow = !stopSnow;
    if (!stopSnow)
        startSnowing();
    console.log(stopSnow);
});

function startSnowing() {
    stopSnow = false;
    (function frame() {
        skew = Math.max(0.8, skew - 0.001);

        confetti({
            particleCount: 1,
            startVelocity: 0,
            ticks: 500,
            origin: {
                x: Math.random(),
                y: Math.random() * skew - 0.2,
            },
            colors: ["#ffffff"],
            shapes: ["circle"],
            gravity: randomInRange(0.4, 0.6),
            scalar: randomInRange(0.4, 1),
            drift: randomInRange(-0.4, 0.4),
        });
        if (stopSnow === false)
            requestAnimationFrame(frame);
    })();
}
startSnowing();

// confetti for leaderboard
leaderboardHasRun = false;
function leaderboard(entries, observer) {
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
            leaderboardHasRun = true;
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

const leaderboardObserver = new IntersectionObserver(leaderboard, options);

leaderboardObserver.observe(document.getElementById('leaderboardDesktop'));
leaderboardObserver.observe(document.getElementById('leaderboardMobile'));

// fade into view
function slideIn(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            const end = Date.now() + 1 * 1000;
        } else {
            entry.target.classList.remove('in-view');
        }

    });
}

const slideInObserver = new IntersectionObserver(slideIn, options);

slideInObserver.observe(document.getElementById('heroDesktop'));
slideInObserver.observe(document.getElementById('heroMobile'));
slideInObserver.observe(document.getElementById('commitDesktop'));
slideInObserver.observe(document.getElementById('commitMobile'));
slideInObserver.observe(document.getElementById('leaderboardDesktop'));
slideInObserver.observe(document.getElementById('leaderboardMobile'));
slideInObserver.observe(document.getElementById('stargazerDesktop'));
slideInObserver.observe(document.getElementById('stargazerMobile'));
slideInObserver.observe(document.getElementById('birthDesktop'));
slideInObserver.observe(document.getElementById('birthMobile'));
slideInObserver.observe(document.getElementById('overallDesktop'));
slideInObserver.observe(document.getElementById('overallMobile'));
slideInObserver.observe(document.getElementById('finalDesktop'));
slideInObserver.observe(document.getElementById('finalMobile'));

// Disable right-click
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

function downloadCommitted() {
    fetch('https://res.cloudinary.com/de5vfgkg4/image/upload/v1703484639/Committed_ndvsmc.png')
        .then(response => response.blob())
        .then(blob => {
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'Committed_GitHubRewind2023.png';
            link.setAttribute('target', '_blank');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
}

function downloadStargazer() {
    fetch('https://res.cloudinary.com/de5vfgkg4/image/upload/v1703484641/Stargazer_ehiy4d.png')
        .then(response => response.blob())
        .then(blob => {
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'Stargazer_GitHubRewind2023.png';
            link.setAttribute('target', '_blank');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
}

function shareTop3onTwitter() {
    var tweetText = 'My Top 3 programming languages for 2023 are 👀 Find out yours on Github Rewind 2023 ✨ https://githubrewind.vercel.app ✨ #githubrewind #githubrewind2023';
    var twitterUrl = 'https://x.com/intent/tweet?url=' + '&text=' + encodeURIComponent(tweetText);
    window.open(twitterUrl, '_blank');
}

function shareStargazerOnTwitter() {
    var tweetText = 'I got the Stargazer badge 🤩 on GitHub Rewind 2023! Check out your GitHub 2023 journey at https://githubrewind.vercel.app ✨ #githubrewind #githubrewind2023';
    var twitterUrl = 'https://x.com/intent/tweet?url=' + '&text=' + encodeURIComponent(tweetText);
    window.open(twitterUrl, '_blank');
}

function shareCommittedOnTwitter() {
    var tweetText = 'I got the Committed badge 😎 on GitHub Rewind 2023! Check out your GitHub 2023 journey at https://githubrewind.vercel.app ✨ #githubrewind #githubrewind2023';
    var twitterUrl = 'https://x.com/intent/tweet?url=' + '&text=' + encodeURIComponent(tweetText);
    window.open(twitterUrl, '_blank');
}

function shareBirthOnTwitter() {
    var days = "{{ totalDays }}";
    var tweetText = 'Celebrating' + days + 'days on Github and the feeling of making progress a line of code at a time! 🔥 Check out your GitHub 2023 journey at https://githubrewind.vercel.app ✨ #githubrewind #githubrewind2023';
    var twitterUrl = 'https://x.com/intent/tweet?url=' + '&text=' + encodeURIComponent(tweetText);
    window.open(twitterUrl, '_blank');
}

function shareOverallOnTwitter() {
    var tweetText = 'I just explored my GitHub Rewind 2023, have you? 👀🔥 Check out yours at https://githubrewind.vercel.app ✨ #githubrewind #githubrewind2023';
    var twitterUrl = 'https://x.com/intent/tweet?url=' + '&text=' + encodeURIComponent(tweetText);
    window.open(twitterUrl, '_blank');
}