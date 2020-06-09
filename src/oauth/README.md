# OAuth

Your application must declare the `oauthClient` as below:

```js
// /app/src/oauth.js

import {OAuthClient} from "@alchemy-fr/phraseanet-react-components";

export const oauthClient = new OAuthClient({
    clientId: '...',
    clientSecret: '...',
    baseUrl: '...',
});
```

Then you can configure the route for intercepting OAuth response:
```js
// /app/src/App.js
import {OAuthRedirect} from "@alchemy-fr/phraseanet-react-components";
import {oauthClient} from "./oauth";

class App extends PureComponent {

    render() {
        return <Router>
            <Route path="/auth/:provider" component={props => {
                return <OAuthRedirect
                    {...props}
                    oauthClient={oauthClient}
                />
            }}/>
            {/* Your other routes */}
        </Router>
    }
}
```

Now you can add Authentication providers:
```js
// /app/src/Login.js

function Login() {
    return <OAuthProviders
       authBaseUrl={'https://auth.alchemy.local'}
       authClientId={'...'}
       providers={[{
            name: 'github',
            title: 'Github',
            type: 'oauth',
       }]}
   />
}
```
