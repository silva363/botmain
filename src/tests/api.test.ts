import { describe, expect, it } from '@jest/globals';
import { GET } from '@/app/api/test/verifyStatus/route';

describe('Testing api request', () => {
  it('Get route', async () => {
    const response = await GET();
    expect(response.status).toEqual(200);
  });
});
