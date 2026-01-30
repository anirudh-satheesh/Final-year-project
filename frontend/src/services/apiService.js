// API service for communicating with the backend
const getBaseUrl = () => {
  const port = 3000;
  const hostname = window.location.hostname === 'localhost' ? '127.0.0.1' : (window.location.hostname || '127.0.0.1');
  return `http://${hostname}:${port}`;
};

export const apiService = {
  // Generate a learning graph for a subject
  async generateGraph(subject) {
    const baseUrl = getBaseUrl();
    console.log('🟢 [API] generateGraph called with subject:', subject);
    console.log(`🟢 [API] Sending POST request to ${baseUrl}/internal/fetch-graph`);

    const response = await fetch(`${baseUrl}/internal/fetch-graph`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject }),
    });

    console.log('🟢 [API] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [API] generateGraph failed with status:', response.status);
      console.error('❌ [API] Error response:', errorText);
      throw new Error(`Failed to generate graph: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ [API] generateGraph successful');

    return data;
  },

  // Generate a personalized graph based on user skills
  async generatePersonalizedGraph(subject, userSkills = {}) {
    const baseUrl = getBaseUrl();
    console.log('🟢 [API] generatePersonalizedGraph called');
    console.log('📋 [API] Subject:', subject);
    console.log(`🟢 [API] Sending POST request to ${baseUrl}/internal/custom-graph`);

    const response = await fetch(`${baseUrl}/internal/custom-graph`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject, userSkills }),
    });

    console.log('🟢 [API] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [API] generatePersonalizedGraph failed with status:', response.status);
      console.error('❌ [API] Error response:', errorText);
      throw new Error(`Failed to generate personalized graph: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ [API] generatePersonalizedGraph successful');

    return data;
  },

  // Generate a personalized roadmap
  async generateRoadmap(subject, userSkills = {}) {
    const baseUrl = getBaseUrl();
    console.log('🟢 [API] generateRoadmap called');
    console.log('📋 [API] Subject:', subject);
    console.log(`🟢 [API] Sending POST request to ${baseUrl}/internal/fetch-roadmap`);

    const response = await fetch(`${baseUrl}/internal/fetch-roadmap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject, userSkills }),
    });

    console.log('🟢 [API] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [API] generateRoadmap failed with status:', response.status);
      console.error('❌ [API] Error response:', errorText);
      throw new Error(`Failed to generate roadmap: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ [API] generateRoadmap successful');

    return data;
  },

  // Get lesson content for a specific topic
  async getLesson(topicId) {
    const baseUrl = getBaseUrl();
    console.log('🟢 [API] getLesson called for topic:', topicId);
    console.log(`🟢 [API] Sending POST request to ${baseUrl}/internal/fetch-lesson`);

    const response = await fetch(`${baseUrl}/internal/fetch-lesson`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic: topicId }),
    });

    console.log('🟢 [API] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [API] getLesson failed with status:', response.status);
      console.error('❌ [API] Error response:', errorText);
      throw new Error(`Failed to get lesson: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ [API] getLesson successful');

    return data;
  },

  // Interactive assistant for topic validation
  async analyzeTopic(conversation) {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/internal/subject-verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: conversation }),
    });

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.statusText}`);
    }
    return response.json();
  },

  // Get AI-powered topic overview
  async getTopicOverview(topic, subject) {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/internal/topic-overview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, subject }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get topic overview: ${response.statusText}`);
    }
    return response.json();
  },

  // Fetch dynamic assessment questions
  async getAssessment(subject) {
    const baseUrl = getBaseUrl();
    console.log('🟢 [API] getAssessment called for subject:', subject);
    const response = await fetch(`${baseUrl}/internal/fetch-assessment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get assessment: ${response.statusText}`);
    }
    return response.json();
  },
};
