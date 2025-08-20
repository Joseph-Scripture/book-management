document.addEventListener("DOMContentLoaded", () => {
  // Chat functionality
  const botToggle = document.getElementById("chatbotToggle");
  const chatWindow = document.getElementById("chatbotWindow");
  const chatContent = document.getElementById("chatbotContent");
  const closeChat = document.querySelector(".close-chat");
  
  // Newsletter functionality
  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterMessage = document.getElementById("newsletter-message");

  // Navigation
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");

  // Scroll-triggered animations
  const sections = document.querySelectorAll("section");
  const header = document.querySelector("header");
  const backToTop = document.getElementById("backToTop");
  
  // Theme toggle functionality
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle.querySelector("i");

  // FAQ Functionality
  const faqQuestions = document.querySelectorAll(".faq-question");
  const faqAnswers = document.querySelectorAll(".faq-answer");

  // Chat Q&A pairs
  const qaPairs = [
    {
      question: "What is ReadQuest?",
      answer:
        "ReadQuest is a modern  platform designed to empower readers and connect readers through engaging content and community features.It is capable of changing the rigid human mindset .",
    },
    {
      question: "How do I start reading?",
      answer:
        "Simply click on 'start Reding' in the navigation menu. You'll be guided through our intuitive reading to reading your favourite book.",
    },
    {
      question: "Is it free to use?",
      answer:
        "Yes! ReadQuest is completely free for both readers and writers. We believe in making quality content accessible to everyone.",
    },
    {
      question: "How can I grow my audience?",
      answer:
        "Engage with the community, read consistently, use relevant tags, and share your content on social media. Our platform helps promote quality content to interested readers.",
    },
    {
      question: "What makes VerbaSphere different?",
      answer:
        "We combine modern technology with a focus on community. Our platform offers advanced writing tools, AI-powered recommendations, and meaningful connections between writers and readers.",
    },
  ];

  // Mobile menu toggle
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
    menuToggle.classList.toggle("active");
  });

  // Chatbot toggle
  botToggle.addEventListener("click", () => {
    chatWindow.style.display =
      chatWindow.style.display === "block" ? "none" : "block";
    loadQuestions();
  });

  closeChat.addEventListener("click", () => {
    chatWindow.style.display = "none";
  });

  // Load chat questions
  function loadQuestions() {
    chatContent.innerHTML = `
            <h4 style="margin-bottom: 1rem;">How can I help you?</h4>
            <div class="chat-questions"></div>
        `;
    const questionsDiv = chatContent.querySelector(".chat-questions");

    qaPairs.forEach((pair) => {
      const button = document.createElement("button");
      button.className = "chat-question-btn";
      button.textContent = pair.question;
      button.style.cssText = `
                display: block;
                width: 100%;
                padding: 0.8rem;
                margin-bottom: 0.5rem;
                background: rgba(104, 223, 227, 0.1);
                border: 1px solid var(--navy);
                color: var(--offwhite);
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: left;
            `;

      button.addEventListener("mouseover", () => {
        button.style.background = "rgba(55, 183, 212, 0.2)";
      });

      button.addEventListener("mouseout", () => {
        button.style.background = "rgba(55, 212, 212, 0.1)";
      });

      button.addEventListener("click", () => {
        showAnswer(pair);
      });

      questionsDiv.appendChild(button);
    });
  }

  // Show chat answer
  function showAnswer(pair) {
    chatContent.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <strong style="color: var(--navy);">Q: ${pair.question}</strong>
                <p style="margin-top: 0.5rem;">${pair.answer}</p>
            </div>
            <button class="back-btn" style="
                background: var(--black);
                color: var(--black);
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 5px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            ">
                <i class="fas fa-arrow-left"></i> Back to questions
            </button>
        `;

    const backBtn = chatContent.querySelector(".back-btn");
    backBtn.addEventListener("click", loadQuestions);
  }

  // FAQ Accordion functionality
  faqQuestions.forEach((question, index) => {
    question.addEventListener("click", function () {
      this.classList.toggle("active");

      // Close all other open FAQs
      faqQuestions.forEach((q, i) => {
        if (i !== index && q.classList.contains("active")) {
          q.classList.remove("active");
          faqAnswers[i].style.display = "none";
        }
      });

      // Toggle current FAQ
      const answer = faqAnswers[index];
      if (answer.style.display === "block") {
        answer.style.display = "none";
      } else {
        answer.style.display = "block";
      }
    });
  });

  // Scroll animations
  const observerOptions = {
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
  });

  // Header scroll effect
  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    // Header effect
    if (currentScroll > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Back to top button
    if (currentScroll > 500) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }

    lastScroll = currentScroll;
  });
  // Smooth scroll to top
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Add active classes to timeline for animation on scroll
  const timelineItems = document.querySelectorAll(".timeline li");
  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    { threshold: 0.5 }
  );

  timelineItems.forEach((item) => {
    timelineObserver.observe(item);
  });

  // Stats counter animation
  const statNumbers = document.querySelectorAll(".stat-number");
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStats(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((stat) => {
    statsObserver.observe(stat);
  });

  function animateStats(statElement) {
    const finalValue = parseInt(statElement.textContent.replace(/\D/g, ""));
    let startValue = 0;
    const duration = 2000;
    const increment = Math.ceil(finalValue / (duration / 20));

    const counter = setInterval(() => {
      startValue += increment;
      if (startValue >= finalValue) {
        statElement.textContent = statElement.textContent.includes("+")
          ? finalValue + "+"
          : finalValue;
        clearInterval(counter);
      } else {
        statElement.textContent = statElement.textContent.includes("+")
          ? startValue + "+"
          : startValue;
      }
    }, 20);
  }

  // Testimonial slider (if there are many testimonials)
  const testimonialCards = document.querySelectorAll(".testimonial-card");
  if (testimonialCards.length > 3) {
    let currentTestimonial = 0;

    function showTestimonials() {
      testimonialCards.forEach((card, index) => {
        // Show 3 testimonials at a time for desktop, 1 for mobile
        const isMobile = window.innerWidth < 768;
        const visibleCount = isMobile ? 1 : 3;

        if (
          index >= currentTestimonial &&
          index < currentTestimonial + visibleCount
        ) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    }

    showTestimonials();

    // Add navigation for testimonials if needed
    window.addEventListener("resize", showTestimonials);
  }

  // Initialize
  chatWindow.style.display = "none";
  // Set initial display for FAQ answers
  faqAnswers.forEach((answer) => {
    answer.style.display = "none";
  });

  // Newsletter form submission
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const emailInput = document.getElementById("footer-email");
      const email = emailInput.value.trim();
      
      if (email) {
        // Simulate form submission
        newsletterMessage.textContent = "Subscribing...";
        newsletterMessage.style.color = "var(--navy)";
        
        // Simulate API call with timeout
        setTimeout(() => {
          emailInput.value = "";
          newsletterMessage.textContent = "Thank you for subscribing!";
          newsletterMessage.style.color = "#4CAF50";
          
          // Animate the message
          newsletterMessage.style.animation = "fadeInUp 0.5s ease forwards";
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            newsletterMessage.style.animation = "fadeOut 0.5s ease forwards";
            setTimeout(() => {
              newsletterMessage.textContent = "";
              newsletterMessage.style.animation = "";
            }, 500);
          }, 3000);
        }, 1000);
      } else {
        newsletterMessage.textContent = "Please enter a valid email address";
        newsletterMessage.style.color = "#f44336";
      }
    });
  }

  // Footer social icon hover effects
  const socialIcons = document.querySelectorAll('.social-icon');
  if (socialIcons.length > 0) {
    socialIcons.forEach(icon => {
      icon.addEventListener('mouseenter', function() {
        this.style.transform = "translateY(-5px) rotate(8deg)";
      });
      
      icon.addEventListener('mouseleave', function() {
        this.style.transform = "translateY(0) rotate(0)";
      });
    });
  }

  // Initialize theme based on user preference or localStorage
  function initializeTheme() {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "light" || (!savedTheme && !prefersDark)) {
      document.body.classList.add("light-mode");
      themeIcon.classList.replace("fa-moon", "fa-sun");
    }
  }
  
  // Toggle between light and dark themes
  function toggleTheme() {
    if (document.body.classList.contains("light-mode")) {
      // Switch to dark mode
      document.body.classList.remove("light-mode");
      themeIcon.classList.replace("fa-sun", "fa-moon");
      localStorage.setItem("theme", "dark");
    } else {
      // Switch to light mode
      document.body.classList.add("light-mode");
      themeIcon.classList.replace("fa-moon", "fa-sun");
      localStorage.setItem("theme", "light");
    }
  }
  
  // Add event listener for theme toggle
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
    initializeTheme();
  }
});
