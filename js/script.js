/* =========================================================
   DM VISUAL
   script.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       HEADER AL HACER SCROLL
    ===================================================== */

    const header = document.getElementById("header");

    const updateHeader = () => {
        if (!header) return;

        if (window.scrollY > 30) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader);


    /* =====================================================
       MENÚ MÓVIL
    ===================================================== */

    const menuToggle = document.getElementById("menuToggle");
    const nav = document.getElementById("nav");
    const navLinks = document.querySelectorAll(".nav__link");

    if (menuToggle && nav) {

        menuToggle.addEventListener("click", () => {

            const isOpen = nav.classList.toggle("active");

            menuToggle.classList.toggle("active", isOpen);
            menuToggle.setAttribute("aria-expanded", isOpen);

        });

        navLinks.forEach(link => {

            link.addEventListener("click", () => {

                nav.classList.remove("active");
                menuToggle.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");

            });

        });

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

            const isOpen = item.classList.contains("active");

            /*
             * Cerramos los demás FAQ.
             * Así solamente queda uno abierto.
             */
            faqItems.forEach(otherItem => {

                const otherQuestion =
                    otherItem.querySelector(".faq-item__question");

                const otherAnswer =
                    otherItem.querySelector(".faq-item__answer");

                otherItem.classList.remove("active");

                if (otherQuestion) {
                    otherQuestion.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }

                if (otherAnswer) {
                    otherAnswer.style.maxHeight = null;
                }

            });


            /*
             * Si el que tocamos estaba cerrado,
             * lo abrimos.
             */
            if (!isOpen) {

                item.classList.add("active");

                question.setAttribute(
                    "aria-expanded",
                    "true"
                );

                answer.style.maxHeight =
                    answer.scrollHeight + "px";

            }

        });

    });


    /* =====================================================
       FILTROS DEL PORTAFOLIO
    ===================================================== */

    const filters =
        document.querySelectorAll(".portfolio-filter");

    const projects =
        document.querySelectorAll(".project-card");

    filters.forEach(filter => {

        filter.addEventListener("click", () => {

            const selectedFilter =
                filter.dataset.filter;

            filters.forEach(button => {
                button.classList.remove("active");
            });

            filter.classList.add("active");


            projects.forEach(project => {

                const category =
                    project.dataset.category;

                if (
                    selectedFilter === "all" ||
                    selectedFilter === category
                ) {

                    project.classList.remove("hidden");

                } else {

                    project.classList.add("hidden");

                }

            });

        });

    });


    /* =====================================================
       FORMULARIO → WHATSAPP
    ===================================================== */

    const contactForm =
        document.getElementById("contactForm");

    if (contactForm) {

        contactForm.addEventListener("submit", event => {

            event.preventDefault();

            const name =
                document.getElementById("name").value.trim();

            const business =
                document.getElementById("business").value.trim();

            const service =
                document.getElementById("service");

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
                "https://wa.me/50671876934?text=" +
                encodeURIComponent(whatsappMessage);


            window.open(
                whatsappURL,
                "_blank",
                "noopener,noreferrer"
            );

        });

    }


    /* =====================================================
       AÑO AUTOMÁTICO
    ===================================================== */

    const currentYear =
        document.getElementById("currentYear");

    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       ANIMACIONES AL HACER SCROLL
    ===================================================== */

    const revealElements =
        document.querySelectorAll(
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

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach(element => {
            observer.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    }

});