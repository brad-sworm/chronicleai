const express = require('express');
const router = express.Router();
const axios = require('axios');

// Store your API key in a variable for easy management
const apiKey = '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'; // Hardcoded API key

// Endpoint to get mental health strategies
router.post('/mental-health-tips', async (req, res) => {
  const { keywords, sentimentSummary } = req.body;

  // Ensure keywords is an array, if not, log the error
  if (!Array.isArray(keywords)) {
    console.error('Expected keywords to be an array, but got:', typeof keywords);
    return res.status(400).json({ error: 'Keywords must be an array' });
  }

  const keywordFocus = keywords.join(', ');

  try {
    // Use OpenAI to generate a helpful mental health strategy
    const prompt = `
      You are a mental health expert. Based on the following input:
      Keywords: ${keywordFocus}
      Sentiment Summary: ${sentimentSummary}
      Provide a helpful mental health strategy tailored to the user's emotional state and focus areas.
    `;

    const completion = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', // Updated to use gpt-3.5-turbo or gpt-4
        messages: [
          { role: 'system', content: 'You are a helpful assistant providing mental health advice.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`, // Use the hardcoded API key
        }
      }
    );

    const strategy = completion.data.choices[0].message.content.trim();

    res.json({ strategy });
  } catch (error) {
    console.error('Error fetching strategies from OpenAI:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch strategies from OpenAI' });
  }
});

// Endpoint to extract keywords and names from provided text
router.post('/extract-metadata', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', // Updated to use gpt-3.5-turbo or gpt-4
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: `Extract keywords and names from the following text:\n\n${text}\n\nKeywords:\nNames:` }
        ],
        max_tokens: 100,
        temperature: 0.5
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`, // Using the hardcoded API key
        }
      }
    );

    let keywords = [];
    let names = [];

    // Process the OpenAI response to extract keywords and names
    const responseText = openaiResponse.data.choices[0].message.content.trim();
    console.log('OpenAI response content:', responseText);

    const lines = responseText.split('\n');
    let isKeywordsSection = false;
    let isNamesSection = false;

    lines.forEach(line => {
      if (line.startsWith('Keywords:')) {
        isKeywordsSection = true;
        isNamesSection = false;
        keywords.push(...line.replace('Keywords:', '').split(',').map(item => item.trim()));
      } else if (line.startsWith('Names:')) {
        isKeywordsSection = false;
        isNamesSection = true;
        names.push(...line.replace('Names:', '').split(',').map(item => item.trim()));
      } else {
        if (isKeywordsSection) {
          keywords.push(...line.split(',').map(item => item.trim()));
        } else if (isNamesSection) {
          names.push(...line.split(',').map(item => item.trim()));
        }
      }
    });

    // Filter out names from keywords
    keywords = keywords.filter(keyword => !names.includes(keyword));

    console.log('Extracted keywords:', keywords);
    console.log('Extracted names:', names);

    res.json({ keywords, names });

  } catch (error) {
    console.error('Error extracting metadata:', error);
    if (error.response) {
      console.error('API response error:', error.response.data);
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
