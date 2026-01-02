// API service for communicating with the backend
export const apiService = {
  // Generate a learning graph for a subject
  async generateGraph(subject) {
    console.log('🟢 [API] generateGraph called with subject:', subject);
    console.log('🟢 [API] Sending POST request to /api/graph');
    
    const response = await fetch('http://localhost:3000/api/graph', {
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
    console.log('📊 [API] Graph data keys:', Object.keys(data));
    console.log('📊 [API] Has nodes?', Array.isArray(data?.nodes));
    console.log('📊 [API] Has edges?', Array.isArray(data?.edges));
    
    return data;
  },

  // Generate a personalized graph based on user skills
  async generatePersonalizedGraph(subject, userSkills = {}) {
    console.log('🟢 [API] generatePersonalizedGraph called');
    console.log('📋 [API] Subject:', subject);
    console.log('📋 [API] User skills:', JSON.stringify(userSkills, null, 2));
    console.log('🟢 [API] Sending POST request to /api/personalized-graph');
    
    const response = await fetch('http://localhost:3000/api/personalized-graph', {
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
    console.log('📊 [API] Response data keys:', Object.keys(data));
    console.log('📊 [API] Has nodes?', Array.isArray(data?.nodes));
    console.log('📊 [API] Has edges?', Array.isArray(data?.edges));
    
    return data;
  },

  // Generate a personalized roadmap
  async generateRoadmap(subject, userSkills = {}) {
    console.log('🟢 [API] generateRoadmap called');
    console.log('📋 [API] Subject:', subject);
    console.log('📋 [API] User skills:', JSON.stringify(userSkills, null, 2));
    console.log('🟢 [API] Sending POST request to /api/roadmap');
    
    const response = await fetch('http://localhost:3000/api/roadmap', {
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
    console.log('📊 [API] Response data keys:', Object.keys(data));
    console.log('📊 [API] Has items?', Array.isArray(data?.items));
    console.log('📊 [API] Items count:', data?.items?.length);
    
    return data;
  },

  // Get lesson content for a specific topic
  async getLesson(topicId) {
    console.log('🟢 [API] getLesson called for topic:', topicId);
    console.log('🟢 [API] Sending POST request to /api/lesson');
    
    const response = await fetch(`http://localhost:3000/api/lesson`, {
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
    console.log('📊 [API] Lesson title:', data?.title);
    
    return data;
  },
};
