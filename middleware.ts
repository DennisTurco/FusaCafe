import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  const username = process.env.STUDIO_USERNAME;
  const password = process.env.STUDIO_PASSWORD;
  const authHeader = request.headers.get('Authorization');

  // If the Authorization header is missing or incorrect, return 401 with WWW-Authenticate
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    const response = new NextResponse('Unauthorized', { status: 401 });
    response.headers.set('WWW-Authenticate', 'Basic realm="Protected Area"');
    return response;
  }

  // Decode the base64-encoded credentials
  const base64Credentials = authHeader.split(' ')[1];
  const decodedCredentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [providedUsername, providedPassword] = decodedCredentials.split(':');

  // Check if the credentials are correct
  if (providedUsername === username && providedPassword === password) {
    return NextResponse.next(); // Proceed with the request if authenticated
  }

  // If the credentials are wrong, return 401 Unauthorized
  return new NextResponse('Unauthorized', { status: 401 });
}

export const config = {
  matcher: ['/studio/:path*'],
};
