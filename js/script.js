/* =========================================================
   DM VISUAL
   script.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONSTANTES
    ===================================================== */

    // Cambiá el número aquí y se actualiza en el formulario.
    const WHATSAPP_NUMBER = "50671876934";

    // Debe coincidir con el @media del CSS del menú móvil.
    const MOBILE_BREAKPOINT = 900;

    const body = document.body;


    /* =====================================================
       HEADER AL HACER SCROLL
    ===================================================== */

    const header = document.getElementById("header");

    const updateHeader = () => {
        if (!header) return;
        header.classList.toggle("scrolled", window.scrollY > 30);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });


    /* =====================================================
       MENÚ MÓVIL
    ===================================================== */

    const menuToggle = document.getElementById("menuToggle");
    const nav = document.getElementById("nav");
    const navLinks = document.querySelectorAll(".nav__link");

    const setMenu = open => {
        if (!menuToggle || !nav) return;

        nav.classList.toggle("active", open);
        menuToggle.classList.toggle("active", open);
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute(
            "aria-label",
            open ? "Cerrar menú" : "Abrir menú"
        );
        body.classList.toggle("menu-open", open);
    };

    if (menuToggle && nav) {

        menuToggle.addEventListener("click", () => {
            setMenu(!nav.classList.contains("active"));
        });

        navLinks.forEach(link => {
            link.addEventListener("click", () => setMenu(false));
        });

        // Tocar fuera del panel lo cierra
        document.addEventListener("click", event => {
            if (!nav.classList.contains("active")) return;

            if (
                !nav.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                setMenu(false);
            }
        });

        // Si se agranda la pantalla, se restablece el menú
        window.addEventListener("resize", () => {
            if (
                window.innerWidth > MOBILE_BREAKPOINT &&
                nav.classList.contains("active")
            ) {
                setMenu(false);
            }
        });

    }


    /* =====================================================
       LINK ACTIVO SEGÚN LA SECCIÓN VISIBLE
    ===================================================== */

    const spyLinks = new Map();

    navLinks.forEach(link => {
        const href = link.getAttribute("href");

        if (href && href.startsWith("#") && href.length > 1) {
            spyLinks.set(href.slice(1), link);
        }
    });

    const setActiveLink = id => {
        spyLinks.forEach((link, key) => {
            const isActive = key === id;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "true");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    };

    const spySections = document.querySelectorAll("main section[id]");

    if ("IntersectionObserver" in window && spySections.length) {

        // La sección que cruza la línea del centro de la pantalla es la activa.
        // Las secciones que no están en el menú (proceso, faq) apagan el resaltado.
        const spyObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveLink(entry.target.id);
                    }
                });
            },
            { rootMargin: "-45% 0px -50% 0px" }
        );

        spySections.forEach(section => spyObserver.observe(section));

    }


    /* =====================================================
       FAQ
    ===================================================== */

    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {

        const question = item.querySelector(".faq-item__question");
        const answer = item.querySelector(".faq-item__answer");

        if (!question || !answer) return;

        question.addEventListener("click", () => {

            const wasOpen = item.classList.contains("active");

            // Solo queda una respuesta abierta a la vez
            faqItems.forEach(otherItem => {

                const otherQuestion =
                    otherItem.querySelector(".faq-item__question");

                const otherAnswer =
                    otherItem.querySelector(".faq-item__answer");

                otherItem.classList.remove("active");

                if (otherQuestion) {
                    otherQuestion.setAttribute("aria-expanded", "false");
                }

                if (otherAnswer) {
                    otherAnswer.style.maxHeight = null;
                }

            });

            if (!wasOpen) {
                item.classList.add("active");
                question.setAttribute("aria-expanded", "true");
                answer.style.maxHeight = answer.scrollHeight + "px";
            }

        });

    });

    // Si cambia el ancho (girar el celular), recalculamos la altura abierta
    window.addEventListener("resize", () => {
        const openAnswer = document.querySelector(
            ".faq-item.active .faq-item__answer"
        );

        if (openAnswer) {
            openAnswer.style.maxHeight = openAnswer.scrollHeight + "px";
        }
    });


    /* =====================================================
       FILTROS DEL PORTAFOLIO
    ===================================================== */

    const filters = document.querySelectorAll(".portfolio-filter");
    const projects = document.querySelectorAll(".project-card");

    filters.forEach(filter => {
        filter.setAttribute(
            "aria-pressed",
            String(filter.classList.contains("active"))
        );
    });

    filters.forEach(filter => {

        filter.addEventListener("click", () => {

            const selectedFilter = filter.dataset.filter;

            filters.forEach(button => {
                const isCurrent = button === filter;

                button.classList.toggle("active", isCurrent);
                button.setAttribute("aria-pressed", String(isCurrent));
            });

            projects.forEach(project => {
                const matches =
                    selectedFilter === "all" ||
                    selectedFilter === project.dataset.category;

                project.classList.toggle("hidden", !matches);
            });

        });

    });


    /* =====================================================
       MODAL DEL PORTAFOLIO
    ===================================================== */

    const modal = document.getElementById("projectModal");

    if (modal) {

        const modalGallery = document.getElementById("projectModalGallery");
        const modalCategory = document.getElementById("projectModalCategory");
        const modalTitle = document.getElementById("projectModalTitle");
        const modalDescription =
            document.getElementById("projectModalDescription");
        const modalLink = document.getElementById("projectModalLink");
        const modalClose = modal.querySelector(".project-modal__close");

        let lastFocused = null;

        const openModal = card => {

            const image = card.querySelector(".project-card__image img");
            const category = card.querySelector(".project-card__info span");
            const heading = card.querySelector(".project-card__info h3");
            const siteLink = card.querySelector(".project-card__button");

            const titleText = heading ? heading.textContent.trim() : "Proyecto";

            // Imagen
            modalGallery.replaceChildren();

            if (image) {
                const modalImage = document.createElement("img");
                modalImage.src = image.currentSrc || image.src;
                modalImage.alt = image.alt;
                modalGallery.appendChild(modalImage);
            }

            // Texto. Si la tarjeta tiene data-description se usa esa;
            // si no, se usa el texto alternativo de la imagen.
            modalCategory.textContent =
                category ? category.textContent.trim() : "";

            modalTitle.textContent = titleText;

            modalDescription.textContent =
                card.dataset.description || (image ? image.alt : "");

            // Botón "Visitar sitio" solo en proyectos web
            if (siteLink) {
                modalLink.href = siteLink.href;
                modalLink.setAttribute(
                    "aria-label",
                    "Visitar sitio web de " + titleText
                );
                modalLink.hidden = false;
            } else {
                modalLink.hidden = true;
                modalLink.removeAttribute("href");
                modalLink.removeAttribute("aria-label");
            }

            lastFocused = document.activeElement;

            modal.classList.add("active");
            modal.setAttribute("aria-hidden", "false");
            body.classList.add("modal-open");

            modalClose.focus({ preventScroll: true });

        };

        const closeModal = () => {

            if (!modal.classList.contains("active")) return;

            modal.classList.remove("active");
            modal.setAttribute("aria-hidden", "true");
            body.classList.remove("modal-open");

            if (lastFocused && typeof lastFocused.focus === "function") {
                lastFocused.focus({ preventScroll: true });
            }

        };

        // Cada tarjeta recibe un botón que abre su modal.
        // Se agrega por JS para que sin JavaScript la página siga funcionando.
        projects.forEach(card => {

            const imageBox = card.querySelector(".project-card__image");
            const image = imageBox
                ? imageBox.querySelector("img")
                : null;
            const heading = card.querySelector(".project-card__info h3");

            if (!imageBox || !image) return;

            const openButton = document.createElement("button");

            openButton.type = "button";
            openButton.className = "project-card__open";
            openButton.setAttribute("aria-haspopup", "dialog");
            openButton.setAttribute(
                "aria-label",
                "Ver detalles de " +
                (heading ? heading.textContent.trim() : "este proyecto")
            );

            openButton.addEventListener("click", () => openModal(card));

            // Va justo después de la imagen, debajo del overlay,
            // para que el link "Visitar sitio" siga siendo clicable.
            image.after(openButton);

        });

        // Cerrar con la X o con el fondo oscuro
        modal.addEventListener("click", event => {
            if (event.target.closest("[data-close-modal]")) {
                closeModal();
            }
        });

        document.addEventListener("keydown", event => {

            if (!modal.classList.contains("active")) return;

            if (event.key === "Escape") {
                closeModal();
                return;
            }

            // Mantener el foco dentro del modal
            if (event.key === "Tab") {

                const focusable = modal.querySelectorAll(
                    "a[href]:not([hidden]), button:not([disabled])"
                );

                if (!focusable.length) return;

                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }

            }

        });

    }

    // Escape también cierra el menú móvil
    document.addEventListener("keydown", event => {
        if (
            event.key === "Escape" &&
            nav &&
            nav.classList.contains("active") &&
            !body.classList.contains("modal-open")
        ) {
            setMenu(false);

            if (menuToggle) menuToggle.focus();
        }
    });


    /* =====================================================
       FORMULARIO → WHATSAPP
    ===================================================== */

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {

        contactForm.addEventListener("submit", event => {

            event.preventDefault();

            const name =
                document.getElementById("name").value.trim();

            const business =
                document.getElementById("business").value.trim();

            const service = document.getElementById("service");

            const message =
                document.getElementById("message").value.trim();

            const serviceName =
                service.options[service.selectedIndex].text;


            let whatsappMessage =
`Hola DM Visual 👋

Mi nombre es ${name}.`;

            if (business) {

                whatsappMessage +=
`

Mi negocio/proyecto es:
${business}`;

            }

            whatsappMessage +=
`

Estoy interesado(a) en:
${serviceName}

Sobre mi proyecto:
${message}

Me gustaría recibir información para cotizarlo.`;


            const whatsappURL =
                "https://wa.me/" + WHATSAPP_NUMBER +
                "?text=" + encodeURIComponent(whatsappMessage);

            /*
             * Se abre con un enlace temporal en lugar de window.open():
             * con "noopener", window.open() siempre devuelve null y no se
             * puede saber si el navegador bloqueó la ventana.
             */
            const tempLink = document.createElement("a");

            tempLink.href = whatsappURL;
            tempLink.target = "_blank";
            tempLink.rel = "noopener noreferrer";

            document.body.appendChild(tempLink);
            tempLink.click();
            tempLink.remove();

        });

    }


    /* =====================================================
       AÑO AUTOMÁTICO
    ===================================================== */

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =====================================================
       ANIMACIONES AL HACER SCROLL
    ===================================================== */

    const revealElements = document.querySelectorAll(
        ".section-heading, " +
        ".section-intro, " +
        ".service-card, " +
        ".project-card, " +
        ".plan-card, " +
        ".process-step"
    );

    revealElements.forEach(element => {
        element.classList.add("reveal");
    });

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }

                });

            },
            { threshold: 0.12 }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    }

});
