import axios from "services/axios.customize";
export const loginAPI = (username: string, password: string) => {
    const urlBackend = "/api/v1/auth/login";
    return axios.post<IBackendRes<ILogins>>(
        urlBackend,
        { username, password },
        {
            headers: {
                delay: 1500,
            },
        }
    );
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

export const fetchAccountAPI = () => {
    const urlBackend = "/api/v1/auth/account";
    return axios.get<IBackendRes<IFetchAccount>>(urlBackend, {
        headers: {
            delay: 1500,
        },
    });
};

export const logoutAPI = () => {
    const urlBackend = "/api/v1/auth/logout";
    return axios.post<IBackendRes<IRegister>>(urlBackend);
};

export const getUsersAPI = (query: string) => {
    const urlBackend = `/api/v1/user?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend);
};

export const createUserAPI = (
    fullName: string,
    email: string,
    phone: string,
    password: string
) => {
    const urlBackend = "/api/v1/user";
    return axios.post<IBackendRes<IRegister>>(urlBackend, {
        fullName,
        password,
        phone,
        email,
    });
};

export const bulkListUserAPI = (
    data: { fullName: string; email: string; phone: string; password: string }[]
) => {
    const urlBackend = "/api/v1/user/bulk-create";
    return axios.post<IBackendRes<IResponseImport>>(urlBackend, data);
};

export const updateUserAPI = (_id: string, fullName: string, phone: string) => {
    const urlBackend = "/api/v1/user";
    return axios.put<IBackendRes<IRegister>>(urlBackend, {
        _id,
        fullName,
        phone,
    });
};

export const deleteUserAPI = (_id: string) => {
    const urlBackend = `/api/v1/user/${_id}`;
    return axios.delete<IBackendRes<IRegister>>(urlBackend);
};

export const getBooksAPI = (query: string) => {
    const urlBackend = `/api/v1/book?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(urlBackend);
};

export const getBookCategoriesAPI = () => {
    const urlBackend = "/api/v1/database/category";
    return axios.get<IBackendRes<string[]>>(urlBackend);
};

export const uploadFileAPI = (fileImg: any, folder: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append("fileImg", fileImg);
    return axios<IBackendRes<{ fileUploaded: string }>>({
        method: "post",
        url: "/api/v1/file/upload",
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": folder,
        },
    });
};

export const createBookAPI = (
    thumbnail: string,
    slider: string[],
    mainText: string,
    author: string,
    price: number,
    quantity: number,
    category: string
) => {
    const urlBackend = "/api/v1/book";
    return axios.post<IBackendRes<IBookTable>>(urlBackend, {
        thumbnail,
        slider,
        mainText,
        author,
        price,
        quantity,
        category,
    });
};

export const updateBookAPI = (
    _id: string,
    thumbnail: string,
    slider: string[],
    mainText: string,
    author: string,
    price: number,
    quantity: number,
    category: string
) => {
    const urlBackend = `/api/v1/book/${_id}`;
    return axios.put<IBackendRes<IRegister>>(urlBackend, {
        thumbnail,
        slider,
        mainText,
        author,
        price,
        quantity,
        category,
    });
};

export const deleteBookAPI = (_id: string) => {
    const urlBackend = `/api/v1/book/${_id}`;
    return axios.delete<IBackendRes<IRegister>>(urlBackend);
};
