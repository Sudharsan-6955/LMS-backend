const express = require('express');
const router = express.Router();
const multer = require('multer');
const { enrollInCourse, deleteCourse, createCourse } = require('../controllers/courseController');
const Course = require('../models/CourseDetail');
const Category = require('../models/Category');
const adminAuth = require('../middleware/adminAuth');

// Get all courses (for instructor stats)
router.get('/all', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all courses' });
  }
});

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Enroll in course
router.post('/enroll', enrollInCourse);

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 }); // Remove .limit(6)
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching course' });
  }
});

// Edit (update) a course
router.put('/:id', adminAuth, async (req, res) => {
  try {
    // Only update fields that exist in the schema
    const updateFields = { ...req.body };
    // Optionally, remove fields you don't want to update
    delete updateFields._id;
    const updated = await Course.findByIdAndUpdate(req.params.id, updateFields, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Course not found' });
    res.json({ success: true, message: 'Course updated successfully', course: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating course', error: err.message });
  }
});

// ✅ Create course with full schema support
router.post('/create', adminAuth, async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: 'Title and category are required' });
    }

    const trimmedCategory = category.trim();
    // Minimal logging: show received category (always)
    console.log(`[Category] Received: '${trimmedCategory}'`);

    // Verbose request-body keys only when DEBUG=true
    if (process.env.DEBUG === 'true') {
      console.log('[Category Debug] Request body keys:', Object.keys(req.body));
    }

    // create course
    let newCourse;
    try {
      newCourse = new Course({ ...req.body, category: trimmedCategory });
      await newCourse.save();
      // concise success log
      console.log(`[Course] Created id=${newCourse._id} category='${trimmedCategory}'`);
    } catch (saveErr) {
      console.error('[Course Save Error]', saveErr.message);
      return res.status(500).json({
        message: 'Failed to save course',
        error: saveErr.message,
        name: saveErr.name,
        errors: saveErr.errors || null,
        stack: process.env.NODE_ENV !== 'production' ? saveErr.stack : undefined
      });
    }

    // Robust numeric count update (handles string counts in DB)
    try {
      const existingCategory = await Category.findOne({ title: trimmedCategory });

      if (existingCategory) {
        let currentCount = Number(existingCategory.count);
        if (isNaN(currentCount)) currentCount = 0;
        const newCount = currentCount + 1;

        const updated = await Category.findOneAndUpdate(
          { title: trimmedCategory },
          { $set: { count: newCount } },
          { new: true }
        );

        // concise category count log
        console.log(`[Category] '${trimmedCategory}' count: ${updated.count}`);
        if (process.env.DEBUG === 'true') {
          console.log(`[Category Debug] Updated from ${currentCount} to ${updated.count}`);
        }
      } else {
        // create category document with numeric count
        const created = await Category.create({ title: trimmedCategory, imgUrl: '', imgAlt: '', count: 1 });
        console.log(`[Category] Created '${trimmedCategory}' count: 1`);
        if (process.env.DEBUG === 'true') {
          console.log('[Category Debug] Created document:', created);
        }
      }
    } catch (catErr) {
      console.error('[Category Update Error]', catErr.message);
      return res.status(500).json({
        message: 'Course saved but failed to update category count',
        course: newCourse,
        error: catErr.message,
        stack: process.env.NODE_ENV !== 'production' ? catErr.stack : undefined
      });
    }

    res.status(201).json({ message: 'Course added successfully', course: newCourse });
  } catch (err) {
    console.error('Error adding course:', err.message);
    res.status(500).json({
      message: 'Failed to add course',
      error: err.message,
      stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    });
  }
});

// Delete course
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (course) {
      try {
        const existingCategory = await Category.findOne({ title: course.category });
        if (existingCategory) {
          let currentCount = Number(existingCategory.count);
          if (isNaN(currentCount)) currentCount = 0;
          const newCount = Math.max(0, currentCount - 1);
          const updated = await Category.findOneAndUpdate(
            { title: course.category },
            { $set: { count: newCount } },
            { new: true }
          );
          console.log(`[Category Count] Decremented '${course.category}' from ${currentCount} to ${updated.count}`);
        } else {
          console.log(`[Category Count] Category '${course.category}' not found when deleting course`);
        }
      } catch (catErr) {
        console.error('[Category Decrement Error]', catErr);
      }
    }
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error('Error deleting course:', err);
    res.status(500).json({ message: 'Error deleting course', error: err.message });
  }
});

// ✅ Get distinct values for a given field
router.get('/distinct/:field', async (req, res) => {
  try {
    const field = req.params.field;
    const values = await Course.distinct(field);
    res.json(values);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching distinct values' });
  }
});

// ✅ Test endpoint to manually check and update category counts
router.get('/test-categories', async (req, res) => {
  try {
    const allCategories = await Category.find({});
    console.log('All categories in database:', allCategories);
    
    // Count actual courses for each category
    const courseCounts = await Course.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    
    console.log('Actual course counts by category:', courseCounts);
    
    res.json({ 
      categories: allCategories,
      actualCounts: courseCounts
    });
  } catch (err) {
    res.status(500).json({ message: 'Error testing categories', error: err.message });
  }
});

// ✅ Manual sync endpoint to fix category counts
router.post('/sync-category-counts', adminAuth, async (req, res) => {
  try {
    // Get actual course counts (category names -> numeric count)
    const courseCounts = await Course.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    // Update each category with correct numeric count
    for (const courseCount of courseCounts) {
      await Category.findOneAndUpdate(
        { title: courseCount._id },
        { $set: { count: courseCount.count } },
        { new: true }
      );
      console.log(`Synced ${courseCount._id}: ${courseCount.count}`);
    }

    // Reset categories with no courses to 0 (numeric)
    await Category.updateMany(
      { title: { $nin: courseCounts.map(c => c._id) } },
      { $set: { count: 0 } }
    );

    res.json({ message: 'Category counts synced successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error syncing category counts', error: err.message });
  }
});

// Add a manual category count reset endpoint for testing
router.post('/reset-category-counts', adminAuth, async (req, res) => {
  try {
    // Reset all category counts to 0 (numeric)
    await Category.updateMany({}, { $set: { count: 0 } });

    // Get actual course counts
    const courseCounts = await Course.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    console.log(`[Reset Debug] Actual course counts:`, courseCounts);

    // Update each category with correct numeric count
    for (const courseCount of courseCounts) {
      const result = await Category.updateOne(
        { title: courseCount._id },
        { $set: { count: courseCount.count } }
      );
      console.log(`[Reset Debug] Updated ${courseCount._id}: ${courseCount.count}, result:`, result);
    }

    // Show final counts
    const finalCategories = await Category.find({}, 'title count');
    console.log(`[Reset Debug] Final category counts:`, finalCategories);

    res.json({
      message: 'Category counts reset and synced successfully',
      categories: finalCategories
    });
  } catch (err) {
    console.error('Error resetting category counts:', err);
    res.status(500).json({ message: 'Error resetting category counts', error: err.message });
  }
});

module.exports = router;



