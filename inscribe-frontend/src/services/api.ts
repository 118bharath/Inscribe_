import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                const refreshToken = localStorage.getItem("refreshToken")
                const res = await axios.post(
                    "http://localhost:8080/api/auth/refresh",
                    { refreshToken }
                )

                localStorage.setItem("accessToken", res.data.accessToken)
                error.config.headers.Authorization = `Bearer ${res.data.accessToken}`
                return axios(error.config)
            } catch {
                localStorage.clear()
                window.location.href = "/"
            }
        }
        return Promise.reject(error)
    }
)


export default api
