import { jwtVerify } from 'jose';

const secret = process.env.REFRESH_SECRET_KEY;

export default async function verify(request) {
  const refreshToken = request.cookies.get('refresh-token')?.value ?? false;

  if (!refreshToken) {
    return false;
  }

  const authicanted = await jwtVerify(refreshToken, new TextEncoder().encode(secret));

  return authicanted;
}
