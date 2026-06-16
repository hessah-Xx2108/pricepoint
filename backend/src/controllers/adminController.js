const { PriceSubmission, User, Product, Store } = require('../models');

const getPendingSubmissions = async (req, res) => {
  try {
    const submissions = await PriceSubmission.findAll({
      where: { Status: 'pending' },
      include: [
        { model: User, attributes: ['User_ID', 'Name', 'Email'] },
        { model: Product, attributes: ['Product_ID', 'Product_Name'] },
        { model: Store, attributes: ['Store_ID', 'Store_Name'] }
      ],
      order: [['Submission_Time', 'ASC']]
    });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const approveSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await PriceSubmission.findByPk(id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    submission.Status = 'approved';
    await submission.save();

    res.json({ message: 'Submission approved' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const rejectSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await PriceSubmission.findByPk(id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    submission.Status = 'rejected';
    await submission.save();

    res.json({ message: 'Submission rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getPendingSubmissions, approveSubmission, rejectSubmission };