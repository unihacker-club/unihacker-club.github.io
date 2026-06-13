/* UniHacker.Club — interactions (vanilla, no dependencies) */
(function () {
  "use strict";

  /* ---------- Mobile nav ---------- */
  var body = document.body;
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // close on link click (mobile)
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) body.classList.remove("nav-open");
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll("[data-reveal]");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Animated stat counters ---------- */
  var nums = document.querySelectorAll("[data-count]");
  if (nums.length && !reduce && "IntersectionObserver" in window) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute("data-count"), 10);
        var dur = 1100, start = performance.now();
        var tick = function (now) {
          var p = Math.min((now - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.firstChild.nodeValue = Math.round(target * eased).toString();
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        countIO.unobserve(el);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (el) { countIO.observe(el); });
  }

  /* ---------- Team search filter ---------- */
  var input = document.getElementById("team-search");
  if (input) {
    var members = Array.prototype.slice.call(document.querySelectorAll(".member"));
    var countEl = document.getElementById("search-count");
    var empty = document.querySelector(".no-results");
    var total = members.length;

    var norm = function (s) {
      return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    };

    var apply = function () {
      var q = norm(input.value);
      var shown = 0;
      members.forEach(function (m) {
        var match = !q || m.getAttribute("data-name").indexOf(q) !== -1;
        m.classList.toggle("is-hidden", !match);
        if (match) shown++;
      });
      if (empty) empty.classList.toggle("show", shown === 0);
      if (countEl) {
        countEl.textContent = q
          ? shown + " de " + total + " integrantes"
          : total + " integrantes";
      }
    };

    members.forEach(function (m) {
      m.setAttribute("data-name", norm(m.querySelector(".member__name").textContent));
    });
    input.addEventListener("input", apply);
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
