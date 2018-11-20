import Utils from '~/utils/';
export default function({ store, req, redirect }) {
  if (process.server) {
    console.log(Utils.getCookie(req.headers.cookie, 'currentNickname'));
  }
  let isSettedNickName =
    process.server && !!req
      ? !!Utils.getCookie(req.headers.cookie, 'currentNickname') && Utils.getCookie(req.headers.cookie, 'currentNickname') !== '' && Utils.getCookie(req.headers.cookie, 'currentNickname') !== 'null'
      : store.getters.isSettedNickName;

  if (!isSettedNickName) {
    // 这玩意有问题的，首次进入网站总是会跳member
    return redirect('/member');
  }
}
