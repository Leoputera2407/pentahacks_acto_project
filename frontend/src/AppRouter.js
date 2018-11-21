import React from 'react';
import createHistory from 'history/createBrowserHistory';
import {Router,Switch,Route } from 'react-router-dom';
import HomePage from './HomePage';
import LoadingPage from './LoadingPage';
export const history = createHistory();
const AppRouter =()=> (
    <Router history={history}>
            <Switch>
                <Route path="/" render={(props)=><HomePage {...props}/>} exact = {true}/>
                <Route path="/loading" render={(props)=><LoadingPage {...props}/>} exact = {true}/>
                <Route render={()=>(
                    <div>
                        <h1> ROUTE NOT FOUND</h1>
                        <button onClick={()=>history.push('/')}>Go back to Main page</button>
                    </div>
                )}/>
            </Switch>
    </Router>
);
export default AppRouter;
