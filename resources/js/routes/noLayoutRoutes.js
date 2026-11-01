// Pages that draw their own full-screen chrome (landing, errors, public FAQ/About).
import {
  MainPage, Pages402, Pages404, PublicPages404, FaqPublicPage, AboutPublicPage,
} from "./lazyPages";

export const noLayoutRoutes = [
  { path: "/404", component: Pages404 },
  { path: "/402", component: Pages402 },
  { path: "/", component: MainPage },
  { path: "/public-faq", component: FaqPublicPage },
  { path: "/public-about", component: AboutPublicPage },
  { path: "/public-404", component: PublicPages404 },
  { path: "*", component: PublicPages404 },
];
