import withSession from '@/lib/session'
import axios from 'axios';

export default withSession(async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, password } = req.body;
    console.log('Login attempt:', { username, password });

    //const loginUrl = process.env.BACKEND_API_HOST + '/api/login';
    const loginUrl = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/login';


    try {
        const response = await axios.post(loginUrl, { username, password });

        if (response.status === 200) {
            const { user, api_token } = response.data;

            req.session.set('user', user);
            req.session.set('api_token', api_token);
            await req.session.save();

            return res.json({ logged_in: true });
        }

        const status = response.data.message;
        const errors = response.data.errors;
        return res.json({ status, logged_in: false, errors });

    } catch (err) {
        let status = 'Something went wrong';
        let errors = null;

        console.error(err);
        if (err.response) {
            status = err.response.data.message;
            errors = err.response.data.errors;
        }
        return res.json({ logged_in: false, status, errors });
    }
});
