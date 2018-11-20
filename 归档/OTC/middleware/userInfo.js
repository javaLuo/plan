import { GET_USER_INFO_ACTIONS, GET_KYC_USER_INFO_ACTIONS } from '~/store/modules/member/type';

export default function({ store, req }) {
  if (process.server && !req) return;
  store.dispatch(GET_USER_INFO_ACTIONS);
  store.dispatch(GET_KYC_USER_INFO_ACTIONS);
}
