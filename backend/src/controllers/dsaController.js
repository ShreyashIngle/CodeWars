import DsaTopic from '../models/DsaTopic.js';

// Create a new DSA topic
export const createTopic = async (req, res) => {
  try {
    const { name, description } = req.body;
    const topic = new DsaTopic({
      name,
      description,
      createdBy: req.userId
    });
    await topic.save();
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Error creating topic', error: error.message });
  }
};

// Get all topics
export const getTopics = async (req, res) => {
  try {
    const topics = await DsaTopic.find({ createdBy: req.userId });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching topics', error: error.message });
  }
};

// Add question to topic
export const addQuestion = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { title, link, platform, difficulty } = req.body;
    
    const topic = await DsaTopic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    topic.questions.push({
      title,
      link,
      platform,
      difficulty,
      addedBy: req.userId
    });

    await topic.save();
    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Error adding question', error: error.message });
  }
};

// Delete question from topic
export const deleteQuestion = async (req, res) => {
  try {
    const { topicId, questionId } = req.params;
    
    const topic = await DsaTopic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    topic.questions = topic.questions.filter(q => q._id.toString() !== questionId);
    await topic.save();
    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting question', error: error.message });
  }
};

// Delete topic
export const deleteTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    await DsaTopic.findByIdAndDelete(topicId);
    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting topic', error: error.message });
  }
};