const API_PREFIX = "/api/v1";
const ADMIN_PREFIX = API_PREFIX + "/admin";

export const LOGIN_URL = API_PREFIX + "/auth/signin";
export const LOGOUT_URL = API_PREFIX + "/auth/logout";
export const REGISTER_URL = API_PREFIX + "/auth/signup";
export const USER_PROFILE_URL = API_PREFIX + "/user/profile";
export const ADMIN_PROFILE_URL = ADMIN_PREFIX + "/user/profile";
export const USER_PROFILE_CHANGE_URL = API_PREFIX + "/user/change-profile";
export const ADMIN_PROFILE_CHANGE_URL = ADMIN_PREFIX + "/user/change-profile";

export const ADD_TASK_URL = API_PREFIX + "/task/add";
export const GET_TASKS_URL = API_PREFIX + "/task/all";
export const GET_TASK_BY_ID_URL = API_PREFIX + "/task/get";
export const UPDATE_TASK_BY_ID_URL = API_PREFIX + "/task/update";
export const DELETE_TASK_BY_ID_URL = API_PREFIX + "/task/delete/";
export const CHANGE_TASK_STATUS_BY_ID_URL = API_PREFIX + "/task/change-status/";
export const GET_CALENDAR_TASKS_URL = API_PREFIX + "/task/get-all";

export const GET_USERS_URL = ADMIN_PREFIX + "/user/all";
export const DELETE_USER_BY_ID_URL = ADMIN_PREFIX + "/user/delete/";
export const CHANGE_USER_STATUS_BY_ID_URL = ADMIN_PREFIX + "/user/change-status/";
