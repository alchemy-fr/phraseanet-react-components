
export const baseUrl = [
    window.location.protocol,
    '//',
    window.location.host,
].join('');

export function createAuthorizeUrl(authBaseUrl, clientId, redirectPath = '/auth') {
    const redirectUri = `${redirectPath.indexOf('/') === 0 ? baseUrl : ''}${redirectPath}`;
    const queryString = `response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}`;

    return `${authBaseUrl}/oauth/v2/auth?${queryString}`;
}
