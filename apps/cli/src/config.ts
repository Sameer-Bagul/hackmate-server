import Conf from 'conf';

interface Config {
    token?: string;
    user?: {
        username: string;
        id: string;
    };
}

const config = new Conf<Config>({
    projectName: 'hackmate-cli',
});

export const saveToken = (token: string) => {
    config.set('token', token);
};

export const getToken = () => {
    return config.get('token');
};

export const saveUser = (user: { username: string; id: string }) => {
    config.set('user', user);
};

export const getUser = () => {
    return config.get('user');
};

export const logout = () => {
    config.clear();
};
