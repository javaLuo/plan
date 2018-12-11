export default function ({ route, store }) {
  store.commit('setCrumb', route.path)
}