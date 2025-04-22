import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Generate a random message for signing
    const message = `Sign this message to authenticate with MKR Bot. Nonce: ${Date.now()}`;

    return res.status(200).json({
      message
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to generate sign message'
    });
  }
} 