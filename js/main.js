(function () {
  var menu = document.getElementById("menu");
  function closeMenu() { menu.hidden = true; document.body.style.overflow = ""; }
  document.getElementById("open-menu").addEventListener("click", function () {
    menu.hidden = false;
    document.body.style.overflow = "hidden";
  });
  document.getElementById("close-menu").addEventListener("click", closeMenu);
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeMenu();
  });

  var themeBtn = document.getElementById("theme");
  try {
    if (localStorage.getItem("aqua-theme") === "dark") document.documentElement.classList.add("dark");
  } catch (err) {}
  themeBtn.addEventListener("click", function () {
    document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("aqua-theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
    } catch (err) {}
  });

  var today = new Date().toISOString().slice(0, 10);
  document.querySelectorAll('input[type="date"]').forEach(function (input) {
    input.min = today;
    if (!input.value && input.name === "in") input.value = today;
  });

  document.getElementById("finder").addEventListener("submit", function (e) {
    e.preventDefault();
    var book = document.getElementById("book");
    if (this.in.value && this.out.value && this.out.value <= this.in.value) {
      this.out.focus();
      return;
    }
    book.in.value = this.in.value;
    book.out.value = this.out.value;
    book.guests.value = this.guests.value;
    document.getElementById("rooms").scrollIntoView({ behavior: "smooth" });
  });

  document.getElementById("book").addEventListener("submit", function (e) {
    e.preventDefault();
    var status = document.getElementById("status");
    if (this.out.value <= this.in.value) {
      status.textContent = "Выезд должен быть позже заезда.";
      return;
    }
    var text = [
      "Заявка в отель Аквамарин",
      "Имя: " + this.name.value.trim(),
      "Телефон: " + this.phone.value.trim(),
      this.email.value.trim() ? "Email: " + this.email.value.trim() : "",
      "Заезд: " + this.in.value,
      "Выезд: " + this.out.value,
      "Гостей: " + this.guests.value,
      "Номер: " + this.room.value,
      this.note.value.trim() ? "Пожелания: " + this.note.value.trim() : ""
    ].filter(Boolean).join("\n");
    var href = "mailto:reservations@zont-club.ru?subject=" + encodeURIComponent("Заявка в отель Аквамарин") + "&body=" + encodeURIComponent(text);
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(function () {});
    window.location.href = href;
    status.textContent = "Откроется письмо в отдел бронирования. Текст заявки также скопирован.";
  });

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nodes = document.querySelectorAll(".facts, .section-head, .room, .space, .offer, .panel, .map-grid > *, .faq details, .contact-grid > *");
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -40px 0px" });
    nodes.forEach(function (node) {
      var delay = 0;
      var parent = node.parentElement;
      if (parent) {
        var group = parent.querySelectorAll(".room, .space, .offer, .faq details");
        for (var i = 0; i < group.length; i++) {
          if (group[i] === node) {
            delay = Math.min(i % 3, 2) * 90;
            break;
          }
        }
      }
      node.classList.add("reveal");
      if (delay) node.style.transitionDelay = delay + "ms";
      io.observe(node);
    });
    window.addEventListener("scroll", function () {
      var hero = document.querySelector(".hero");
      if (!hero) return;
      hero.style.backgroundPosition = "center calc(50% + " + Math.round(window.scrollY * 0.22) + "px)";
    }, { passive: true });
  }
})();
