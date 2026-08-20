const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-nav]");
const year = document.querySelector("[data-year]");

if (year) {
  year.textContent = new Date().getFullYear();
}

/* Cabeçalho durante a rolagem */

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 16);
};

updateHeader();

window.addEventListener("scroll", updateHeader, {
  passive: true
});

/* Menu para dispositivos móveis */

if (menuToggle && navigation) {
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    navigation.classList.remove("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Abrir menu" : "Fechar menu"
    );

    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      !navigation.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });
}

/* Galeria ampliável das áreas de atuação */

const galleryPhotos = [
  ...document.querySelectorAll(".area-gallery .area-photo")
];

if (galleryPhotos.length > 0) {
  const lightbox = document.createElement("dialog");

  lightbox.className = "image-lightbox";
  lightbox.setAttribute(
    "aria-label",
    "Visualização ampliada da imagem"
  );

  lightbox.innerHTML = `
    <div class="lightbox-frame">
      <button
        class="lightbox-close"
        type="button"
        aria-label="Fechar imagem"
      >
        ×
      </button>

      <button
        class="lightbox-nav lightbox-previous"
        type="button"
        aria-label="Imagem anterior"
      >
        ‹
      </button>

      <figure class="lightbox-figure">
        <img
          class="lightbox-image"
          alt=""
        >

        <figcaption
          class="lightbox-caption"
          aria-live="polite"
        ></figcaption>
      </figure>

      <button
        class="lightbox-nav lightbox-next"
        type="button"
        aria-label="Próxima imagem"
      >
        ›
      </button>
    </div>
  `;

  document.body.append(lightbox);

  const lightboxImage =
    lightbox.querySelector(".lightbox-image");

  const lightboxCaption =
    lightbox.querySelector(".lightbox-caption");

  const closeButton =
    lightbox.querySelector(".lightbox-close");

  const previousButton =
    lightbox.querySelector(".lightbox-previous");

  const nextButton =
    lightbox.querySelector(".lightbox-next");

  let currentGallery = [];
  let currentIndex = 0;

  const updateLightbox = () => {
    const currentLink = currentGallery[currentIndex];
    const currentImage = currentLink?.querySelector("img");

    if (!currentLink || !currentImage) {
      return;
    }

    lightboxImage.src = currentLink.href;
    lightboxImage.alt =
      currentImage.alt || "Imagem ampliada do projeto";

    lightboxCaption.textContent =
      currentImage.alt || "Imagem do projeto";

    const hasMultipleImages = currentGallery.length > 1;

    previousButton.hidden = !hasMultipleImages;
    nextButton.hidden = !hasMultipleImages;
  };

  const openLightbox = (selectedLink) => {
    const selectedGallery =
      selectedLink.closest(".area-gallery");

    currentGallery = [
      ...selectedGallery.querySelectorAll(".area-photo")
    ];

    currentIndex = currentGallery.indexOf(selectedLink);

    updateLightbox();

    document.body.classList.add("lightbox-open");
    lightbox.showModal();
  };

  const closeLightbox = () => {
    if (lightbox.open) {
      lightbox.close();
    }
  };

  galleryPhotos.forEach((photo) => {
    photo.addEventListener("click", (event) => {
      event.preventDefault();
      openLightbox(photo);
    });
  });

  closeButton.addEventListener("click", closeLightbox);

  previousButton.addEventListener("click", () => {
    currentIndex =
      (currentIndex - 1 + currentGallery.length) %
      currentGallery.length;

    updateLightbox();
  });

  nextButton.addEventListener("click", () => {
    currentIndex =
      (currentIndex + 1) % currentGallery.length;

    updateLightbox();
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

lightbox.addEventListener("close", () => {
  document.body.classList.remove("lightbox-open");
  lightboxImage.removeAttribute("src");
  lightboxImage.alt = "";
  lightboxCaption.textContent = "";
});

  document.addEventListener("keydown", (event) => {
    if (!lightbox.open) {
      return;
    }

    if (event.key === "ArrowLeft") {
      previousButton.click();
    }

    if (event.key === "ArrowRight") {
      nextButton.click();
    }
  });
}