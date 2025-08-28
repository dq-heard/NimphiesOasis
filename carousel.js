document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");

  const scrollAmount = () => {
    const slide = track.querySelector(".carousel-slide");
    return slide ? slide.offsetWidth : 300;
  };

  function fadeLoop(direction) {
    const track = document.querySelector(".carousel-track");
    const maxScroll = track.scrollWidth - track.clientWidth;

    // Lock interaction during fade
    track.classList.add("fading");

    // Apply fade-out
    track.style.transition = "opacity 0.4s ease";
    track.style.opacity = "0";

    setTimeout(() => {
      // Jump to opposite end
      if (direction === "start") {
        track.scrollLeft = 0;
      } else if (direction === "end") {
        track.scrollLeft = maxScroll;
      }

      // Fade back in
      track.style.opacity = "1";

      // Unlock interaction
      setTimeout(() => {
        track.classList.remove("fading");
      }, 400);
    }, 400);
  }

  nextBtn.addEventListener("click", () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    const newScrollLeft = track.scrollLeft + scrollAmount();

    if (newScrollLeft >= maxScroll) {
      fadeLoop("start");
    } else {
      track.scrollBy({ left: scrollAmount(), behavior: "smooth" });
    }
  });

  prevBtn.addEventListener("click", () => {
    const newScrollLeft = track.scrollLeft - scrollAmount();

    if (newScrollLeft <= 0) {
      fadeLoop("end");
    } else {
      track.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
    }
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
    if (Math.abs(delta) > 50) {
      track.scrollBy({ left: delta, behavior: "smooth" });
    }
  });
});
