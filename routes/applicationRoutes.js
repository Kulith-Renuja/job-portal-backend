const express = require('express');
const multer = require('multer');
const { submitApplication } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

function candidateOnly(req, res, next) {
if (req.user?.role !== 'user') {
return res.status(403).json({ message: 'Only candidates can apply' });
}
next();
}

const upload = multer({
storage: multer.memoryStorage(),
limits: { fileSize: 5 * 1024 * 1024 },
fileFilter: (req, file, cb) => {
const ok = [
'application/pdf',
'application/msword',
'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
].includes(file.mimetype);
cb(ok ? null : new Error('Invalid file type (PDF/DOC/DOCX only)'), ok);
}
});

// Submit job application (login required; candidate only)
router.post('/', protect, candidateOnly, upload.single('cv'), submitApplication);

// (Optional) If you’re not storing applications, consider removing or stubbing these:
// router.get('/job/:jobId', protect, (req, res) => res.status(501).json({ message: 'Not implemented' }));
// router.get('/company/:companyId/filtered', protect, (req, res) => res.status(501).json({ message: 'Not implemented' }));

module.exports = router;