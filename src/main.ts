import { createApp } from "vue";

import "element-plus/es/components/message/style/css";
import "element-plus/es/components/loading/style/css";
import "element-plus/es/components/message-box/style/css";
import "element-plus/es/components/notification/style/css";
import "./styles/preflight.css";
import "./styles/tailwind.css";
import "./style.css";
import App from "./App.vue";
import { routerPlugin } from "./routers";

const app = createApp(App);

app.use(routerPlugin);

app.mount("#app");
