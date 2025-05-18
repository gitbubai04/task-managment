const API_PREFIX = "/api/v1";
const ADMIN_PREFIX = API_PREFIX + "/admin";

export const LOGIN_URL = API_PREFIX + "/auth/signin";
export const LOGOUT_URL = API_PREFIX + "/auth/logout";
export const REGISTER_URL = API_PREFIX + "/auth/signup";
export const TASK_URL = API_PREFIX + "/task";
export const USER_PROFILE_URL = API_PREFIX + "/user/profile";
export const USER_PROFILE_CHANGE_URL = API_PREFIX + "/user/change-profile";
export const USER_ADMIN_URL = ADMIN_PREFIX + "/user";
