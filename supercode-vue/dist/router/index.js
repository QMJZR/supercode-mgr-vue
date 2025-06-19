import { createRouter, createWebHistory } from "vue-router";
import AdminView from "../views/adminView.vue"; // 路径根据你实际情况调整
export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/admin",
            name: "Admin",
            component: AdminView,
        },
    ],
});
