import axios from "axios";

const API_URL = "http://localhost:8989/";

class AuthService {
  login(username: string, password: string) {
    return axios
      .post(API_URL + "api/auth/signin", {
        username: username,
        password: password
      }
      )
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
  }

  register(username: string, email: string, password: string) {
    return axios.post(API_URL + "user", {
      username: username,
      email: email,
      password: password
    }
    );
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);

    return null;
  }
}

export default new AuthService();
