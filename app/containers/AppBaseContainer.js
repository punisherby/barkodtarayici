import React, {Component} from "react";
// Consts and Libs
import ReduxHelper from '../helper/ReduxHelper';
import {SCREENS_MAP} from "./screens";

/* Component ==================================================================== */
class AppBaseContainer extends Component {
    
    static navigatorStyle = {
        tabBarHidden: true,
        navBarHidden : true
    };

    constructor(props) {
        super(props);
    }

    onNavigatorEvent(event) {
        if (event.type == 'DeepLink') {
            const screen = event.link;
            const payload = event.payload;
            this.closeDrawer();
            this.startNewScreenStack(screen, payload);
        }
    }

    /**
     * read the passed props while navigation to active screen
     */
    getNavProps() {
        return this.props.navProps;
    }

    getScreenMap() {
        return SCREENS_MAP;
    }

    /**
     * Push screen to to screen stack and it will be visible
     * 
     * @param {*} props 
     */
    pushToActiveScreenStack(screenName, props = {}) {
        this.props.navigator.push({
            screen: screenName, // unique ID registered with Navigation.registerScreen
            passProps: {
                navProps : props
            }
        });
    }

    /**
     * Remove the current screen from stack and show the previos
     * screen
     * 
     */
    popPreviousInScreenStack() {
        this.props.navigator.pop({
            animated: true, // does the pop have transition animation or does it happen immediately (optional)
        });
    }

    /**
     * Reset the screen stack and put the screen to new stack and it will
     * be visible
     * 
     * @param {*} screenName 
     * @param {*} props 
     */
    startNewScreenStack(screenName, props = {}, animated = false) {
        this.props.navigator.resetTo({
            screen: screenName, // unique ID registered with Navigation.registerScreen,
            animated : animated,
            passProps: {
                navProps : props
            }
        });
    }

    navigateWithDeepLink(screenName, payload={}) {
        this.props.navigator.handleDeepLink({
            link: screenName,
            payload: payload
        });
    }

    closeDrawer() {
        this.props.navigator.toggleDrawer({
            side: 'left', // the side of the drawer since you can have two, 'left' / 'right'
            animated: true, // does the toggle have transition animation or does it happen immediately (optional)
            to: 'close' // optional, 'open' = open the drawer, 'closed' = close it, missing = the opposite of current state
        });
    }

    openDrawer() {
        this.props.navigator.toggleDrawer({
            side: 'left', // the side of the drawer since you can have two, 'left' / 'right'
            animated: true, // does the toggle have transition animation or does it happen immediately (optional)
            to: 'open' // optional, 'open' = open the drawer, 'closed' = close it, missing = the opposite of current state
        });
    }

    setStyle = (styleObj) => {

        if(!styleObj) {
            styleObj = this.navigatorStyle;
        } 

        this.props.navigator.setStyle({
            styleObj
        });
    } 
}

/* Export Component ==================================================================== */
export default AppBaseContainer;
