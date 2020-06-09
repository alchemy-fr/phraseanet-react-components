import React, {Component} from 'react';
import PropTypes from "prop-types";

const host = [
    window.location.protocol,
    '//',
    window.location.hostname,
].join('');

const providerPropShape = PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.oneOf([
        'oauth',
        'saml',
    ]),
})

export default class OAuthProviders extends Component {
    static propTypes = {
        authBaseUrl: PropTypes.string.isRequired,
        authClientId: PropTypes.string.isRequired,
        providers: PropTypes.arrayOf(providerPropShape).isRequired,
        redirectUri: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.string,
        ]),
    };

    render() {
        const {
            redirectUri,
            authBaseUrl,
            authClientId,
            providers,
        } = this.props;

        const redirectUriGenerator = typeof redirectUri === 'function'
            ? redirectUri
            : (provider) => `${redirectUri || `${host}/auth`}/${provider.name}`;

        return <div>
            {providers.map((provider) => {
                const redirectUri = redirectUriGenerator(provider);
                const authorizeUrl = `${authBaseUrl}/${provider.type}/${provider.name}/authorize?redirect_uri=${encodeURIComponent(redirectUri)}&client_id=${authClientId}`;

                return <div
                    key={provider.name}
                >
                    <a href={authorizeUrl}>Connect with {provider.title}</a>
                </div>
            })}
        </div>
    }
}
