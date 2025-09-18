const Course = require('../models/CourseDetail'); // Mongoose model for Course 

// ✅ Enroll in a course (dummy)
const enrollInCourse = (req, res) => {
    const { userId, courseId } = req.body;

    console.log(`User ${userId} enrolled in course ${courseId}`);

    res.status(200).json({
        success: true,
        message: `User ${userId} successfully enrolled in course ${courseId}`
    });
};

// ✅ Delete a course (Admin only)
const deleteCourse = async (req, res) => {
    const courseId = req.params.id;

    try {
        const deleted = await Course.findByIdAndDelete(courseId);
        if (!deleted) {
            return res.status(404).json({ message: 'Course not found' });
        }
        // Decrement category count
        const Category = require('../models/Category');
        if (deleted.category) {
            let catDoc = await Category.findOne({ title: { $regex: `^${deleted.category}$`, $options: 'i' } });
            if (catDoc) {
                let currentCount = 0;
                if (catDoc.count && !isNaN(parseInt(catDoc.count, 10))) {
                    currentCount = parseInt(catDoc.count, 10);
                }
                catDoc.count = Math.max(currentCount - 1, 0).toString();
                await catDoc.save();
                console.log(`[Category Count] Decremented count for category '${catDoc.title}' to ${catDoc.count}`);
            }
        }
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (err) {
        console.error('❌ Error deleting course:', err.message);
        res.status(500).json({ message: 'Server error while deleting course' });
    }
};

// ✅ Create a new course (Admin only) — modified for full schema
const createCourse = async (req, res) => {
    try {
        const {
            id,
            title,
            imgUrl,
            imgAlt,
            description,
            author,
            authorDetails,
            reviewCount,
            videoLink,
            categoryList,
            overview,
            whatYouWillLearn,
            videoContent,
            price,
            isPaid,
            level,
            duration,
            classes,
            cate,
            skill,
            category,
            lessons,
            quizzes,
            passPercentage,
            certificate,
            language
        } = req.body;

        if (!title || price == null || !imgUrl || !author) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Increment category count (case-insensitive)
        const Category = require('../models/Category');
        if (category) {
            let catDoc = await Category.findOne({ title: { $regex: `^${category}$`, $options: 'i' } });
            if (catDoc) {
                let currentCount = 0;
                if (catDoc.count && !isNaN(parseInt(catDoc.count, 10))) {
                    currentCount = parseInt(catDoc.count, 10);
                }
                catDoc.count = (currentCount + 1).toString();
                await catDoc.save();
                console.log(`[Category Count] Incremented count for category '${catDoc.title}' to ${catDoc.count}`);
            } else {
                // Create new category with count=1
                catDoc = new Category({ title: category, count: "1" });
                await catDoc.save();
                console.log(`[Category Count] Created new category '${category}' with count 1`);
            }
        }

        const newCourse = new Course({
            id,
            title,
            imgUrl,
            imgAlt,
            description,
            author,
            authorDetails,
            reviewCount,
            videoLink,
            categoryList,
            overview,
            whatYouWillLearn,
            videoContent,
            price,
            isPaid,
            level,
            duration,
            classes,
            cate,
            skill,
            category,
            lessons,
            quizzes,
            passPercentage,
            certificate,
            language
        });

        await newCourse.save();

        res.status(201).json({
            success: true,
            message: '✅ Course created successfully',
            course: newCourse
        });
    } catch (err) {
        console.log("REQ BODY:", req.body);
        console.error('❌ Error creating course:', err.message);
        res.status(500).json({ message: 'Server error while creating course' });
    }
};

module.exports = {
    enrollInCourse,
    deleteCourse,
    createCourse
};
