function getVisibleSlideWidth(track) {
  const slides = track.querySelectorAll(".carousel-slide");
  const scrollLeft = track.scrollLeft;

  for (let slide of slides) {
    const slideLeft = slide.offsetLeft;
    const slideRight = slideLeft + slide.offsetWidth;

    if (scrollLeft >= slideLeft && scrollLeft < slideRight) {
      return slide.offsetWidth;
    }
  }

  // Fallback if no match
  return slides[0]?.offsetWidth || 300;
}

function bindNavigationButtons(prevBtn, nextBtn, track, scrollAmount) {
  function fadeLoop(direction) {
    const maxScroll = track.scrollWidth - track.clientWidth;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const btn = direction === "start" ? prevBtn : nextBtn;

    if (prefersReducedMotion) {
      track.style.transition = "none";
      track.style.opacity = "0.6";
      track.scrollLeft = direction === "start" ? 0 : maxScroll;

      setTimeout(() => (track.style.opacity = "1"), 100);
      return;
    }

    track.classList.add("fading");
    track.style.transition = "opacity 0.4s ease";
    track.style.opacity = "0";

    setTimeout(() => {
      track.scrollLeft = direction === "start" ? 0 : maxScroll;
      track.style.opacity = "1";
      btn.classList.add("pulse");
      setTimeout(() => btn.classList.remove("pulse"), 600);
      setTimeout(() => track.classList.remove("fading"), 400);
    }, 400);
  }

  nextBtn.addEventListener("click", () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    const newScrollLeft = track.scrollLeft + scrollAmount();

    newScrollLeft >= maxScroll
      ? fadeLoop("start")
      : track.scrollBy({ left: scrollAmount(), behavior: "smooth" });
  });

  prevBtn.addEventListener("click", () => {
    const newScrollLeft = track.scrollLeft - scrollAmount();

    newScrollLeft <= 0
      ? fadeLoop("end")
      : track.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
  });

  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      track.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
    } else if (e.key === "ArrowRight") {
      track.scrollBy({ left: scrollAmount(), behavior: "smooth" });
    }
  });

  let startX = 0;
  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  track.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const delta = startX - endX;

    const threshold = 50; // Minimum swipe distance to trigger scroll
    if (Math.abs(delta) > threshold) {
      const direction = delta > 0 ? 1 : -1;
      track.scrollBy({ left: direction * scrollAmount(), behavior: "smooth" });
    }
  });
}

function initScrollPulse(track) {
  let lastScrollLeft = track.scrollLeft;
  let lastDirection = null;
  let debounceTimeout;

  track.addEventListener("scroll", () => {
    const currentScrollLeft = track.scrollLeft;
    const delta = currentScrollLeft - lastScrollLeft;

    // Only trigger if movement exceeds threshold
    const threshold = 20;
    if (Math.abs(delta) < threshold) return;

    const direction = delta > 0 ? "next" : "prev";

    // Prevent flickering by debouncing
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      if (direction !== lastDirection) {
        const btn = document.querySelector(`.carousel-btn.${direction}`);
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        if (!prefersReducedMotion) {
          btn.classList.add("pulse");
          setTimeout(() => btn.classList.remove("pulse"), 400);
        }
        lastDirection = direction;
      }
    }, 100);

    lastScrollLeft = currentScrollLeft;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");

  const scrollAmount = () => getVisibleSlideWidth(track);
  bindNavigationButtons(prevBtn, nextBtn, track, scrollAmount);
  initScrollPulse(track);
});
