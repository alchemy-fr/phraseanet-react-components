import React, {Component} from 'react';
import config from "../../config";
import PropTypes from "prop-types";

const host = [
    window.location.protocol,
    '//',
    window.location.hostname,
].join('');

export default class OAuthProviders extends Component {
    static propTypes = {
        authBaseUrl: PropTypes.string.isRequired,
    };

    render() {
        return (
            <div>
                {config.get('identityProviders').map((provider) => {
                    const redirectUri = `${host}/auth/${provider.name}`;
                    const authorizeUrl = `${config.getAuthBaseURL()}/${provider.type}/${provider.name}/authorize?redirect_uri=${encodeURIComponent(redirectUri)}&client_id=${config.getClientCredential().clientId}`;

                    return <div
                        key={provider.name}
                    >
                        <a href={authorizeUrl}>Connect with {provider.title}</a>
                    </div>
                })}
            </div>
        );
    }
}
