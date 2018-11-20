import Vue from "vue";
import vueBus from "vue-bus";
import VueClipboards from "vue-clipboards";
import VueCookies from "vue-cookies";
import * as filters from "~/utils/filter";
import Moment from "vue-moment";
import VueI18n from "vue-i18n";
import language from "~/common/i18n";
import Storage from "~/utils/storage";
import leancloud from "~/utils/leancloud";


Vue.use(vueBus);
Vue.use(VueClipboards);
Vue.use(VueCookies);
Vue.use(Moment);
Vue.use(VueI18n);
leancloud.init();


const VI18n = new VueI18n({
  locale: Storage.get("locale") || "zh_cn",
  messages: language
});

Vue.prototype.i18n = VI18n.messages.locale.App;
Object.keys(filters).forEach(key => Vue.filter(key, filters[key])); //install filters
