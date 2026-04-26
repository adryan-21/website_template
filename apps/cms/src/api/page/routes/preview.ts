export default {
  routes: [
    {
      method: 'GET',
      path: '/pages/preview-url',
      handler: 'page.previewUrl',
      config: {
        auth: false,
      },
    },
  ],
};