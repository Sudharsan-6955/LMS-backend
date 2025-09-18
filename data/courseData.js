const authorData = require("./authorData");

const courseData = [
    {
        _id: "64ab1f1f1a2b3c4d5e6f7002",
        id: "html-beginners",
        title: "HTML for Beginners",
        imgUrl: "assets/images/course/01.jpg",
        imgAlt: "course thumb edublink",
        description: "Learn HTML from scratch in this beginner-friendly course. Build your first web pages and understand HTML elements.",
        author: "Alice Ray",
        authorDetails: authorData["Alice Ray"],
        reviewCount: "8 reviews",
        videoLink: "https://www.youtube-nocookie.com/embed/jP649ZHA8Tg",
        categoryList: [
            { link: "", text: "HTML", className: "course-cate" },
            { link: "#", text: "Free", className: "course-offer" }
        ],
        overview: [
            "Understand the structure of HTML documents.",
            "Use headings, paragraphs, links, images, and lists.",
            "Build your first multi-page website."
        ],
        whatYouWillLearn: [
            "How to structure HTML pages using semantic tags.",
            "How to use common HTML elements like tables, forms, and multimedia.",
            "Build a complete responsive website with only HTML."
        ],
        videoContent: [
            {
                title: "Introduction",
                duration: "10:00",
                lessons: [
                    {
                        title: "Getting Started with HTML",
                        videoUrl: "https://www.youtube.com/embed/pQN-pnXPaVg",
                        duration: "4:30"
                    },
                    {
                        title: "Creating Your First Web Page",
                        videoUrl: "https://www.youtube.com/embed/abc",
                        duration: "5:30"
                    }
                ]
            }
        ],
        price: 0,
        isPaid: false,
        level: "Beginner",
        duration: "2h 30m",
        classes: "5 sessions",
        cate: "Frontend",
        skill: "Beginner",
        category: "HTML",
        lessons: 6,
        quizzes: 2,
        passPercentage: 70,
        certificate: "Yes",
        language: "English"
    },
    {
        _id: "64ab1f1f1a2b3c4d5e6f7001",
        id: "css-beginners",
        title: "CSS for Beginners",
        imgUrl: "assets/images/course/02.jpg",
        imgAlt: "course thumb edublink",
        description: "A step-by-step introduction to CSS. Learn to style your web pages and create visually appealing layouts.",
        author: "Kari Khalan",
        authorDetails: authorData["Kari khalan"],
        reviewCount: "8 reviews",
        videoLink: "https://www.youtube-nocookie.com/embed/jP649ZHA8Tg",
        categoryList: [
            { link: "", text: "CSS", className: "course-cate" },
            { link: "#", text: "Paid", className: "course-offer" }
        ],
        overview: [
            "Learn the fundamentals of CSS syntax and selectors.",
            "Understand the box model, positioning, and display properties.",
            "Use Flexbox and Grid to create responsive layouts."
        ],
        whatYouWillLearn: [
            "How to apply styles using selectors, properties, and values.",
            "Create visually consistent layouts with Flexbox and Grid.",
            "Style forms, buttons, and navigation bars effectively."
        ],
        videoContent: [
            {
                title: "CSS Basics",
                duration: "12:00",
                lessons: [
                    {
                        title: "CSS Syntax and Selectors",
                        videoUrl: "https://www.youtube.com/embed/1PnVor36_40",
                        duration: "6:00"
                    },
                    {
                        title: "Working with Flexbox",
                        videoUrl: "https://www.youtube.com/embed/fYq5PXgSsbE",
                        duration: "6:00"
                    }
                ]
            }
        ],
        price: 0,
        isPaid: false,
        level: "Beginner",
        duration: "3h 00m",
        classes: "6 sessions",
        cate: "Frontend",
        skill: "Advance",
        category: "CSS",
        lessons: 6,
        lessons: 8,
        quizzes: 3,
        passPercentage: 75,
        certificate: "Yes",
        language: "Tamil"
    }
];

module.exports = courseData;
