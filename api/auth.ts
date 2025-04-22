import { NextApiRequest, NextApiResponse } from 'next';

// This is a mock API key - in production, you should use a secure key
const API_KEY = 'your-secure-api-key-123';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message, address, signature } = req.body;

    // In a real application, you would verify the signature here
    // For demo purposes, we'll just return a success response
    const auth_token = `demo-token-${Date.now()}`;

    return res.status(200).json({
      status: true,
      auth_token,
      message: 'Authentication successful'
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Authentication failed'
    });
  }
} 