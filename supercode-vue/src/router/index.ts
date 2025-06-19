import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";      // 首页
import AdminView from "../views/adminView.vue";     // 管理入口页面
import ManageUser from "../views/manageUser.vue";   // 用户管理页面
import ManageProblem from "../views/manageProblem.vue";
import CodeView from "../views/CodeView.vue"; // 题目管理页面

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "Home",
            component: HomeView,
        },
        {
            path: "/admin",
            name: "Admin",
            component: AdminView,
        },
        {
            path: "/manage-user",
            name: "ManageUser",
            component: ManageUser,
        },
        {
            path: "/manage-problem",
            name: "ManageProblem",
            component: ManageProblem,
        },
        {
            path: "/code/:problemId",
            name: "Code",
            component: CodeView,
            props: true
        },
    ],
});
