import React, {PureComponent} from 'react';
import PropTypes from "prop-types";
import {ReactComponent as MenuImg} from './menu.svg';

export default class ServicesMenu extends PureComponent {
    static propTypes = {
        dashboardBaseUrl: PropTypes.string.isRequired,
    };

    state = {
        open: false,
        openedOnce: false,
    }

    toggleMenu = () => {
        this.setState(prevState => ({open: !prevState.open, openedOnce: true}));
    }

    render() {
        const {open, openedOnce} = this.state;

        return <div
            className={`services-menu${open ? ' opened' : ''}`}
            onClick={this.toggleMenu}
        >
            <MenuImg />
            {open || openedOnce ? <div
                className={'sm-content'}
            >
                <iframe
                    title={'services-menu'}
                    src={this.props.dashboardBaseUrl}
                    frameBorder="0"/>
            </div> : ''}
        </div>
    }
}
