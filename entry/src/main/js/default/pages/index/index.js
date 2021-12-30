import router from '@system.router';

export default {
  data: {
    title: "Hello"
  },

  onShow() {

    setTimeout(() => {
        router.replace({ uri: "pages/game/index" });
      }, 500
    );
  }

}
