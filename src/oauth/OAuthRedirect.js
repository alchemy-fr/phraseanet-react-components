import {PureComponent} from 'react';
import qs from 'querystring';
import PropTypes from "prop-types";

export default class OAuthRedirect extends PureComponent {
    static propTypes = {
        oauthClient: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    handleSuccess = () => {
        this.props.history.push('/');
    };

    handleError = (e) => {
        console.error(e);
        alert(e);
        this.props.history.push('/');
    };

    componentDidMount() {
        const {oauthClient} = this.props;

        oauthClient
            .getAccessTokenFromAuthCode(
                this.getCode(),
                window.location.href.split('?')[0]
            )
            .then(this.handleSuccess, this.handleError)
        ;
    }

    getCode() {
        return qs.parse(this.props.location.search.substring(1)).code;
    }

    render() {
        return 'Loading...';
    }
}
