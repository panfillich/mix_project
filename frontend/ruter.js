import Home from './components/Home';
import Chat from './components/Chat'
import Generator from './components/Generator'
import NotFound from './components/NotFound'

export default {
    routes: [
        {
            path: '/',
            component: Home,
            exact: true
        },
        {
            path: '/chat',
            component: Chat,
            exact: true
        },
        {
            path: '/generator',
            component: Generator,
            exact: true
        },
        {
            path: '*',
            component: NotFound,
            exact: true
        }
    ],
    redirects: [
        {
            from: '/people',
            to: '/user',
            status: 301
        }
    ]
} 