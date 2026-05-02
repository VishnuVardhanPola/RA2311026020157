export default {
  server: {
    proxy: {
      "/api": {
        target: "http://20.207.122.201",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
};