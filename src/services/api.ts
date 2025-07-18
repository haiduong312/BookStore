import axios from "services/axios.customize";
export const loginAPI = (username: string, password: string) => {
    const urlBackend = "/api/v1/auth/login";
    return axios.post<IBackendRes<ILogins>>(urlBackend, { username, password });
};
export const registerAPI = (
    fullName: string,
    password: string,
    email: string,
    phone: string
) => {
    const urlBackend = "/api/v1/user/register";
    return axios.post<IBackendRes<IRegister>>(urlBackend, {
        fullName,
        password,
        email,
        phone,
    });
};
