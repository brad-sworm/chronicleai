const axios = require('axios');


const apiKey = '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';

const getCompletion = async () => {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello, how are you?' }]
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    console.log(response.data); // Log the entire response
    const message = response.data.choices[0]?.message?.content?.trim();
    console.log(message);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

getCompletion();


getCompletion();
